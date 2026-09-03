---
name: create-block
description: Scaffold a new Payload CMS block with bun run make:block — directory, schema, component, thumbnail, and auto-registration in blocks/index.ts + page-builder. USE WHEN: adding a new content section/block to the CMS (e.g. a new home/project page section) or asked to "create a block"/"make a block".
---

# Creating a New Block

Use the generator, never hand-create a block:

```bash
bun run make:block <kebab-name>
```

`<kebab-name>` MUST match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` (lowercase kebab-case) and must NOT start with `block-` — the prefix is added automatically.

## What the generator does

1. Fails if `src/payload/schema/blocks/block-<name>/` exists (dir == slug == `block-<name>`, so a duplicate dir is a duplicate slug) or the slug is already used by another block's schema.
2. Creates `src/payload/schema/blocks/block-<name>/`:
   - `schema.block.ts` — block config (see conventions skill)
   - `component.block.tsx` — renderer scaffold
   - `thumbnail.webp` — copied from `public/assets/images/logo.webp` (replace with a block-specific 3:2 image)
   - `_components/.gitkeep`
3. Auto-registers the block in BOTH:
   - `src/payload/schema/blocks/index.ts` (`allBlocks` array — Payload schema)
   - `src/components/common/page-builder/index.tsx` (registry — frontend renderer)
     Both files are AUTO-MANAGED — do not edit them by hand.

## After generation

1. Edit `schema.block.ts`: add fields via the field-wrapper factories from `src/payload/schema/fields/` — raw `{ type: ... }` field objects are PROHIBITED. The scaffold already includes `identifierField`, `sectionIdField`, and a required `title` via `textField({ name: 'title', label: 'Title', required: true })`. Rules:
   - Every field MUST have an explicit `label`.
   - `description` is a top-level option (maps to `admin.description`); `required` defaults `false`.
   - Arrays/groups take their sub-fields via a `fields` option; `type: 'textarea'` is banned (use `richTextField`); `titleField` no longer exists.
   - See the `block-conventions` skill for the full wrapper inventory and the fixed-name rules for `identifierField` / `sectionIdField`.
   - Introducing a NEW field type or non-standard wrapper option REQUIRES asking the user first, stating why it is needed.
2. Edit `component.block.tsx`: props come from the schema type — `Extract<Block, { blockType: typeof IDENTIFIER }>` (IDENTIFIER imported from `./schema.block`, the single slug source). Never hand-write prop interfaces or hardcode the slug literal.
3. Regenerate types + import map:

```bash
bunx payload generate:types
bunx payload generate:importmap
```

1. Type gate: `bunx tsc --noEmit`
2. If the block changes the API of stored content (e.g. blockType changes), add a legacy mapping entry in `src/payload/schema/blocks/legacy-slugs.ts` (old slug -> new slug) so existing stored docs keep rendering until re-saved.

`make:block foo` creates directory + slug `block-foo` and export `BlockFooBlock` (spec item 3 convention) — identical shape to the existing blocks (`block-masthead`/`BlockMastheadBlock`, ...).

## Verification

- Admin block chooser shows `thumbnail.webp` (base64-inlined at config load — do NOT replace with a static import; that breaks `payload` CLI).
- `bunx tsc --noEmit` clean.
- If the renderer must appear on a page, add the block to the page's `contents` in the CMS.
