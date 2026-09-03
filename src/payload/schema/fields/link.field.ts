import type {
  Field,
  FieldHook,
  GroupField,
  PayloadRequest,
  Validate,
} from 'payload'
import { SECTION_ID_ERROR, SECTION_ID_PATTERN } from './section-id.field'
import { textField } from './text.field'
import { selectField } from './select.field'
import { relationshipField } from './relationship.field'
import { checkboxField } from './checkbox.field'
import { groupField } from './group.field'

/**
 * Reusable `link` schema primitive (spec: reusable link field).
 *
 * Normalized renderer contract — see {@link ResolvedLink}. `url` / `newTab`
 * are virtual afterRead outputs, so renderers receive a resolved public path
 * (string) and a new-tab flag (boolean) without re-implementing route
 * resolution.
 */

/**
 * Normalized link output after afterRead — the renderer contract.
 * Phase 2 consumers (header, footer, blocks, PayloadLink) read `url`/`newTab`
 * from this shape instead of re-resolving internal references.
 */
export type ResolvedLink = {
  label: string
  type: 'internal' | 'external'
  internalUrl?: {
    relationTo: 'pages' | 'posts'
    /** Raw id at shallow depths, populated doc at depth >= 1. */
    value: string | Record<string, unknown>
  }
  externalUrl?: string
  /** Optional anchor on the internal target page/post (`#sectionId`). */
  sectionId?: string
  target: '_self' | '_blank'
  /** Resolved public path (internal) or the raw external value. Internal
   * paths may carry a `#sectionId` anchor. */
  url: string | null
  /** `true` when target === '_blank'. Always a boolean after afterRead. */
  newTab: boolean
}

const EXTERNAL_URL_ERROR =
  'External URL must be a #anchor, /relative path, http(s):// URL, tel:, ' +
  'mailto:, or wa.me/ destination with a value'

/**
 * Per-scheme external URL validation. The legacy prefix-only check accepted
 * incomplete values (`https://`, `tel:`, `mailto:`, `wa.me/`, `#`, `/`), so
 * every allowed scheme now requires a non-empty destination.
 */
const isValidExternalUrl = (v: string): boolean => {
  const lower = v.toLowerCase()
  if (lower.startsWith('#') || lower.startsWith('/')) return v.length > 1
  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    try {
      const url = new URL(v)
      return (
        (url.protocol === 'http:' || url.protocol === 'https:') &&
        url.hostname.length > 0
      )
    } catch {
      return false
    }
  }
  if (lower.startsWith('tel:')) return v.length > 4
  if (lower.startsWith('mailto:')) return v.length > 7
  if (lower.startsWith('wa.me/')) return v.length > 6
  return false
}

const isExternalLink = (data: unknown): boolean =>
  data !== null &&
  typeof data === 'object' &&
  'type' in data &&
  data.type === 'external'

// --- conditional validation --------------------------------------------------

const internalUrlValidate: Validate = (value, { siblingData }) => {
  if (isExternalLink(siblingData)) return true
  if (value == null || value === '') {
    return 'Internal URL is required when Link Type is "internal"'
  }
  const validShape =
    typeof value === 'string' ||
    (typeof value === 'object' &&
      value !== null &&
      'value' in value &&
      typeof value.value === 'string')
  if (!validShape) {
    return 'Internal URL must reference a Page or Post'
  }
  return true
}

const externalUrlValidate: Validate = (value, { siblingData }) => {
  const v = typeof value === 'string' ? value : ''
  if (isExternalLink(siblingData)) {
    if (v.length === 0) {
      return 'External URL is required when Link Type is "external"'
    }
    if (!isValidExternalUrl(v)) return EXTERNAL_URL_ERROR
    return true
  }
  // Internal type: optional, but still format-checked when supplied.
  if (v.length > 0 && !isValidExternalUrl(v)) return EXTERNAL_URL_ERROR
  return true
}

// --- internal URL resolution (same rules as the frontend catch-all route) ----

/**
 * Per-request memo of url resolution. Keyed by the request object so slugs
 * can never go stale across requests (a request-scoped WeakMap is GC'd with
 * the request).
 *
 * Two jobs:
 * 1. Cycle guard — an internal link may point at the very document being
 *    read (a homepage linking to itself, or two docs linking to each other).
 *    Without the guard, urlAfterRead -> req.payload.findByID(target)
 *    re-enters the same afterRead hook for the same id, and each nested
 *    read spins up a fresh local operation (createLocalReq) — unbounded
 *    recursion that hangs every read of the linking document (admin edit
 *    view and public route alike). Re-entering an in-flight resolution
 *    resolves to null (renderers skip null urls); the outer read still
 *    resolves the path correctly.
 * 2. Dedupe — repeated links to the same target within one request reuse
 *    the first resolution instead of re-querying.
 */
type ResolveState = {
  pending: Set<string>
  settled: Map<string, string | null>
}

