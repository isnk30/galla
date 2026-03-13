"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "motion/react"
import InfiniteCanvas from "@/components/InfiniteCanvas"
import FlowView from "@/components/FlowView"
import PhotoSidebar from "@/components/PhotoSidebar"
import BottomNav from "@/components/BottomNav"
import InfoButton from "@/components/InfoButton"
import InfoModal from "@/components/InfoModal"
import type { Photo } from "@/lib/photos"

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [view, setView] = useState<"canvas" | "flow">("canvas")
  const [canvasIntroKey, setCanvasIntroKey] = useState(0)
  const [canvasExiting, setCanvasExiting] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    fetch("/photos/photos.json")
      .then((r) => r.json())
      .then((data) => { setPhotos(data); setLoading(false) })
      .catch(console.error)
  }, [])

  return (
    <main className="flex w-screen h-screen overflow-hidden bg-white relative">
      <div
        className={`fixed inset-0 flex items-center justify-center pointer-events-none z-[1] transition-opacity duration-[800ms] delay-[600ms] ${loading ? "opacity-100" : "opacity-0"}`}
      >
        <span className="font-mono text-[12px] uppercase tracking-[-0.04em] text-black">Loading...</span>
      </div>
      <InfiniteCanvas
        photos={photos}
        onPhotoClick={setSelectedPhoto}
        replayKey={canvasIntroKey}
        isExiting={canvasExiting}
        onExitDone={() => { setView("flow"); setCanvasExiting(false) }}
      />
      <AnimatePresence>
        {view === "flow" && <FlowView key="flow" photos={photos} />}
      </AnimatePresence>
      <PhotoSidebar photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      <BottomNav view={view} onViewChange={(v) => {
        if (v === "flow") {
          setSelectedPhoto(null)
          setCanvasExiting(true)
        } else {
          setView("canvas")
          setCanvasIntroKey(k => k + 1)
        }
      }} />
      <InfoButton onClick={() => setInfoOpen(true)} />
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </main>
  )
}
