"use client"

type Props = {
  onClick: () => void
}

export default function InfoButton({ onClick }: Props) {
  return (
    <div className="fixed bottom-10 left-10 z-20 bg-white p-[5px] border border-[#DFDFDF]">
      <button
        onClick={onClick}
        className="flex items-center justify-center aspect-square px-[9px] py-[3px] text-[12px] font-mono tracking-[-0.04em] text-black opacity-50 hover:opacity-100 hover:bg-[#eee] transition-all"
      >
        i
      </button>
    </div>
  )
}
