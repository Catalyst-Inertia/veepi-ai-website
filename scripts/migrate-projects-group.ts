/* eslint-disable no-console -- F-04 migration script */
/**
 * Migrates the legacy seeded `/projects` group to `/works` (F-04).
 *
 * Background: the pre-F-04 seed created a group with prefix `/projects`
 * alongside a page with slug `projects`. The route-policy validation now
 * rejects that overlap (a page slug and a group prefix claim the same
 * one-segment route), so any environment seeded before the policy change
 * holds an orphaned group that blocks edits of the `/projects` page. This
 * script renames the group in place — posts keep their group relation and
 * their public paths follow the new prefix (`/projects/<slug>` ->
 * `/works/<slug>`).
 *
 * DRY-RUN by default; pass `--apply` to write.
 * Run: bunx tsx --env-file=.env scripts/migrate-projects-group.ts
 */
import payload from 'payload'
import config from '../payload.config'

const apply = process.argv.includes('--apply')

const main = async (): Promise<void> => {
  await payload.init({ config })

  const found = await payload.find({
    collection: 'groups',
    where: { prefix: { equals: '/projects' } },
    limit: 1,
    depth: 0,
  })
  const group = found.docs[0]
  if (!group) {
    console.log('No group with prefix /projects — nothing to migrate.')
    return
  }

  // The target prefix must be free (unique: true on groups.prefix).
  const targetFree = await payload.find({
    collection: 'groups',
    where: { prefix: { equals: '/works' } },
    limit: 1,
    depth: 0,
  })
  if (targetFree.docs.length > 0 && targetFree.docs[0].id !== group.id) {
    console.error(
      `Aborting: another group already owns prefix /works (${targetFree.docs[0].id}).`,
    )
    process.exitCode = 1
    return
  }

  const posts = await payload.find({
    collection: 'posts',
    where: { group: { equals: group.id } },
    limit: 1000,
    depth: 0,
  })

  console.log(
    `GROUP ${group.id}  name: "${group.name}"  prefix: /projects -> /works (name -> Works)`,
  )
  for (const post of posts.docs) {
    console.log(
      `  POST ${post.id}  slug: "${post.slug}"  path: /projects/${post.slug} -> /works/${post.slug}`,
    )
  }

  if (!apply) {
    console.log('Dry-run complete — pass --apply to write the new prefix.')
    return
  }

  await payload.update({
    collection: 'groups',
    id: group.id,
    data: { name: 'Works', prefix: '/works' },
  })
  console.log(`Applied: group ${group.id} now at /works (name: Works).`)
}

void main()
  .catch((err: unknown) => {
    console.error('Migration failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await payload.db?.destroy?.()
    } catch {
      /* best effort */
    }
  })
