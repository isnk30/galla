"use client"

type View = "canvas" | "flow"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

export default function BottomNav({ view, onViewChange }: Props) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-[2px] bg-surface p-[5px] shadow-control">
      <button
        type="button"
        onClick={() => onViewChange("canvas")}
        className={`flex min-h-8 min-w-10 items-center justify-center px-3 text-[12px] font-mono uppercase tracking-[-0.04em] transition-[transform,opacity,background-color] duration-150 active:scale-[0.96] ${
          view === "canvas" ? "bg-hover text-ink" : "text-ink opacity-50 hover:opacity-100 hover:bg-hover"
        }`}
      >
        Canvas
      </button>
      <button
        type="button"
        onClick={() => onViewChange("flow")}
        className={`flex min-h-8 min-w-10 items-center justify-center px-3 text-[12px] font-mono uppercase tracking-[-0.04em] transition-[transform,opacity,background-color] duration-150 active:scale-[0.96] ${
          view === "flow" ? "bg-hover text-ink" : "text-ink opacity-50 hover:opacity-100 hover:bg-hover"
        }`}
      >
        Flow
      </button>
    </div>
  )
}
