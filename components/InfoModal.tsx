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
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#DFDFDF] p-4 w-[370px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[16px] tracking-[-0.04em] text-black">hey hey</span>
              <button
                onClick={onClose}
                className="font-mono text-[12px] tracking-[-0.04em] text-black opacity-50 hover:opacity-100 hover:bg-[#eee] px-[9px] py-[3px] transition-all"
              >
                X
              </button>
            </div>
            <p className="font-mono text-[12px] tracking-[-0.04em] text-black opacity-70 leading-relaxed">
              first, im not a photographer and won't ever claim to be, but i do like taking pictures. this project i've designed and built is a place for me to put the best photos i've taken. but to make it a bit more fun i've add touches of my own drawing to each picture.
            </p>
            <p className="font-mono text-[12px] tracking-[-0.04em] text-black opacity-70 leading-relaxed mt-3">
              the goal is to use this as pressure for myself to find more picture worthy moments more often and have a nice place to put them all. hope you enjoy.
            </p>
            <p className="font-mono text-[12px] tracking-[-0.04em] text-black opacity-50 leading-relaxed mt-3">
              last updated: mar 10, 2026.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
