# Catatia CMS — README

Payload v3 CMS + Next.js 16 App Router frontend. All routes render through
`src/app/(frontend)/[[...pages]]/page.tsx` (catch-all) with `unstable_cache`
for data fetching. Drafts/autosave/schedulePublish are DISABLED on `pages`
and `posts` (spec item 6) until draft preview is verified end to end.

## Environment variables

See `.env.example`. Required:

| Variable                 | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `DATABASE_URL`           | MongoDB connection string                                 |
| `PAYLOAD_SECRET`         | Payload auth secret                                       |
| `REVALIDATE_SECRET`      | Shared secret for draft preview + `/revalidate` endpoint  |
| `NEXT_PUBLIC_SERVER_URL` | Public frontend origin (admin preview/live-preview links) |

S3 uploads: `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`,
`S3_REGION`, `S3_ENDPOINT` (optional).

## Content model

```mermaid
erDiagram
  Page ||--o{ Block : contents
  Post ||--o{ Block : contents
  Group ||--o{ Post : group
  Post }o--|| Group : "belongs to"
  Inquiry ||--|| Submission : "public API writes"
  Global_Header { } -- Page : "renders in layout"
  Global_Footer { } -- Page : "renders in layout"
  Global_Config { string lastRevalidatedAt } -- Cache : "revalidation bookkeeping"
```

- **Pages** — slug unique; `homepage` slug renders at `/`. Slug is reserved against group prefixes and route segments (`admin`, `api`, `preview`, `revalidate`). Draft mode disabled (spec item 6): version history kept, no drafts/autosave/schedulePublish.
- **Posts** — slug unique per group. Belongs to a **Group** via `group` relationship. Uses the default Payload list view.
- **Groups** — URL prefix (e.g. `/projects`, leading slash, lowercase). `posts` join field lists members.
- **Inquiries** — public-form submissions; admin read-only (access control).
- **Globals** — `header`, `footer` (render on every page via the frontend layout), `config` (cache bookkeeping + revalidation controls).
- **Blocks** — `contents` is a blocks field on pages and posts; registry in `src/payload/schema/blocks/index.ts` + `src/components/common/page-builder/index.tsx` is script-managed. Block slugs follow the `block-<name>` lowercase convention; legacy uppercase slugs are remapped on read by `src/payload/schema/blocks/legacy-slugs.ts`.

## Routing

| URL                | Resolves to                                          |
| ------------------ | ---------------------------------------------------- |
| `/`                | page with slug `homepage`                            |
| `/<slug>`          | page with slug `<slug>`                              |
| `/<prefix>/<slug>` | post in group with prefix `/<prefix>`, slug `<slug>` |
| `/admin`           | Payload admin                                        |
| `/preview`         | draft-preview entry (see below)                      |
| `/revalidate`      | external cache-bust endpoint (POST, see below)       |

Reserved first segments (for group prefixes and page slugs): `admin`, `api`,
`preview`, `revalidate`. A page slug MAY equal a group prefix — the catch-all
disambiguates by depth (1-segment = page, 2-segment = post), so a `/projects`
listing page co-exists with posts at `/projects/<slug>`.

## Adding a block

```sh
bun run make:block <kebab-case-name>
```

Creates the schema + component pair under `src/payload/schema/blocks/block-<name>/`
(slug == directory == `block-<name>`, spec item 3), registers the schema in
`blocks/index.ts`, and adds the component to the page-builder registry. Do NOT
pass the `block-` prefix — it is added automatically. Rename later with
`bun run rename:block <old> <new>` (which also appends a legacy slug mapping
to `legacy-slugs.ts`). Details: `.omp/skills/create-block/SKILL.md`.

## Cache tags + revalidation

Tag scheme lives in `src/cms/data/tags.ts` (plain module, importable from
admin config code):

| Cache entry     | Tags                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| page fetch      | `page:<slug>`, `collection:pages`                                        |
| post fetch      | `post:<slug>`, `collection:posts`, `group:<prefix>`, `collection:groups` |
| header/footer   | `global:header`, `global:footer`                                         |
| slug/path lists | `collection:pages`, `collection:posts`, `collection:groups`              |

