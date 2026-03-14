"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, usePresence } from "motion/react"
import type { Photo } from "@/lib/photos"

type Props = {
  photos: Photo[]
}

const CARD_H = 500
const GAP = 40
const TARGET_SPEED = 110 / 60   // px per frame at 60fps (~110px/s)
const EXIT_SPEED = TARGET_SPEED * 12
const INITIAL_SPEED_MULT = 22
const DECAY = 0.03
const DECAY_EXIT = 0.07
const DECAY_HOVER = 0.1

function cardWidth(photo: Photo) {
  return Math.round(CARD_H * (photo.width / photo.height))
}

export default function FlowView({ photos }: Props) {
  const stripRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const [isPresent] = usePresence()
  const isPresentRef = useRef(isPresent)
  isPresentRef.current = isPresent

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const hoveredRef = useRef<number | null>(null)

  const items = [...photos, ...photos]
  const loopWidth = photos.reduce((sum, p) => sum + cardWidth(p) + GAP, 0)

  useEffect(() => {
    let pos = 0
    let speed = TARGET_SPEED * INITIAL_SPEED_MULT

    const step = () => {
      const exiting = !isPresentRef.current
      const hovered = hoveredRef.current !== null
      const target = exiting ? EXIT_SPEED : hovered ? 0 : TARGET_SPEED
      const decay = exiting ? DECAY_EXIT : hovered ? DECAY_HOVER : DECAY
      speed += (target - speed) * decay
      pos = (pos + speed) % loopWidth
      if (stripRef.current) {
        stripRef.current.style.transform = `translateX(-${pos}px)`
      }
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [loopWidth])

  const totalStripWidth = loopWidth * 2

  return (
    <motion.div
      className="fixed inset-0 bg-white z-[15] flex items-center overflow-hidden"
      style={{ pointerEvents: isPresent ? "auto" : "none" }}
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
          const dimmed = hoveredIdx !== null && hoveredIdx !== i
          return (
            <div
              key={i}
              style={{
                width: w,
                flexShrink: 0,
                opacity: dimmed ? 0.3 : 1,
                transition: "opacity 0.3s ease",
              }}
              className="flex flex-col gap-3"
              onMouseEnter={() => { hoveredRef.current = i; setHoveredIdx(i) }}
              onMouseLeave={() => { hoveredRef.current = null; setHoveredIdx(null) }}
            >
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
