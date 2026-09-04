"use client"

import type { ReactNode } from "react"

type Props = {
  side: "left" | "right"
  label: string
  onClick: () => void
  children: ReactNode
}

export default function CornerButton({ side, label, onClick, children }: Props) {
  return (
    <div className={`fixed bottom-10 z-20 bg-surface p-[5px] shadow-control ${side === "left" ? "left-10" : "right-10"}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="relative flex size-8 items-center justify-center text-[12px] font-mono tracking-[-0.04em] text-ink opacity-50 transition-[transform,opacity,background-color] duration-150 hover:bg-hover hover:opacity-100 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink after:absolute after:-inset-[5px]"
      >
        {children}
      </button>
    </div>
  )
}