const resolveStates = new WeakMap<PayloadRequest, ResolveState>()

const getResolveState = (req: PayloadRequest): ResolveState => {
  let state = resolveStates.get(req)
  if (!state) {
    state = { pending: new Set(), settled: new Map() }
    resolveStates.set(req, state)
  }
  return state
}

const resolvePathFor = async (
  req: PayloadRequest,
  key: string,
  compute: () => Promise<string | null>,
): Promise<string | null> => {
  const state = getResolveState(req)
  if (state.pending.has(key)) return null
  const cached = state.settled.get(key)
  if (cached !== undefined) return cached
  state.pending.add(key)
  try {
    const path = await compute()
    state.settled.set(key, path)
    return path
  } catch {
    // A broken target (deleted doc, foreign/stale id) must not take down
    // the read of the document containing the link. The renderer contract
    // treats null url as "no link".
    state.settled.set(key, null)
    return null
  } finally {
    state.pending.delete(key)
  }
}

const resolvePostPath = async (
  slug: string,
  group: unknown,
  req: PayloadRequest,
): Promise<string | null> => {
  // Prefer an already-populated group (defensive; normally an id is stored).
  if (group && typeof group === 'object' && 'prefix' in group) {
    const prefix = group.prefix
    if (typeof prefix === 'string' && prefix.length > 0) {
      return `${prefix.replace(/\/+$/, '')}/${slug}`
    }
  }
  let groupId: string | null = null
  if (typeof group === 'string') {
    groupId = group
  } else if (group && typeof group === 'object' && 'id' in group) {
    const id = group.id
    groupId = typeof id === 'string' ? id : null
  }
  if (!groupId) return null
  return resolvePathFor(req, `groups:${groupId}`, async () => {
    const groupDoc = await req.payload.findByID({
      collection: 'groups',
      id: groupId,
      depth: 0,
      req,
    })
    return groupDoc && typeof groupDoc.prefix === 'string'
      ? groupDoc.prefix.replace(/\/+$/, '')
      : null
  }).then((prefix) => (prefix ? `${prefix}/${slug}` : null))
}

/** Appends a validated section anchor to a resolved public path. */
const withSectionHash = (path: string, sectionId: unknown): string =>
  typeof sectionId === 'string' && sectionId.length > 0
    ? `${path}#${sectionId}`
    : path

/**
 * Resolves the public path for an internal link.
 *
 * Field afterRead hooks run before relationship population, so `internalUrl`
 * is normally `{ relationTo, value: <id> }` here; the payload lookup keeps
 * resolution correct regardless of the requesting depth. Populated-object
 * values are handled defensively so the hook stays correct if ordering or
 * population behavior changes.
 *
 * When `sectionId` is set on an internal link, it is appended to the resolved
 * path as `#sectionId` so renderers can deep-link to a block anchor.
 *
 * Cost: one `findByID` per internal link per read (dataloader-deduped within
 * a request; globals are `unstable_cache`-wrapped). Revisit in Phase 5 if
 * performance tests show pressure.
 */
const urlAfterRead: FieldHook = async ({ siblingData, req }) => {
  if (isExternalLink(siblingData)) {
    const externalUrl =
      siblingData !== null &&
      typeof siblingData === 'object' &&
      'externalUrl' in siblingData
        ? siblingData.externalUrl
        : undefined
    if (typeof externalUrl !== 'string' || externalUrl.length === 0) {
      return null
    }
    // Bare `wa.me/<number>` is advertised by the admin UI but resolves as a
    // relative URL in the browser; normalize it to an absolute WhatsApp link.
    return /^wa\.me\//i.test(externalUrl)
      ? `https://wa.me/${externalUrl.slice(6)}`
      : externalUrl
  }
  const type =
    siblingData !== null &&
    typeof siblingData === 'object' &&
    'type' in siblingData
      ? siblingData.type
      : undefined
  if (type !== 'internal') return null

  const sectionId =
    siblingData !== null &&
    typeof siblingData === 'object' &&
    'sectionId' in siblingData
      ? siblingData.sectionId
      : undefined

  const internal =
    siblingData !== null &&
    typeof siblingData === 'object' &&
    'internalUrl' in siblingData
      ? siblingData.internalUrl
      : undefined
  if (typeof internal !== 'object' || internal === null) return null
  const relationTo = 'relationTo' in internal ? internal.relationTo : undefined
  if (relationTo !== 'pages' && relationTo !== 'posts') return null
  const value = 'value' in internal ? internal.value : undefined

  if (typeof value === 'object' && value !== null) {
    const slug = 'slug' in value ? value.slug : undefined
    if (typeof slug !== 'string' || slug.length === 0) return null
    if (relationTo === 'pages') {
      return withSectionHash(
        'isHomepage' in value && value.isHomepage === true ? '/' : `/${slug}`,
        sectionId,
      )
    }
    const group = 'group' in value ? value.group : undefined
    const path = await resolvePostPath(slug, group, req)
    return path ? withSectionHash(path, sectionId) : null
  }

  if (typeof value !== 'string' || value.length === 0) return null
  if (relationTo === 'pages') {
    const path = await resolvePathFor(req, `pages:${value}`, async () => {
      const page = await req.payload.findByID({
        collection: 'pages',
        id: value,
        depth: 0,
        // Pass the current req so the per-request cycle guard above is
        // shared down the read chain and can cut self-referential links.
        req,
      })
      if (!page || typeof page.slug !== 'string') return null
      return page.isHomepage === true ? '/' : `/${page.slug}`
    })
    // Anchor appended outside the memo: two links may share a target page
    // but use different section ids.
    return path ? withSectionHash(path, sectionId) : null
  }
  const path = await resolvePathFor(req, `posts:${value}`, async () => {
    const post = await req.payload.findByID({
      collection: 'posts',
      id: value,
      // depth 0: populating the post's group would cascade into the group's
      // `posts` join field (group -> join posts -> group -> ...) and hang.
      // resolvePostPath resolves the prefix from the raw group id instead.
      depth: 0,
      req,
    })
    if (!post || typeof post.slug !== 'string') return null
    return resolvePostPath(post.slug, post.group, req)
  })
  return path ? withSectionHash(path, sectionId) : null
}

