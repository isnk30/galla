"use client"

import { useSyncExternalStore } from "react"
import { motion, useReducedMotion } from "motion/react"
import CornerButton from "@/components/CornerButton"
import { THEME_STORAGE_KEY } from "@/lib/theme"

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  })
  return () => observer.disconnect()
}

function getSnapshot() {
  return document.documentElement.dataset.theme === "dark"
}

function getServerSnapshot() {
  return false
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const reducedMotion = useReducedMotion()
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  function toggleTheme() {
    const theme = getSnapshot() ? "light" : "dark"
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
  }

  return (
    <CornerButton side="right" label={label} onClick={toggleTheme}>
      {[false, true].map((sun) => (
        <motion.span
          key={String(sun)}
          aria-hidden="true"
          className="absolute flex size-4 items-center justify-center"
          initial={false}
          animate={{
            opacity: isDark === sun ? 1 : 0,
            scale: isDark === sun ? 1 : 0.25,
            filter: isDark === sun ? "blur(0px)" : "blur(4px)",
          }}
          transition={{ type: "spring", duration: reducedMotion ? 0 : 0.3, bounce: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {sun ? (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
              </>
            ) : (
              <path d="M20.9 13.1A9 9 0 0 1 10.9 3.1a9 9 0 1 0 10 10Z" />
            )}
          </svg>
        </motion.span>
      ))}
    </CornerButton>
  )
}
