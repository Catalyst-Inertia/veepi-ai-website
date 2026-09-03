/* eslint-disable no-console -- projects seed */
import payload from 'payload'
import type {
  Media,
  Post,
  BlockDetailBlock,
  BlockMastheadBlock,
} from '../src/payload-types'
import { projectData } from '../src/data/project'
import {
  ensureMedia,
  richTextParagraph,
  upsertGroup,
  upsertPage,
  upsertPost,
} from './lib'
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
  let media: Media | null = null
  try {
    const existing = await payload.find({
      collection: 'media',
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]?.url) {
      media = existing.docs[0] as Media
    } else {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#09080d"/></svg>`
      const created = await payload.create({
        collection: 'media',
        data: { alt: 'Seed placeholder' },
        file: {
          data: Buffer.from(svg),
          mimetype: 'image/svg+xml',
          name: 'seed-placeholder.svg',
          size: Buffer.byteLength(svg),
        },
      })
      media = created as Media
    }
  } catch {
    media = null
  }

  const masthead = (
    title: string,
    eyebrow: string,
  ): BlockMastheadBlock | null => {
    if (!media?.url) return null
    return {
      identifier: 'block-masthead',
      title,
      eyebrow,
      minicaps: [{ item: 'CATATIA' }],
      image: media.id,
      blockType: 'block-masthead',
    }
  }
  const detail = (
    title: string,
    text: string,
    actionButton: { label: string; href: string },
  ): BlockDetailBlock => ({
    identifier: 'block-detail',
    title,
    content: richTextParagraph(text),
    actionButton: {
      label: actionButton.label,
      type: 'external',
      externalUrl: actionButton.href,
      variant: 'primary',
    },
    blockType: 'block-detail',
  })

  const projectsPage = await upsertPage('projects', {
    title: 'Projects',
    seo: {
      title: 'Projects — Catatia',
      description: 'Selected work.',
      keywords: 'projects,work',
    },
    contents: [
      detail('Projects', 'A selection of our work.', {
        label: 'View case study',
        href: '/works/artchive-id',
      }),
    ],
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
      contents: [
        masthead(project.title, 'PROJECTS'),
        detail('The project', project.description, {
          label: 'Contact us',
          href: '/#contact',
        }),
      ].filter((b): b is BlockMastheadBlock | BlockDetailBlock => b !== null),
    }
    const post: Post = await upsertPost(slug, group.id, postData)
    console.log(`Post ${slug}:`, post.id)
  }
}
