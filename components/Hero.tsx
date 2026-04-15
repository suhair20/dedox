"use client";

import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 240;
const FRAME_RATE = 30;

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<{ [key: number]: HTMLImageElement }>({});

  const formatIndex = (index: number) => index.toString().padStart(3, "0");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let startTime: number | null = null;

    // 1. Pre-generate the image objects (starts downloading immediately)
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/images/herosection/ezgif-frame-${formatIndex(i)}.png`;
      imagesRef.current[i] = img;
    }

    const draw = (frame: number) => {
      const img = imagesRef.current[frame];
      if (!img || !img.complete) return; // Skip if not downloaded yet

      // Sync canvas size to window
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;

      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

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

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const frame = (Math.floor((elapsed / 1000) * FRAME_RATE) % TOTAL_FRAMES) + 1;

      draw(frame);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="relative w-full h-[80vh] bg-black overflow-hidden">
      {/* This <img> tag acts as a "placeholder" or "poster". 
        It shows frame 001 instantly while the JS and Canvas warm up.
      */}
      <img
        src="/images/herosection/ezgif-frame-001.png"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover opacity-100"
      />
      
      {/* The Canvas sits on top and starts drawing as soon as frames arrive */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />
    </section>
  );
}