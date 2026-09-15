/* eslint-disable no-console -- projects seed */
import type { Post } from '../src/payload-types'
import { projectData } from '../src/data/project'
import { ensureMedia, upsertPage, upsertGroup, upsertPost } from './lib'
import type { UpsertPostData } from './lib'

// Matches the posts collection's formatSlug behavior (dots become dashes so
// "Artchive.id" -> "artchive-id" keeps the pre-existing slug stable).
const slugify = (title: string): string =>
  title
    .toLowerCase()
    .replace(/\./g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export async function seedProjects(): Promise<void> {
  // Media: reuse existing doc with a url; else try uploading a placeholder; else null (skip image blocks).

  const projectsPage = await upsertPage('projects', {
    title: 'Projects',
    seo: {
      title: 'Projects — Catatia',
      description: 'Selected work.',
      keywords: 'projects,work',
    },
    contents: [],
  })
  console.log('Page projects:', projectsPage.id)

  const group = await upsertGroup('Projects', '/works')
  console.log('Group:', group.id, group.prefix)

  // Case studies: every project becomes a published post in the /projects
  // group (og:image as the case-study thumbnail), feeding the
  // block-home-portfolio block feed.
  for (const project of projectData) {
    const thumbnailId = await ensureMedia(
      project.thumbnail.replace('/assets/images/', ''),
      project.title,
    )
    const slug = slugify(project.title)
    const postData: UpsertPostData = {
      title: project.title,
      slug,
      seo: {
        title: `${project.title} — Catatia`,
        description: project.description,
        keywords: project.tags.join(','),
        ...(thumbnailId ? { og_image: thumbnailId } : {}),
      },
      group: group.id,
      contents: [],
    }
    const post: Post = await upsertPost(slug, group.id, postData)
    console.log(`Post ${slug}:`, post.id)
  }
}
