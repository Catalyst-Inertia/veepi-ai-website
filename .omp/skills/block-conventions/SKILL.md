---
name: block-conventions
description: Rules and conventions for building Payload CMS blocks in this repo — identifiers, slugs, typing, thumbnails, auto-managed files, and gotchas. USE WHEN: writing or editing any block schema/component (before make:block edits or after), debugging block type/registry errors, or asked about "block conventions"/"how blocks work".
---

# Block Conventions (Payload CMS 3.87)

## Identifier & slug

- Each block file declares `export const IDENTIFIER = '<slug>' as const` — the block's discriminator, single source of truth (exported so the renderer types `blockType` via `typeof IDENTIFIER` instead of duplicating the slug literal).
- `slug: IDENTIFIER` — the slug IS the identifier.
- Slugs follow the canonical `block-<name>` convention (spec item 3): lowercase, `block-` prefix, e.g. `block-masthead`, `block-hero`, `block-detail`, `block-spacer`. `create-block.ts` (`make:block`) generates this shape automatically — directory == slug == `block-<name>`, export `Block<Name>Block`; never hand-write a bare or uppercase slug, and never pass the `block-` prefix to `make:block`.
- `identifierField({ defaultValue: IDENTIFIER })` — first field; the constant is baked in and API overrides are rejected server-side.
- `interfaceName` = PascalCase of the slug (e.g. `block-masthead` -> `BlockMastheadBlock`).
- Schema objects are written `export const XBlock = { ... } satisfies Block` — `satisfies`, NOT `: Block`, so the `slug` stays a string LITERAL type (needed for the page-builder registry to typecheck).
- Legacy uppercase slugs (`PROJECT.MASTERHEAD`, `HERO`, ...) are remapped on read by `src/payload/schema/blocks/legacy-slugs.ts` (afterRead on pages/posts `contents`). New content must use `block-<name>` only.

## Typing / renderer

- `src/types/blocks.ts` exports `Block` = union of every generated block interface (`Page['contents'] | Post['contents']`).
- Block components type props from the schema: `import { IDENTIFIER } from './schema.block'` then `export type XProps = { id?: string } & Extract<Block, { blockType: typeof IDENTIFIER }>`. Never duplicate the schema as a hand-written interface and never hardcode the slug literal.
- `blockType` in generated types equals the schema slug (payload generates it from `slug`).
- The renderer registry (`src/components/common/page-builder/index.tsx`) keys components by `[XBlock.slug]` — resolved from the schema constant, never typed by hand.

## Thumbnails

- Each block dir has `thumbnail.webp` (3:2 preferred).
- Schema references it via base64 data URI:

  ```ts
  const thumbnailUrl = `data:image/webp;base64,${readFileSync(
    join(process.cwd(), 'src/payload/schema/blocks/<name>/thumbnail.webp'),
    'base64',
  )}`
  ```

- NEVER use a static `import thumb from './thumbnail.webp'` — `payload` CLI (generate:types, migrate) runs under node and cannot import `.webp`.

## Fields — MUST use field wrappers, no raw fields

**Every field in every schema (blocks, collections, globals) MUST be built through a wrapper factory from `src/payload/schema/fields/`.** Raw field object literals (`{ type: 'text', ... }`) are PROHIBITED in schema files — the only raw field objects allowed in the repo live inside the wrapper implementations themselves and `seo.field.ts` (exempt, see below).

- EVERY field must have an explicit `label`.
- `description` is a TOP-LEVEL wrapper option; wrappers map it to `admin.description` internally. Never nest it inside `admin`.
- Wrapper options = `{ name, label, description?, required? }` + typed passthrough of the payload field's remaining props (`unique`, `index`, `hooks`, `validate`, `defaultValue`, `virtual`, `admin`, `options`, `relationTo`, `collection`, `on`, `blocks`, `fields`, ...). `required` defaults `false` unless the field's semantics require `true`.
- Field types that nest other fields (array, group, blocks) MUST receive their sub-fields via a `fields` option (array/group) or `blocks` option (blocks) — never inline.

### Wrapper inventory (`src/payload/schema/fields/index.ts`)

