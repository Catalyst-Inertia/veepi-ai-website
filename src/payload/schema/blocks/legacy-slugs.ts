/**
 * Legacy block-slug compatibility mapping.
 *
 * Spec item 3: block slugs follow the `block-<name>` lowercase convention.
 * Older documents store the pre-convention uppercase slugs (`PROJECT.MASTERHEAD`,
 * `PROJECT.DETAIL`, `HERO`, `SPACER`) in their `contents` arrays. Payload does
 * not remap stored blockType values on schema change, so reads are translated
 * here until every stored document has been re-saved with the new slugs.
 *
 * Applied as an afterRead hook on the `contents` field of pages and posts
 * (see pages.collection.ts / posts.collection.ts). The `identifier` value is
 * remapped alongside `blockType` so re-saving an old document passes the
 * identifierField validation (which rejects values other than the block's
 * current constant). Remove this mapping once all content has been migrated.
 */
export const LEGACY_BLOCK_SLUGS: Record<string, string> = {
  'PROJECT.MASTERHEAD': 'block-masthead',
  'PROJECT.DETAIL': 'block-detail',
  HERO: 'block-hero',
  SPACER: 'block-spacer',
  'HOME.MASTHEAD': 'block-home-masthead',
  'HOME.SERVICES': 'block-home-services',
  'HOME.ABOUT': 'block-home-about',
  'HOME.PORTFOLIO': 'block-home-portfolio',
  'HOME.CONTACT': 'block-home-contact',
}

type BlockRow = {
  blockType?: unknown
  identifier?: unknown
} & Record<string, unknown>

/**
 * Rewrites legacy `blockType`/`identifier` values to the current block-<name>
 * slugs. Passthrough for anything that is not a legacy block row.
 */
export const remapLegacyBlockSlugs = (value: unknown): unknown => {
  if (!Array.isArray(value)) return value
  return value.map((row) => {
    if (typeof row !== 'object' || row === null) return row
    const r = row as BlockRow
    if (typeof r.blockType !== 'string') return row
    const mapped = LEGACY_BLOCK_SLUGS[r.blockType]
    if (!mapped) return row
    const next: BlockRow = { ...r, blockType: mapped }
    if (r.identifier === r.blockType) next.identifier = mapped
    return next
  })
}
