/* eslint-disable no-console -- CLI script prints status + next steps */
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
  stat,
} from 'node:fs/promises'
import { join } from 'node:path'

const name = process.argv[2]
if (!name) {
  console.error('Usage: bun scripts/create-block.ts <name>')
  process.exit(1)
}

// Validate kebab-case: lowercase alphanumeric, optionally hyphen-separated
const kebabPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
if (!kebabPattern.test(name)) {
  console.error(`Error: "${name}" is not a valid kebab-case slug.`)
  process.exit(1)
}
if (name.startsWith('block-')) {
  console.error(
    `Error: "${name}" already carries the block- prefix — use "${name.slice(6)}" (the block- prefix is added automatically).`,
  )
  process.exit(1)
}

// Spec item 3: every block lives at blocks/block-<name> with slug block-<name>
// (directory == slug == identifier), so renames and registries stay uniform.
const slug = `block-${name}`

function toPascalCase(s: string): string {
  return s
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const pascal = toPascalCase(slug)

async function main(): Promise<void> {
  const blocksDir = join('src', 'payload', 'schema', 'blocks')
  const blockDir = join(blocksDir, slug)
  const indexPath = join(blocksDir, 'index.ts')

  // 4a. Fail if directory already exists
  try {
    const s = await stat(blockDir)
    if (s.isDirectory()) {
      console.error(`Error: block directory "${blockDir}" already exists.`)
      process.exit(1)
    }
  } catch {
    // stat fails → doesn't exist, proceed
  }

  // 4b. Fail if the slug is already used by another block's schema (defensive;
  // dir == slug makes this unreachable via the generator, but a hand-made or
  // legacy block dir could still hold the slug).
  const schemaDirs = await readdir(blocksDir, { withFileTypes: true })
  for (const d of schemaDirs) {
    if (!d.isDirectory()) continue
    const schemaPath = join(blocksDir, d.name, 'schema.block.ts')
    let schemaContent: string
    try {
      schemaContent = await readFile(schemaPath, 'utf-8')
    } catch {
      continue
    }
    if (schemaContent.includes(`'${slug}'`)) {
      console.error(
        `Error: slug "${slug}" is already registered in blocks/${d.name}/schema.block.ts.`,
      )
      process.exit(1)
    }
  }

  // 5a. Create block directory tree and schema.block.ts
  // Thumbnail: copy the public logo asset into the block directory.
  await mkdir(join(blockDir, '_components'), { recursive: true })
  await copyFile(
    join('public', 'assets', 'images', 'logo.webp'),
    join(blockDir, 'thumbnail.webp'),
  )
  const schemaContent = `import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Block } from 'payload'
import { identifierField, sectionIdField, textField } from '../../fields'

// Spec item 3: block slugs use the lowercase block-<name> convention.
// Exported so the renderer can type blockType via typeof IDENTIFIER (single
// source of truth for the slug — components never duplicate the literal).
export const IDENTIFIER = '${slug}' as const

const thumbnailUrl = \`data:image/webp;base64,\${readFileSync(
  join(process.cwd(), 'src/payload/schema/blocks/${slug}/thumbnail.webp'),
  'base64',
)}\`

export const ${pascal}Block = {
  slug: IDENTIFIER,
  interfaceName: '${pascal}Block',
  admin: {
    images: {
      thumbnail: {
        // TODO: replace thumbnail.webp with a block-specific image (3:2, e.g. 600x400)
        url: thumbnailUrl,
        alt: '${pascal} block thumbnail',
      },
    },
  },
  fields: [
    identifierField({ defaultValue: IDENTIFIER }),
    sectionIdField('${slug}'),
    textField({ name: 'title', label: 'Title', required: true }),
    // TODO: add fields via the wrapper factories in src/payload/schema/fields/
    // (raw { type: ... } objects are prohibited; new field types need user approval).
  ],
} satisfies Block
`

  // 5b. component.block.tsx
  const componentContent = `import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type ${pascal}Props = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function Contents${pascal}({ id }: ${pascal}Props) {
  return <section id={id} className="relative w-full" />
}
`

  await writeFile(join(blockDir, 'schema.block.ts'), schemaContent)
  await writeFile(join(blockDir, 'component.block.tsx'), componentContent)
  await writeFile(join(blockDir, '_components', '.gitkeep'), '')

  // 6. Auto-register in blocks/index.ts
  const indexContent = await readFile(indexPath, 'utf-8')
  const lines = indexContent.split('\n')

  // Find last import line
  let lastImportLine = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith('import ')) {
      lastImportLine = i
    }
  }

  if (lastImportLine === -1) {
    console.error('Error: could not find import lines in blocks/index.ts')
    process.exit(1)
  }

  // Insert new import after the last import line
  const importLine = `import { ${pascal}Block } from './${slug}/schema.block'`
  lines.splice(lastImportLine + 1, 0, importLine)

  // Find the allBlocks declaration line and insert the new entry into its array.
  const declIdx = lines.findIndex((l) => l.includes('allBlocks'))
  if (declIdx === -1) {
    console.error(
      'Error: could not find allBlocks declaration in blocks/index.ts',
    )
    process.exit(1)
  }

  const declLine = lines[declIdx]

  if (declLine.trimEnd().endsWith('[')) {
    // Multi-line array: closing bracket is the next line that starts with ']'
    let closeIdx = -1
    for (let i = declIdx + 1; i < lines.length; i++) {
      if (lines[i].trimStart().startsWith(']')) {
        closeIdx = i
        break
      }
    }
    if (closeIdx === -1) {
      console.error(
        'Error: could not find array closing bracket in blocks/index.ts',
      )
      process.exit(1)
    }
    const indent = lines[closeIdx].match(/^(\s*)/)?.[1] ?? ''
    const prevLine = lines[closeIdx - 1]
    if (prevLine.trimEnd().endsWith(',')) {
      // Previous line already has trailing comma — insert before ']'
      lines.splice(closeIdx, 0, `${indent}  ${pascal}Block,`)
    } else {
      // Add comma to previous line, then insert new element
      lines[closeIdx - 1] = prevLine.trimEnd() + ','
      lines.splice(closeIdx, 0, `${indent}  ${pascal}Block,`)
    }
  } else {
    // Single-line array: "export const allBlocks: Block[] = [a, b]"
    // Replace the TRAILING ']' (the array close, not the type annotation)
    lines[declIdx] = declLine.replace(/\]\s*$/, `, ${pascal}Block]`)
  }

  await writeFile(indexPath, lines.join('\n'))

  // 6b. Auto-register in the page-builder registry (imports + registry entry).
  const pageBuilderPath = join(
    'src',
    'components',
    'common',
    'page-builder',
    'index.tsx',
  )
  const pbLines = (await readFile(pageBuilderPath, 'utf-8')).split('\n')

  let pbLastImport = -1
  for (let i = 0; i < pbLines.length; i++) {
    if (pbLines[i].trimStart().startsWith('import ')) {
      pbLastImport = i
    }
  }
  if (pbLastImport === -1) {
    console.error('Error: could not find imports in page-builder/index.tsx')
    process.exit(1)
  }
  pbLines.splice(
    pbLastImport + 1,
    0,
    `import { ${pascal}Block } from '@/payload/schema/blocks/${slug}/schema.block'`,
    `import Contents${pascal} from '@/payload/schema/blocks/${slug}/component.block'`,
  )

  let registryClose = -1
  for (let i = pbLastImport + 3; i < pbLines.length; i++) {
    if (pbLines[i].includes('} satisfies')) {
      registryClose = i
      break
    }
  }
  if (registryClose === -1) {
    console.error(
      'Error: could not find blockRegistry closing in page-builder/index.tsx',
    )
    process.exit(1)
  }
  const registryIndent = pbLines[registryClose - 1].match(/^(\s*)/)?.[1] ?? ''
  pbLines.splice(
    registryClose,
    0,
    `${registryIndent}[${pascal}Block.slug]: Contents${pascal},`,
  )
  await writeFile(pageBuilderPath, pbLines.join('\n'))

  // 7. Print next steps
  console.log(`Created block: ${slug}`)
  console.log('Next steps:')
  console.log(`  1. Edit src/payload/schema/blocks/${slug}/schema.block.ts`)
  console.log(
    '     Fields MUST use the wrapper factories in src/payload/schema/fields/ —',
  )
  console.log(
    '     no raw { type: ... } objects. New field types need user approval.',
  )
  console.log('  2. Run bun run generate:types')
  console.log('  3. Run bun run generate:importmap')
}

void main()
