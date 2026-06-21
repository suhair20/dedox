"use client";

import { useState } from "react";
import Image from "next/image";

export const NOTE_ERROR_IMAGE = "/images/notesection/error-image.svg";

type NoteCardImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export default function NoteCardImage({
  src,
  alt,
  className = "object-cover transition-transform duration-700 group-hover:scale-105",
  sizes = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw",
}: NoteCardImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      unoptimized
      draggable={false}
      sizes={sizes}
      className={className}
      onError={() => {
        if (imgSrc !== NOTE_ERROR_IMAGE) {
          setImgSrc(NOTE_ERROR_IMAGE);
        }
      }}
    />
  );
}
