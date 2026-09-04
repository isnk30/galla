// Read the device appearance once before the page paints. Manual changes after
// this point stay independent until the next page load.
export const themeScript = `
  document.documentElement.dataset.theme =
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
`
