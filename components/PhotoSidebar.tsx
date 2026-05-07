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
            transition={{ type: "spring", stiffness: 500, damping: 50, bounce: 0 }}
          >
            {/* Resize handle — 40px hit strip; narrow visual affordance */}
            <div
              onMouseDown={onResizeStart}
              className="hidden sm:flex absolute left-0 top-0 bottom-0 w-10 -translate-x-1/2 cursor-col-resize items-center justify-center"
              onMouseEnter={() => setHandleHovered(true)}
              onMouseLeave={() => setHandleHovered(false)}
              aria-hidden
            >
              <div className="h-full w-px bg-transparent" />
            </div>

            {/* Close button — left edge on desktop, centered below metadata on mobile */}
            <motion.button
              type="button"
              onClick={onClose}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:flex absolute left-0 top-1/2 min-h-10 min-w-10 -translate-x-full -translate-y-1/2 items-center justify-center border border-[#DFDFDF] border-r-0 bg-white pb-0.5 text-xl leading-[0] text-[#555] transition-transform hover:bg-[#f5f5f5] active:scale-[0.96]"
            >
              »
            </motion.button>

            {/* Image + metadata grouped, centered vertically */}
            <div className="flex flex-col items-stretch justify-center h-full px-5 gap-3">
              {photo && (
                <>
                  <div className="relative w-full" style={{ aspectRatio: `${photo.width}/${photo.height}` }}>
                    <Image
                      src={photo.src}
                      alt={photo.date ?? "photo"}
                      fill
                      className="object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
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
                    type="button"
                    onClick={onClose}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex size-10 items-center justify-center self-center border border-[#DFDFDF] bg-white text-xl leading-none text-[#555] transition-transform hover:bg-[#f5f5f5] active:scale-[0.96] sm:hidden"
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