All `unstable_cache` entries revalidate every 300 s as a floor; tags bust them
immediately. Revalidation happens three ways:

1. **Auto hooks** (`src/payload/hooks/revalidate.hook.ts`) — attached to
   `pages`, `posts`, `groups` (`afterChange` + `afterDelete`) and the
   `header`/`footer` globals (`afterChange`). Publishing/editing/deleting a doc
   busts its tags (and member posts' tags for groups, plus the layout for
   globals) instantly — no 5-minute wait. Hooks never throw into the save flow.
2. **Dashboard buttons** — Config global → Cache / Revalidate → custom
   controls (`src/payload/components/revalidate-controls.tsx`): revalidate one
   page/post by slug (posts need their group prefix) or revalidate everything.
   These call server actions (`src/cms/revalidate/action.ts`) which require a
   logged-in Payload admin; no secret is exposed to the browser.
   "Revalidate ALL" also stamps `config.cache.lastRevalidatedAt`.
3. **External endpoint** — `POST /revalidate` with JSON
   `{ secret, type: 'single' | 'all', collection?, slug?, prefix? }`.
   `secret` must equal `REVALIDATE_SECRET`. Examples:

   ```sh
   curl -X POST http://localhost:3000/revalidate \
     -H 'Content-Type: application/json' \
     -d '{"secret":"...","type":"all"}'

   curl -X POST http://localhost:3000/revalidate \
     -H 'Content-Type: application/json' \
     -d '{"secret":"...","type":"single","collection":"posts","slug":"artchive-id","prefix":"/projects"}'
   ```

   Wrong secret → `401`; bad payload → `400`; success → `{ "revalidated": true }`.

## Draft preview

`admin.preview` on `pages` and `posts` builds
`${NEXT_PUBLIC_SERVER_URL}/preview?path=<encoded public path>&secret=<REVALIDATE_SECRET>`
(`src/payload/preview/url.ts`). The button opens that URL, which enables
Next.js draft mode (`draftMode().enable()`) and redirects to the public path;
the catch-all then fetches with `draft: true`. Drafts are disabled (spec item
6), so that read returns the latest published content straight from Payload,
bypassing `unstable_cache` — preview always shows the newest save. `?exit=1`
disables draft mode again.

Note: draft mode is also how **live preview** renders drafts (see below), so
the preview URL is shared.

## Live preview

Configured at the root `admin.livePreview` (`payload.config.ts`) for
`pages` + `posts` with mobile (375×667), tablet (768×1024), and desktop
(1440×900) breakpoints. The iframe `src` uses the same
`/preview?...` URL, so it enters draft mode; the frontend layout mounts
`LivePreviewRefresh` (`src/components/live-preview/refresh-route.tsx`), which
wraps `RefreshRouteOnSave` from `@payloadcms/live-preview-react` and calls
`router.refresh()` on every doc event (save, publish). Drafts are disabled,
so every save is immediately public and the refreshed render reflects it.
Globals preview through `/preview/globals` (layout-only route); the layout
reads header/footer with `draft: true` so global edits preview instantly.

## Smoke tests

Scratch-DB runtime checks (local mongodb required; each drops its own DB):

```sh
bunx tsx scripts/smoke-section-anchor-dedupe.ts   # repeated blocks -> unique anchors
bunx tsx scripts/smoke-draft-page-preview.ts      # page preview reads latest content
bunx tsx scripts/smoke-draft-global-preview.ts    # header/footer preview reads latest content
bunx tsx scripts/smoke-slug-revalidation.ts       # renames invalidate old + new paths/tags
bunx tsx scripts/smoke-link-field.ts              # link/groupLink validation + resolution
```

Schema behavior against the real app config (local-only DB):

```sh
DATABASE_URL=mongodb://localhost:27017/catatia_dev \
  bunx tsx --env-file=.env scripts/verify-local-schema.ts
```
