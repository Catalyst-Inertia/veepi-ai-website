/**
 * Resolves a unique, renderable section anchor per block (spec item 2).
 *
 * `sectionId` from the CMS wins; duplicates within the same page get a
 * numeric suffix (`-2`, `-3`, ...) so anchors never collide. Blocks without a
 * sectionId fall back to a slugified blockType plus a 1-based index.
 *
 * Pure module (no React/Next imports) so the page-builder can use it and
 * scripts/smoke-section-anchor-dedupe.ts can verify the dedupe contract.
 */
export const resolveSectionIds = (
  blocks: Array<{ sectionId?: string | null; blockType: string }>,
): string[] => {
  const seenIds = new Set<string>()
  return blocks.map((block, index) => {
    const slug = block.blockType.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    let candidate = block.sectionId?.trim() || `${slug || 'block'}-${index + 1}`
    const base = candidate
    let n = 2
    while (seenIds.has(candidate)) {
      candidate = `${base}-${n}`
      n += 1
    }
    seenIds.add(candidate)
    return candidate
  })
}
