---
name: rename-block
description: Rename a Payload CMS block with bun run rename:block — directory, IDENTIFIER, export names, thumbnail path, and every import reference in one pass. USE WHEN: renaming/re-slugging an existing block, asked to "rename a block", or block name no longer matches its purpose — do NOT rename by hand-editing files.
---

# Renaming a Block

```bash
bun run rename:block <old-name> <new-name>
```

Both names MUST match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.

## What the script renames

- Directory `src/payload/schema/blocks/<old>/` → `<new>` (git detects as rename)
- `schema.block.ts`:
  - `IDENTIFIER` constant value (`block-<old>` → `block-<new>`, lowercase `block-<name>` convention)
  - `export const <OldPascal>Block` → `<NewPascal>Block`
  - `interfaceName`
  - thumbnail path (`blocks/<new>/thumbnail.webp`)
- `component.block.tsx`:
  - `Contents<OldPascal>` → `Contents<NewPascal>`
  - `<OldPascal>Props` → `<NewPascal>Props`
  - `blockType` needs NO rewrite — it is typed via `typeof IDENTIFIER` (imported from `./schema.block`), and the `IDENTIFIER` value is renamed in `schema.block.ts` above
- `src/payload/schema/blocks/index.ts` — import path + `allBlocks` entry (auto-managed file)
- `src/components/common/page-builder/index.tsx` — both import paths + registry key/value (auto-managed section)
- `scripts/seed.ts` + `scripts/verify-local-schema.ts` — block type/name references when present (prints a warning per file when a token is missing)
- `src/payload/schema/blocks/legacy-slugs.ts` — appends `'block-<old>': 'block-<new>'` so stored docs keep rendering until re-saved (only for `block-*` names; legacy uppercase slugs are not derivable)

## After renaming

1. **Regenerate types** — `blockType` + interface name changed:

```bash
bunx payload generate:types
```

1. **Stored content** — the script appended a legacy mapping to `src/payload/schema/blocks/legacy-slugs.ts` (old slug -> new slug); the afterRead hook remaps `blockType` + `identifier` until docs are re-saved. Remove the entry only after all content is migrated.
2. `bunx tsc --noEmit`
3. If `seed.ts`/`verify-local-schema.ts` reference the block, re-run the seed to keep fixtures consistent.

## Guards

- Fails if the source directory doesn't exist or the target already exists.
- Unknown references elsewhere are NOT auto-edited — grep for the old Pascal/upper tokens if something breaks.
