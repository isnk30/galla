"use client"

import type { ReactNode } from "react"

type Props = {
  side: "left" | "right"
  label: string
  onClick: () => void
  children: ReactNode
  static?: boolean
}

export default function CornerButton({ side, label, onClick, children, static: isStatic = false }: Props) {
  return (
    <div className={`fixed bottom-10 z-20 bg-surface p-[5px] shadow-control transition-[box-shadow] duration-150 ease-out hover:shadow-control-hover focus-within:shadow-control-hover ${side === "left" ? "left-10" : "right-10"}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={`relative flex size-8 items-center justify-center text-[12px] font-mono tracking-[-0.04em] text-ink opacity-50 transition-[scale,opacity,background-color] duration-150 ease-out hover:bg-hover hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink after:absolute after:-inset-[5px] ${isStatic ? "" : "motion-safe:active:scale-[0.96]"}`}
      >
        {children}
      </button>
    </div>
  )
}
