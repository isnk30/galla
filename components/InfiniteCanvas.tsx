"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import type { Photo } from "@/lib/photos"

const CELL_W = 200
const CELL_H = 260
const GAP = 48
const TILE_W = CELL_W + GAP
const TILE_H = CELL_H + GAP
const MIN_SCALE = 0.45
const STAGGER_MS = 50
const INTRO_DURATION = 800

type Props = {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
}

type Cell = {
  col: number
  row: number
  el: HTMLDivElement
  img: HTMLImageElement
  photoIdx: number
  introDelay: number
}

export default function InfiniteCanvas({ photos, onPhotoClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef({ x: GAP / 2, y: GAP / 2 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const inertiaRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const cellsRef = useRef<Cell[]>([])

  // Keep latest props accessible inside RAF without re-creating the loop
  const photosRef = useRef<Photo[]>(photos)
  const onClickRef = useRef(onPhotoClick)
  photosRef.current = photos
  onClickRef.current = onPhotoClick

  const [windowSize, setWindowSize] = useState({ w: 1440, h: 900 })
  useEffect(() => {
    const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const { w: canvasW, h: canvasH } = windowSize

  // Build the DOM grid and start the RAF loop imperatively.
  // React never touches the grid cells — zero re-renders during panning.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    // Tear down previous cells
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    grid.innerHTML = ""
    cellsRef.current = []

    const cols = Math.ceil(canvasW / TILE_W) + 4
    const rows = Math.ceil(canvasH / TILE_H) + 4
    const startCol = -Math.floor(cols / 2) - 1
    const startRow = -Math.floor(rows / 2) - 1
    const endCol = Math.ceil(cols / 2) + 1
    const endRow = Math.ceil(rows / 2) + 1

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const el = document.createElement("div")
        el.style.cssText = [
          "position:absolute",
          `width:${CELL_W}px`,
          `height:${CELL_H}px`,
          "transform-origin:center",
          "overflow:hidden",
          "cursor:pointer",
          "will-change:transform",
          "user-select:none",
        ].join(";")

        const img = document.createElement("img")
        img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;"
        img.draggable = false
        el.appendChild(img)

        const introDelay = ((col - startCol) + (row - startRow)) * STAGGER_MS
        const cell: Cell = { col, row, el, img, photoIdx: -1, introDelay }
        cellsRef.current.push(cell)

        el.addEventListener("click", () => {
          const p = photosRef.current
          if (cell.photoIdx >= 0 && cell.photoIdx < p.length) {
            onClickRef.current(p[cell.photoIdx])
          }
        })

        grid.appendChild(el)
      }
    }

    // RAF loop — all panning, scaling, and photo assignment happens here
    const maxDist = Math.sqrt((canvasW / 2) ** 2 + (canvasH / 2) ** 2)
    let lastTileShiftX = Infinity
    let lastTileShiftY = Infinity
    let lastPhotoCount = 0
    let introStartTime: number | null = null

    const loop = () => {
      const now = performance.now()
      const { x: ox, y: oy } = offsetRef.current
      const baseX = ((ox % TILE_W) + TILE_W) % TILE_W
      const baseY = ((oy % TILE_H) + TILE_H) % TILE_H
      const tileShiftX = Math.floor(ox / TILE_W)
      const tileShiftY = Math.floor(oy / TILE_H)
      const photoCount = photosRef.current.length

      // Force reassignment when photos first load; kick off intro animation
      if (photoCount !== lastPhotoCount) {
        if (introStartTime === null && photoCount > 0) introStartTime = now
        lastPhotoCount = photoCount
        lastTileShiftX = Infinity
      }

      const shiftChanged = tileShiftX !== lastTileShiftX || tileShiftY !== lastTileShiftY

      for (const cell of cellsRef.current) {
        const x = cell.col * TILE_W + baseX + canvasW / 2 - TILE_W / 2
        const y = cell.row * TILE_H + baseY + canvasH / 2 - TILE_H / 2

        const cx = x + CELL_W / 2 - canvasW / 2
        const cy = y + CELL_H / 2 - canvasH / 2
        const dist = Math.sqrt(cx * cx + cy * cy)
        const t = Math.max(0, 1 - dist / maxDist)
        const smooth = t * t * (3 - 2 * t)
        const scale = MIN_SCALE + (1 - MIN_SCALE) * smooth

        let introMult = introStartTime === null ? 0 : 1
        if (introStartTime !== null) {
          const elapsed = now - introStartTime - cell.introDelay
          if (elapsed <= 0) {
            introMult = 0
          } else if (elapsed < INTRO_DURATION) {
            const t = elapsed / INTRO_DURATION
            introMult = 1 - Math.pow(1 - t, 4)
          }
        }

        cell.el.style.left = `${x}px`
        cell.el.style.top = `${y}px`
        cell.el.style.transform = `scale(${scale * introMult})`

        if (shiftChanged && photoCount > 0) {
          const worldCol = cell.col - tileShiftX
          const worldRow = cell.row - tileShiftY
          const idx =
            (((worldRow % photoCount) + photoCount) % photoCount +
              (((worldCol % photoCount) + photoCount) % photoCount)) %
            photoCount
          if (idx !== cell.photoIdx) {
            cell.photoIdx = idx
            cell.img.src = photosRef.current[idx].src
          }
        }
      }

      lastTileShiftX = tileShiftX
      lastTileShiftY = tileShiftY

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [canvasW, canvasH])

  // Cleanup inertia on unmount
  useEffect(() => {
    return () => {
      if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current)
    }
  }, [])

  const startInertia = useCallback(() => {
    const step = () => {
      velocity.current.x *= 0.92
      velocity.current.y *= 0.92
      if (Math.abs(velocity.current.x) < 0.5 && Math.abs(velocity.current.y) < 0.5) return
      offsetRef.current.x += velocity.current.x
      offsetRef.current.y += velocity.current.y
      inertiaRef.current = requestAnimationFrame(step)
    }
    inertiaRef.current = requestAnimationFrame(step)
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current)
    if (containerRef.current) containerRef.current.style.cursor = "grabbing"
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    velocity.current = { x: dx, y: dy }
    lastPos.current = { x: e.clientX, y: e.clientY }
    offsetRef.current.x += dx
    offsetRef.current.y += dy
  }, [])

  const onMouseUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = false
    if (containerRef.current) containerRef.current.style.cursor = "grab"
    startInertia()
  }, [startInertia])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    velocity.current = { x: 0, y: 0 }
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current)
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current) return
    const dx = e.touches[0].clientX - lastPos.current.x
    const dy = e.touches[0].clientY - lastPos.current.y
    velocity.current = { x: dx, y: dy }
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    offsetRef.current.x += dx
    offsetRef.current.y += dy
  }, [])

  const onTouchEnd = useCallback(() => {
    dragging.current = false
    startInertia()
  }, [startInertia])

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current)
    offsetRef.current.x -= e.deltaX
    offsetRef.current.y -= e.deltaY
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [onWheel])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none z-[2]"
      style={{ width: canvasW, height: canvasH, cursor: "grab" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={gridRef} className="absolute inset-0" />
    </div>
  )
}
