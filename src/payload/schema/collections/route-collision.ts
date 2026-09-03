import type { Validate } from 'payload'

/**
 * F-04 (spec Phase 4): page slugs and group prefixes may not overlap. A page
 * at /<slug> and a group at /<prefix> both claim the same one-segment public
 * route, so the overlap is rejected in both directions at the schema layer.
 *
 * Shared by pages.collection.ts and groups.collection.ts so the two halves
 * of the rule cannot drift apart (one place owns both validators and the
 * reserved-segment / prefix-shape constants they rely on).
 */

/** Route segments owned by the application itself (admin UI, preview, revalidation API). */
export const RESERVED_SEGMENTS: Record<string, true> = {
  admin: true,
  api: true,
  preview: true,
  revalidate: true,
}

/** Single lowercase route segment with a leading slash (e.g. /projects). */
export const PREFIX_PATTERN = /^\/[a-z0-9][a-z0-9-]*$/

/**
 * Page-slug validator: rejects reserved segments and any slug that is
 * currently used as a group prefix (`/<slug>`).
 */
export const validatePageSlugAgainstGroups: Validate = async (
  value,
  { req },
) => {
  if (typeof value !== 'string' || value.length === 0) return true
  // Reserved route segments (admin UI, preview, revalidation API).
  if (RESERVED_SEGMENTS[value]) {
    return `Slug may not use reserved segment "${value}"`
  }
  // F-04: a group at /<slug> already owns the one-segment route.
  const collision = await req.payload.find({
    collection: 'groups',
    where: { prefix: { equals: `/${value}` } },
    limit: 1,
    depth: 0,
  })
  if (collision.docs.length > 0) {
    return `Slug "${value}" is already used as the group prefix /${value}`
  }
  return true
}

/**
 * Group-prefix validator: rejects malformed/multi-segment prefixes, reserved
 * segments, and any prefix whose segment is currently used as a page slug.
 */
export const validateGroupPrefixAgainstPages: Validate = async (
  value,
  { req },
) => {
  if (typeof value !== 'string' || value.length === 0) {
    return true
  }
  if (!PREFIX_PATTERN.test(value)) {
    return 'Prefix must match /^\\/[a-z0-9][a-z0-9-]*$/ (single lowercase segment, leading slash)'
  }
  const firstSegment = value.split('/').filter(Boolean)[0]
  if (firstSegment && RESERVED_SEGMENTS[firstSegment]) {
    return `Prefix may not use reserved segment "${firstSegment}"`
  }
  // F-04: a page at /<segment> already owns the one-segment route.
  const collision = await req.payload.find({
    collection: 'pages',
    where: { slug: { equals: firstSegment } },
    limit: 1,
    depth: 0,
  })
  if (collision.docs.length > 0) {
    return `Prefix ${value} collides with the page slug "${firstSegment}"`
  }
  return true
}
