"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const TOTAL_FRAMES = 240;
const FRAME_RATE = 24;
const MAX_DPR = 1.5;
const PRELOAD_AHEAD = 10;
const PRELOAD_BEHIND = 2;
const MAX_CACHE_SIZE = 40;
const MAX_FRAME_LOOKUP_DISTANCE = 16;

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingRef = useRef<Set<number>>(new Set());
  const rafRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const currentFrameRef = useRef(1);
  const lastFrameTimeRef = useRef(0);

  const formatIndex = (index: number) => index.toString().padStart(3, "0");
  const wrapFrame = (frame: number) => {
    const mod = ((frame - 1) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
    return mod + 1;
  };

  const circularDistance = (a: number, b: number) => {
    const diff = Math.abs(a - b);
    return Math.min(diff, TOTAL_FRAMES - diff);
  };

  const frameSrc = (frame: number) =>
    `/images/herosection/ezgif-frame-${formatIndex(frame)}.png`;

  const trimCache = (centerFrame: number) => {
    const cache = imagesRef.current;
    if (cache.size <= MAX_CACHE_SIZE) return;

    const entries = Array.from(cache.keys()).map((frame) => ({
      frame,
      dist: circularDistance(frame, centerFrame),
    }));
    entries.sort((a, b) => b.dist - a.dist);

    for (const { frame } of entries) {
      if (cache.size <= MAX_CACHE_SIZE) break;
      cache.delete(frame);
    }
  };

  const loadFrame = (frame: number, onLoad?: () => void) => {
    const f = wrapFrame(frame);
    if (imagesRef.current.has(f) || loadingRef.current.has(f)) return;

    const img = new window.Image();
    img.decoding = "async";
    loadingRef.current.add(f);

    img.onload = () => {
      loadingRef.current.delete(f);
      imagesRef.current.set(f, img);
      trimCache(currentFrameRef.current);
      onLoad?.();
    };

    img.onerror = () => {
      loadingRef.current.delete(f);
    };

    img.src = frameSrc(f);
  };

  const preloadAround = (centerFrame: number) => {
    for (let i = -PRELOAD_BEHIND; i <= PRELOAD_AHEAD; i++) {
      loadFrame(centerFrame + i);
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }
  };

  const draw = (frame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = imagesRef.current.get(frame);
    if (!img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;
    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasAspect > imgAspect) {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  const findNearestLoadedFrame = (targetFrame: number) => {
    if (imagesRef.current.has(targetFrame)) return targetFrame;

    for (let distance = 1; distance <= MAX_FRAME_LOOKUP_DISTANCE; distance++) {
      const ahead = wrapFrame(targetFrame + distance);
      if (imagesRef.current.has(ahead)) return ahead;

      const behind = wrapFrame(targetFrame - distance);
      if (imagesRef.current.has(behind)) return behind;
    }

    return null;
  };

  useEffect(() => {
    resizeCanvas();
    loadFrame(1, () => draw(1));
    preloadAround(1);

    const frameInterval = 1000 / FRAME_RATE;
    const animate = (ts: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = ts;
      }

      const elapsed = ts - lastFrameTimeRef.current;
      if (elapsed >= frameInterval) {
        const steps = Math.floor(elapsed / frameInterval);
        lastFrameTimeRef.current += steps * frameInterval;

        const desiredFrame = wrapFrame(currentFrameRef.current + steps);
        const renderFrame = findNearestLoadedFrame(desiredFrame);

        if (renderFrame !== null) {
          currentFrameRef.current = renderFrame;
          draw(renderFrame);
        } else {
          // Keep progress smooth under slow networks by requesting the target frame explicitly.
          loadFrame(desiredFrame);
        }

        preloadAround(currentFrameRef.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeCanvas();
        draw(currentFrameRef.current);
      });
    };

    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      window.removeEventListener("resize", onResize);
      imagesRef.current.clear();
      loadingRef.current.clear();
    };
  }, []);

  return (
    <section className="relative w-full h-[80vh] bg-black overflow-hidden">
      <Image
        src="/images/herosection/ezgif-frame-001.png"
        alt="Hero Background"
        fill
        priority
        className="object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />
    </section>
  );
}
