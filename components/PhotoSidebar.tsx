"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import type { Photo } from "@/lib/photos"

type Props = {
  photo: Photo | null
  onClose: () => void
}

export default function PhotoSidebar({ photo, onClose }: Props) {
  const isOpen = photo !== null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-[420px] bg-white z-30 flex flex-col border-l border-[#DFDFDF]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 38 }}
          >
            {/* Close button — left edge, vertically centered */}
            <motion.button
              onClick={onClose}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-white border border-[#DFDFDF] border-r-0 w-8 h-10 flex items-center justify-center text-[#555] text-xl leading-none hover:bg-[#f5f5f5]"
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
                      sizes="420px"
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
                            className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                          >
                            {photo.camera}
                          </a>
                        ) : (
                          photo.camera
                        )}
                      </span>
                    )}
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
