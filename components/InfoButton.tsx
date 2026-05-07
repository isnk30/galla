"use client"

type Props = {
  onClick: () => void
}

export default function InfoButton({ onClick }: Props) {
  return (
    <div className="fixed bottom-10 left-10 z-20 bg-white p-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        onClick={onClick}
        className="flex size-8 items-center justify-center text-[12px] font-mono tracking-[-0.04em] text-black opacity-50 transition-[transform,opacity,background-color] duration-150 hover:bg-[#eee] hover:opacity-100 active:scale-[0.96]"
      >
        i
      </button>
    </div>
  )
}
