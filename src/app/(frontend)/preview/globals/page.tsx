// Preview surface for the header/footer globals. Renders inside the frontend
// layout, so the header + footer are visible regardless of whether a homepage
// (or any page) exists yet. Draft mode is enabled by /preview (the Payload
// livePreview url routes globals through ?path=/preview/globals&secret=...),
// and the layout reads draftMode() to fetch draft header/footer instead of the
// unstable_cache copies. Empty body — only the layout matters here.
export default function GlobalsPreviewPage() {
  return null
}
