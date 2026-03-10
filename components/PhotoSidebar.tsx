"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import type { Photo } from "@/lib/photos"

const MIN_WIDTH = 420
const MAX_WIDTH = 650

type Props = {
  photo: Photo | null
  onClose: () => void
}

export default function PhotoSidebar({ photo, onClose }: Props) {
  const isOpen = photo !== null
  const [width, setWidth] = useState(MIN_WIDTH)
  const [handleHovered, setHandleHovered] = useState(false)
  const resizing = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    resizing.current = true
    startX.current = e.clientX
    startWidth.current = width
    e.preventDefault()
  }, [width])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizing.current) return
      const delta = startX.current - e.clientX
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta)))
    }
    const onMouseUp = () => { resizing.current = false }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed top-0 right-0 bottom-0 w-full z-30 flex flex-col sm:border-l bg-white transition-colors duration-150 ${handleHovered ? "border-[#999]" : "border-[#DFDFDF]"}`}
            style={{ width: typeof window !== "undefined" && window.innerWidth >= 640 ? width : undefined }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
          >
            {/* Resize handle — left edge, desktop only */}
            <div
              onMouseDown={onResizeStart}
              className="hidden sm:block absolute left-0 top-0 bottom-0 w-1 cursor-col-resize"
              onMouseEnter={() => setHandleHovered(true)}
              onMouseLeave={() => setHandleHovered(false)}
            />

            {/* Close button — left edge on desktop, centered below metadata on mobile */}
            <motion.button
              onClick={onClose}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-white border border-[#DFDFDF] border-r-0 w-8 h-10 items-center justify-center text-[#555] text-xl leading-[0] pb-0.5 hover:bg-[#f5f5f5]"
            >
              »
            </motion.button>

            {/* Image + metadata grouped, centered vertically */}
            <div className="flex flex-col items-stretch justify-center h-full px-5 gap-3">
              {photo && (
                <>
                  <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                    <Image
                      src={photo.src}
                      alt={photo.date ?? "photo"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 420px"
                    />
                  </div>

                  <motion.div
                    className="flex items-center justify-between shrink-0"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                  >
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
                  </motion.div>

                  {/* Mobile close button — centered below metadata */}
                  <motion.button
                    onClick={onClose}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="sm:hidden self-center bg-white border border-[#DFDFDF] w-8 h-8 flex items-center justify-center text-[#555] text-xl leading-none hover:bg-[#f5f5f5]"
                  >
                    »
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
