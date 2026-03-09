"use client"

type View = "canvas" | "flow"

type Props = {
  view: View
  onViewChange: (v: View) => void
}

export default function BottomNav({ view, onViewChange }: Props) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-[2px] bg-white p-[5px] border border-[#DFDFDF]">
      <button
        onClick={() => onViewChange("canvas")}
        className={`flex items-center justify-center w-16 px-[9px] py-[3px] text-[12px] font-mono uppercase tracking-[-0.04em] transition-all ${
          view === "canvas" ? "bg-[#eee] text-black" : "text-black opacity-50 hover:opacity-100 hover:bg-[#eee]"
        }`}
      >
        Canvas
      </button>
      <button
        onClick={() => onViewChange("flow")}
        className={`flex items-center justify-center w-16 px-[9px] py-[3px] text-[12px] font-mono uppercase tracking-[-0.04em] transition-all ${
          view === "flow" ? "bg-[#eee] text-black" : "text-black opacity-50 hover:opacity-100 hover:bg-[#eee]"
        }`}
      >
        Flow
      </button>
    </div>
  )
}
