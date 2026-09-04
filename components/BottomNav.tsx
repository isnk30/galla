"use client"

type View = "canvas" | "flow"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

export default function BottomNav({ view, onViewChange }: Props) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-[2px] bg-surface p-[5px] shadow-control transition-[box-shadow] duration-150 ease-out hover:shadow-control-hover focus-within:shadow-control-hover">
      <button
        type="button"
        onClick={() => onViewChange("canvas")}
        aria-pressed={view === "canvas"}
        className={`relative flex min-h-8 min-w-10 items-center justify-center px-3 text-[12px] font-mono uppercase tracking-[-0.04em] transition-[scale,opacity,background-color] duration-150 ease-out motion-safe:active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink after:absolute after:inset-x-0 after:-inset-y-[5px] ${
          view === "canvas" ? "bg-hover text-ink" : "text-ink opacity-50 hover:opacity-100 hover:bg-hover"
        }`}
      >
        Canvas
      </button>
      <button
        type="button"
        onClick={() => onViewChange("flow")}
        aria-pressed={view === "flow"}
        className={`relative flex min-h-8 min-w-10 items-center justify-center px-3 text-[12px] font-mono uppercase tracking-[-0.04em] transition-[scale,opacity,background-color] duration-150 ease-out motion-safe:active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink after:absolute after:inset-x-0 after:-inset-y-[5px] ${
          view === "flow" ? "bg-hover text-ink" : "text-ink opacity-50 hover:opacity-100 hover:bg-hover"
        }`}
      >
        Flow
      </button>
    </div>
  )
}
