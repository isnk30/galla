"use client"

import Image from "next/image"
import { motion } from "motion/react"
import type { Photo } from "@/lib/photos"

type Props = {
  photos: Photo[]
}

export default function FlowView({ photos }: Props) {
  return (
    <motion.div
      className="fixed inset-0 bg-white overflow-y-scroll z-[15]"
      style={{ scrollSnapType: "y mandatory" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {photos.map((photo, i) => (
        <div
          key={i}
          className="h-screen flex flex-col items-center justify-center gap-3 px-6"
          style={{ scrollSnapAlign: "center" }}
        >
          <div className="relative w-full max-w-[420px]" style={{ aspectRatio: "3/4" }}>
            <Image
              src={photo.src}
              alt={photo.date ?? "photo"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80vw, 420px"
            />
          </div>

          {(photo.date || photo.camera) && (
            <div className="flex items-center justify-between w-full max-w-[420px]">
              {photo.date && (
                <span className="font-mono text-[12px] uppercase tracking-[-0.04em] text-black">
                  {photo.date}
                </span>
              )}
              {photo.camera && (
                <span className="font-mono text-[12px] uppercase tracking-[-0.04em] text-black">
                  Taken with{" "}
                  {photo.cameraUrl ? (
                    <a
                      href={photo.cameraUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {photo.camera}
                    </a>
                  ) : (
                    photo.camera
                  )}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  )
}
