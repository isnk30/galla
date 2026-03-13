"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import type { Photo } from "@/lib/photos"

type Props = {
  photos: Photo[]
}

const CARD_H = 500
const GAP = 40
const TARGET_SPEED = 110 / 60 // px per frame at 60fps (~110px/s)
const INITIAL_SPEED_MULT = 22  // burst in at 22x
const DECAY = 0.03             // lerp factor toward target speed per frame

function cardWidth(photo: Photo) {
  return Math.round(CARD_H * (photo.width / photo.height))
}

export default function FlowView({ photos }: Props) {
  const stripRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)

  const items = [...photos, ...photos]
  const loopWidth = photos.reduce((sum, p) => sum + cardWidth(p) + GAP, 0)

  useEffect(() => {
    let pos = 0
    let speed = TARGET_SPEED * INITIAL_SPEED_MULT

    const step = () => {
      speed += (TARGET_SPEED - speed) * DECAY
      pos = (pos + speed) % loopWidth
      if (stripRef.current) {
        stripRef.current.style.transform = `translateX(-${pos}px)`
      }
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [loopWidth])

  const totalStripWidth = items.reduce((sum, p) => sum + cardWidth(p) + GAP, 0)

  return (
    <motion.div
      className="fixed inset-0 bg-white z-[15] flex items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div
        ref={stripRef}
        className="flex items-end"
        style={{
          gap: GAP,
          paddingLeft: GAP,
          width: `${totalStripWidth}px`,
          willChange: "transform",
        }}
      >
        {items.map((photo, i) => {
          const w = cardWidth(photo)
          return (
            <div key={i} style={{ width: w, flexShrink: 0 }} className="flex flex-col gap-3">
              <Image
                src={photo.src}
                alt={photo.date ?? "photo"}
                width={photo.width}
                height={photo.height}
                style={{ width: w, height: CARD_H }}
                sizes={`${w}px`}
              />

              <div className="flex items-center justify-between">
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
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