// --- shared inner fields ------------------------------------------------------
// Used by `linkField` (single link group) and `groupLinkField` (link array).

export const linkFields: Field[] = [
  textField({
    name: 'label',
    label: 'Label',
    required: true,
  }),
  selectField({
    name: 'type',
    label: 'Link Type',
    required: true,
    defaultValue: 'internal',
    options: [
      { label: 'Internal page', value: 'internal' },
      { label: 'External URL', value: 'external' },
    ],
    description:
      'Internal links point to Pages or Posts; external links use a full URL or scheme.',
  }),
  relationshipField({
    name: 'internalUrl',
    label: 'Internal URL',
    relationTo: ['pages', 'posts'],
    description: 'Pick a Page or Post. Required when Link Type is "internal".',
    admin: {
      condition: (_, siblingData) => !isExternalLink(siblingData),
    },
    validate: internalUrlValidate,
  }),
  textField({
    name: 'sectionId',
    // Stored as text; the admin UI renders a select (SectionIdSelect) whose
    // options come from the target page/post's content blocks. Payload 3.87
    // select options are static-only, so the picker is a custom field
    // component that fetches the target doc's block sectionIds.
    label: 'Section ID (anchor)',
    description:
      'Anchor on the target page/post. Pick the section to deep-link to; the resolved URL gets #section-id appended.',
    admin: {
      condition: (_, siblingData) => !isExternalLink(siblingData),
      components: {
        Field: '/src/payload/components/section-id-select#SectionIdSelect',
      },
    },
    validate: (value: string | string[] | null | undefined) => {
      if (value == null || value === '') return true
      if (typeof value !== 'string') return 'Section ID must be a string'
      if (!SECTION_ID_PATTERN.test(value)) return SECTION_ID_ERROR
      return true
    },
  }),
  textField({
    name: 'externalUrl',
    label: 'External URL',
    description:
      'Starts with #, /, http(s)://, tel:, mailto:, or wa.me/ — e.g. /#contact, https://example.com, tel:+123, wa.me/123',
    admin: {
      condition: (_, siblingData) => isExternalLink(siblingData),
    },
    validate: externalUrlValidate,
  }),
  selectField({
    name: 'target',
    label: 'Open Link In',
    defaultValue: '_self',
    options: [
      { label: 'Same tab', value: '_self' },
      { label: 'New tab', value: '_blank' },
    ],
  }),
  textField({
    name: 'url',
    label: 'Resolved URL',
    virtual: true,
    admin: {
      readOnly: true,
    },
    description: 'Computed: internal references resolve to their public path.',
    hooks: { afterRead: [urlAfterRead] },
  }),
  checkboxField({
    name: 'newTab',
    label: 'Open in New Tab',
    virtual: true,
    admin: {
      // Computed from `target`; hidden so editors don't see two controls for
      // one value. Still returned on reads for the renderer contract.
      hidden: true,
    },
    description: 'Computed from "Open Link In".',
    hooks: {
      afterRead: [
        ({ siblingData }) => {
          const target =
            siblingData !== null &&
            typeof siblingData === 'object' &&
            'target' in siblingData
              ? siblingData.target
              : undefined
          return target === '_blank'
        },
      ],
    },
  }),
]

export const linkField = (
  options: {
    name?: string
    label?: string
    required?: boolean
    description?: string
    admin?: GroupField['admin']
  } = {},
): Field => {
  const {
    name = 'link',
    label = 'Link',
    required = false,
    description,
    admin,
  } = options
  return groupField({
    name,
    label,
    required,
    ...(description ? { description } : {}),
    ...(admin ? { admin } : {}),
    fields: linkFields,
  })
}
