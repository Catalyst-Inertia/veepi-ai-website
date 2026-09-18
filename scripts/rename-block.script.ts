/* eslint-disable no-console -- CLI script prints status + next steps */
import { readFile, rename, writeFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

const [oldName, newName] = process.argv.slice(2)

if (!oldName || !newName) {
  console.error('Usage: bun scripts/rename-block.ts <old-name> <new-name>')
  process.exit(1)
}

const kebabPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
if (!kebabPattern.test(oldName) || !kebabPattern.test(newName)) {
  console.error('Error: block names must be kebab-case (e.g. project-hero).')
  process.exit(1)
}

function toPascalCase(s: string): string {
  return s
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const blocksDir = join('src', 'payload', 'schema', 'blocks')

// Like make:block, the block- prefix is automatic: `rename:block foo bar`
// renames blocks/block-foo -> blocks/block-bar. Explicit block- names and
// legacy bare dirs (pre-convention) are accepted as-is.
const resolveBlockDir = async (n: string): Promise<string> => {
  if (await exists(join(blocksDir, n))) return n
  const prefixed = `block-${n}`
  return (await exists(join(blocksDir, prefixed))) ? prefixed : n
}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function rewrite(
  path: string,
  replacements: [string, string][],
): Promise<void> {
  let content = await readFile(path, 'utf-8')
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
    } else {
      console.warn(`  note: "${from}" not found in ${path}`)
    }
  }
  await writeFile(path, content)
}

async function main(): Promise<void> {
  // Resolve dir names first (block- prefix automatic, like make:block).
  const oldDirName = await resolveBlockDir(oldName)
  const newDirName = oldDirName.startsWith('block-')
    ? newName.startsWith('block-')
      ? newName
      : `block-${newName}`
    : newName

  const oldDir = join(blocksDir, oldDirName)
  const newDir = join(blocksDir, newDirName)

  // Export names derive from the RESOLVED dir names (pascal of the slug):
  // `rename:block foo bar` -> BlockFooBlock -> BlockBarBlock.
  const oldPascal = toPascalCase(oldDirName)
  const newPascal = toPascalCase(newDirName)

  if (!(await exists(oldDir))) {
    console.error(`Error: block directory "${oldDir}" does not exist.`)
    process.exit(1)
  }
  if (await exists(newDir)) {
    console.error(`Error: block directory "${newDir}" already exists.`)
    process.exit(1)
  }

  // 1. Rename the directory (git detects the rename via content similarity).
  await rename(oldDir, newDir)
  console.log(`Renamed directory: ${oldDir} -> ${newDir}`)

  // 2. schema.block.ts — export name, interfaceName, IDENTIFIER value, thumbnail path.
  await rewrite(join(newDir, 'schema.block.ts'), [
    [`${oldPascal}Block`, `${newPascal}Block`],
    [`'${oldDirName}'`, `'${newDirName}'`],
    [
      `blocks/${oldDirName}/thumbnail.webp`,
      `blocks/${newDirName}/thumbnail.webp`,
    ],
  ])

  // 3. component.block.tsx — component fn + Props type. blockType is typed
  //    via `typeof IDENTIFIER` (imported from ./schema.block), so no literal
  //    rewrite needed here — step 2 renamed the IDENTIFIER value itself.
  await rewrite(join(newDir, 'component.block.tsx'), [
    [`Contents${oldPascal}`, `Contents${newPascal}`],
    [`${oldPascal}Props`, `${newPascal}Props`],
  ])

  // 4. blocks/index.ts — import path + allBlocks entry.
  await rewrite(join(blocksDir, 'index.ts'), [
    [`./${oldDirName}/schema.block`, `./${newDirName}/schema.block`],
    [`${oldPascal}Block`, `${newPascal}Block`],
  ])

  // 5. page-builder/index.tsx — import paths + registry keys/values.
  await rewrite(
    join('src', 'components', 'common', 'page-builder', 'index.tsx'),
    [
      [
        `@/payload/schema/blocks/${oldDirName}/`,
        `@/payload/schema/blocks/${newDirName}/`,
      ],
      [`Contents${oldPascal}`, `Contents${newPascal}`],
      [`${oldPascal}Block`, `${newPascal}Block`],
    ],
  )

  // 6. scripts that reference the block by name/type (seed, verify).
  for (const file of [
    'seed/homepage.ts',
    'seed/projects.ts',
    'seed/globals.ts',
    'scripts/verify-local-schema.ts',
  ]) {
    if (!(await exists(file))) continue
    const content = await readFile(file, 'utf-8')
    if (
      content.includes(`${oldPascal}Block`) ||
      content.includes(`blocks/${oldDirName}`)
    ) {
      await rewrite(file, [
        [`${oldPascal}Block`, `${newPascal}Block`],
        [`'${oldDirName}'`, `'${newDirName}'`],
      ])
      console.log(`Updated references in ${file}`)
    }
  }

  // 7. Add a legacy slug mapping so stored docs keep rendering (spec item 3
  //    migration compat; legacy-slugs.ts afterRead remaps blockType +
  //    identifier until content is re-saved). Only derivable for the current
  //    block-<name> convention — legacy dirs with uppercase slugs are skipped.
  const legacySlugsPath = join(
    'src',
    'payload',
    'schema',
    'blocks',
    'legacy-slugs.ts',
  )
  if (oldDirName.startsWith('block-') && (await exists(legacySlugsPath))) {
    const legacyContent = await readFile(legacySlugsPath, 'utf-8')
    if (legacyContent.includes(`'${oldDirName}':`)) {
      console.warn(
        `  note: legacy-slugs.ts already maps "${oldDirName}" — left unchanged`,
      )
    } else {
      const closeIdx = legacyContent.indexOf('\n}')
      if (closeIdx !== -1) {
        const updated =
          legacyContent.slice(0, closeIdx) +
          `\n  '${oldDirName}': '${newDirName}',` +
          legacyContent.slice(closeIdx)
        await writeFile(legacySlugsPath, updated)
        console.log(
          `Added legacy slug mapping to legacy-slugs.ts: ${oldDirName} -> ${newDirName}`,
        )
      }
    }
  }

  console.log(`\nRenamed ${oldDirName} -> ${newDirName}.`)
  console.log('Next steps:')
  console.log(
    '  1. bunx payload generate:types  (blockType + interface names changed)',
  )
  console.log(
    '  2. A legacy slug mapping was added to legacy-slugs.ts (old -> new); remove it only after all stored content is re-saved',
  )
  console.log('  3. bunx tsc --noEmit')
}

void main().catch((err: unknown) => {
  console.error('Rename failed:', err)
  process.exitCode = 1
})
