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
              this is a photo gallery designed and built by{" "}
              <a
                href="https://x.com/isnk30"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
              >
                israel kamuanga
              </a>
              , and consisting of his own photography. this was made in a couple short days to give him a place to put up the best photos he's taken, and encourage him to take more. the date under this text should be somewhat recent, otherwise, he's slacking. enjoy!
            </p>
            <p className="font-mono text-[12px] tracking-[-0.04em] text-black opacity-50 leading-relaxed mt-3">
              last updated: march 9, 2026
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
