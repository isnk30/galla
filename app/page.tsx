"use client"

import { useState, useEffect } from "react"
import InfiniteCanvas from "@/components/InfiniteCanvas"
import PhotoSidebar from "@/components/PhotoSidebar"
import BottomNav from "@/components/BottomNav"
import InfoButton from "@/components/InfoButton"
import InfoModal from "@/components/InfoModal"
import type { Photo } from "@/lib/photos"

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [view, setView] = useState<"canvas" | "flow">("canvas")
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    fetch("/photos/photos.json")
      .then((r) => r.json())
      .then(setPhotos)
      .catch(console.error)
  }, [])

  return (
    <main className="flex w-screen h-screen overflow-hidden bg-white">
      <InfiniteCanvas
        photos={photos}
        onPhotoClick={setSelectedPhoto}
      />
      <PhotoSidebar photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      <BottomNav view={view} onViewChange={setView} />
      <InfoButton onClick={() => setInfoOpen(true)} />
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </main>
  )
}
