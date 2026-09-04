"use client"

import { AnimatePresence, motion } from "motion/react"

type Props = {
  open: boolean
  onClose: () => void
}

export default function InfoModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-[min(370px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 bg-surface p-4 shadow-control"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="mb-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0, delay: 0.05 }}
            >
              <span className="text-balance font-mono text-[16px] tracking-[-0.04em] text-ink">
                hey hey
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close about dialog"
                className="relative flex min-h-8 min-w-8 items-center justify-center font-mono text-[12px] tracking-[-0.04em] text-ink opacity-50 transition-[opacity,background-color,scale] duration-150 ease-out hover:bg-hover hover:opacity-100 motion-safe:active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink after:absolute after:-inset-1"
              >
                X
              </button>
            </motion.div>
            <motion.p
              className="text-pretty font-mono text-[12px] leading-relaxed tracking-[-0.04em] text-ink opacity-70"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0, delay: 0.15 }}
            >
              {
                "first, im not a photographer and won't ever claim to be, but i do like taking pictures. this project i've designed and built is a place for me to put the best photos i've taken. but to make it a bit more fun i've add touches of my own drawing to each picture."
              }
            </motion.p>
            <motion.p
              className="mt-3 text-pretty font-mono text-[12px] leading-relaxed tracking-[-0.04em] text-ink opacity-70"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0, delay: 0.25 }}
            >
              the goal is to use this as pressure for myself to find more picture worthy moments more often and have a nice place to put them all. hope you enjoy.
            </motion.p>
            <motion.p
              className="mt-3 font-mono text-[12px] leading-relaxed tracking-[-0.04em] text-ink opacity-50 text-pretty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0, delay: 0.35 }}
            >
              last updated: sep 4, 2026.
            </motion.p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
