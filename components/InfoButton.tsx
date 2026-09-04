"use client"

import CornerButton from "@/components/CornerButton"

type Props = {
  onClick: () => void
}

export default function InfoButton({ onClick }: Props) {
  return (
    <CornerButton side="left" label="About Galla" onClick={onClick}>
      i
    </CornerButton>
  )
}
