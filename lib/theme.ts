export const THEME_STORAGE_KEY = "galla-theme"

// Restore the saved theme before the page paints. New visitors start in light mode.
export const themeScript = `
  try {
    document.documentElement.dataset.theme =
      localStorage.getItem("${THEME_STORAGE_KEY}") === "dark" ? "dark" : "light";
  } catch {}
`