| type         | wrapper                                                                        | notes                                                             |
| ------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| text         | `textField({ name, label, required?, description?, ... })`                     |                                                                   |
| richText     | `richTextField({ name?, label?, description? })`                               | defaults `content`/`Content`; lexical editor pre-wired            |
| upload       | `uploadField(name, { label?, required?, description? })`                       | name is FIRST positional arg; relationTo fixed to `media`         |
| select       | `selectField({ name, label, options, required?, description?, ... })`          |                                                                   |
| checkbox     | `checkboxField({ name, label, required?, description?, ... })`                 |                                                                   |
| array        | `arrayField({ name, label, fields, required?, description?, ... })`            | `fields` required                                                 |
| group        | `groupField({ name, label, fields, required?, description?, ... })`            | `fields` required                                                 |
| json         | `jsonField({ name, label, required?, description? })`                          |                                                                   |
| date         | `dateField({ name, label, required?, description?, ... })`                     |                                                                   |
| relationship | `relationshipField({ name, label, relationTo, required?, description?, ... })` |                                                                   |
| join         | `joinField({ name, label, collection, on, ... })`                              |                                                                   |
| blocks       | `blocksField({ name, label, blocks, required?, description?, ... })`           | `blocks` required                                                 |
| ui           | `uiField({ name, label, admin })`                                              | `admin` required; no description support (UIField admin has none) |
| identifier   | `identifierField({ defaultValue, label?, description? })`                      | name fixed `identifier`                                           |
| sectionId    | `sectionIdField(blockName, { label?, description? })`                          | name fixed `sectionId`; blockName positional                      |
| link group   | `linkField({ name?, label?, required?, description?, admin? })`                |                                                                   |
| link array   | `groupLinkField({ name?, label?, required?, description?, admin? })`           |                                                                   |
| CTA group    | `actionButtonField({ name?, label?, required?, description?, admin? })`        | name defaults `actionButton`, label `Action Button`               |

### Fixed-name fields

`identifierField` and `sectionIdField` have contract-fixed names (`identifier`, `sectionId`) — renaming breaks the block discriminator / anchor resolution / renderer. Only `label` and `description` are overridable on them.

### Deleted / banned field shapes

- `titleField` NO LONGER EXISTS (deleted). Use `textField({ name: 'title', label: 'Title', required: true })` (the old default was `required: true`; pass `required: false` to opt out).
- `type: 'textarea'` is BANNED — multi-line text uses `richTextField`.
- `seoField` is the sole exception: fixed internal structure, raw fields + raw textarea allowed, options not configurable. Never modify its internals without explicit user approval.

### New field types / options — MUST ask the user first

The wrapper inventory is the complete field-type vocabulary. Introducing a NEW field type (a wrapper that doesn't exist above, or a new option beyond the standard `name`/`label`/`description`/`required` + typed-passthrough set) REQUIRES asking the user first, stating WHY it is needed. Do not silently add wrappers or wrapper options.

## Auto-managed files — do not edit by hand

- `src/payload/schema/blocks/index.ts` (`allBlocks`) — header comment marks it; `make:block` appends, `rename:block` rewrites.
- `src/components/common/page-builder/index.tsx` — the block-imports section between `// AUTO-MANAGED SECTION` markers and the `blockRegistry` object.

## TypeScript / runtime rules

- `target: es5` — NO top-level await anywhere (wrap scripts in `async function main()` + `void main()`).
- Scripts need `/* eslint-disable no-console -- ... */` (eslint `no-console: error`).
- Payload-booting scripts MUST run via `bunx tsx --env-file=.env` — plain `bun` crashes with `ReferenceError: Cannot access 'DecoratorNode' before initialization` (lexical ESM circular dep).
- All `@payloadcms/*` + `payload` pinned to 3.87.0 — do not upgrade (3.87.1 breaks boot).

## Changing a block identity (slug/IDENTIFIER)

Always a breaking change for stored content: `blockType` lives in saved `contents` arrays. After any identity change:

1. `bunx payload generate:types`
2. Add a legacy mapping entry in `src/payload/schema/blocks/legacy-slugs.ts` (old slug -> new slug) so existing stored docs keep rendering until re-saved. The afterRead hook remaps both `blockType` and `identifier`.
3. Remove the legacy entry only after all stored content has been re-saved.
4. Re-run seed + verify scripts if they reference the block
5. Prefer `bun run rename:block <old> <new>` (kebab-case names) for the mechanical rename pass; it updates schema, component, registry, and imports.
