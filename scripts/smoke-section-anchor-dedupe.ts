/**
 * Runtime smoke test for section-anchor dedupe (spec Phase 5 checklist:
 * "Smoke-test section anchors on a page with repeated blocks").
 *
 * PageBuilder resolves each block's rendered section id through
 * resolveSectionIds (src/components/common/page-builder/section-ids.ts):
 * CMS `sectionId` wins, duplicates get a numeric suffix, and blocks without
 * one fall back to a slugified blockType + index. This runs the real resolver
 * against repeated and empty-id block lists.
 *
 * No DB needed — pure module test.
 * Run: bunx tsx scripts/smoke-section-anchor-dedupe.ts
 */
/* eslint-disable no-console -- scratch verification script */
import { resolveSectionIds } from '../src/components/common/page-builder/section-ids'

const failures: string[] = []
const check = (label: string, cond: boolean, detail?: unknown) => {
  if (cond) {
    console.log(`  ok: ${label}`)
  } else {
    failures.push(label)
    console.log(
      `  FAIL: ${label}`,
      detail === undefined ? '' : JSON.stringify(detail),
    )
  }
}

// --- unique ids pass through unchanged ---
check(
  'unique sectionIds pass through',
  JSON.stringify(
    resolveSectionIds([
      { blockType: 'block-masthead', sectionId: 'hero-a' },
      { blockType: 'block-detail', sectionId: 'detail-b' },
    ]),
  ) === JSON.stringify(['hero-a', 'detail-b']),
)

// --- duplicate ids get numeric suffixes ---
const dup = resolveSectionIds([
  { blockType: 'block-masthead', sectionId: 'shared' },
  { blockType: 'block-detail', sectionId: 'shared' },
])
check(
  'duplicate sectionIds dedupe with -2 suffix',
  JSON.stringify(dup) === JSON.stringify(['shared', 'shared-2']),
  dup,
)

// --- three-way duplicate continues -3 ---
const triple = resolveSectionIds([
  { blockType: 'block-masthead', sectionId: 'x' },
  { blockType: 'block-hero', sectionId: 'x' },
  { blockType: 'block-spacer', sectionId: 'x' },
])
check(
  'triple duplicate dedupes to x, x-2, x-3',
  JSON.stringify(triple) === JSON.stringify(['x', 'x-2', 'x-3']),
  triple,
)

// --- no sectionId: slugified blockType + 1-based index ---
const fallback = resolveSectionIds([
  { blockType: 'block-masthead' },
  { blockType: 'block-masthead' },
])
check(
  'missing sectionId falls back to blockType-index',
  JSON.stringify(fallback) ===
    JSON.stringify(['block-masthead-1', 'block-masthead-2']),
  fallback,
)

// --- blank sectionId treated as missing ---
const blank = resolveSectionIds([
  { blockType: 'block-hero', sectionId: '   ' },
  { blockType: 'block-hero', sectionId: '' },
])
check(
  'blank sectionId falls back to blockType-index',
  JSON.stringify(blank) === JSON.stringify(['block-hero-1', 'block-hero-2']),
  blank,
)

// --- legacy/non-kebab blockType is slugified for the fallback ---
const legacy = resolveSectionIds([{ blockType: 'PROJECT.MASTERHEAD' }])
check(
  'uppercase blockType slugifies for fallback id',
  legacy[0] === 'project-masterhead-1',
  legacy,
)

// --- collision between explicit id and generated fallback ---
// Second block's fallback is block-hero-2 (index 1); explicit id pre-claims it.
const mixed = resolveSectionIds([
  { blockType: 'block-hero', sectionId: 'block-hero-2' },
  { blockType: 'block-hero' },
])
check(
  'generated fallback collides with explicit id and gets suffix',
  JSON.stringify(mixed) === JSON.stringify(['block-hero-2', 'block-hero-2-2']),
  mixed,
)

console.log(
  failures.length === 0
    ? '\nALL CHECKS PASSED'
    : `\n${failures.length} CHECK(S) FAILED`,
)
process.exit(failures.length === 0 ? 0 : 1)
