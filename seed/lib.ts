// shared seed helpers
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { RequiredDataFromCollectionSlug } from 'payload'
import payload from 'payload'
import type { Page, Post, BlockDetailBlock } from '../src/payload-types'

export const paragraphNode = (text: string) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: 0,
  textStyle: '',
  children: [
    {
      type: 'text',
      format: 0,
      version: 1,
      detail: 0,
      mode: 'normal',
      style: '',
      text,
    },
  ],
})

export const richTextParagraph = (
  text: string,
): NonNullable<BlockDetailBlock['content']> => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [paragraphNode(text)],
  },
})

export const richTextParagraphs = (
  texts: string[],
): NonNullable<BlockDetailBlock['content']> => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: texts.map(paragraphNode),
  },
})

// Upload a public asset into the media collection (reuse by filename when
// already seeded), returning the media id, or undefined on failure.
// Oldest doc with a url wins so re-runs are stable and never grow duplicates.
// Stills live under public/assets/images (webp/svg); videos under
// public/assets/videos (mp4/webm) — dir and mimetype follow the extension.
const mediaKind = (filename: string): { dir: string; mimetype: string } => {
  if (filename.endsWith('.webm')) {
    return { dir: 'videos', mimetype: 'video/webm' }
  }
  if (filename.endsWith('.mp4')) {
    return { dir: 'videos', mimetype: 'video/mp4' }
  }
  if (filename.endsWith('.svg')) {
    return { dir: 'images', mimetype: 'image/svg+xml' }
  }
  return { dir: 'images', mimetype: 'image/webp' }
}

export const ensureMedia = async (
  rawFilename: string,
  alt: string,
): Promise<string | undefined> => {
  try {
    // Payload flattens path separators in stored filenames, so query/upload
    // with the normalized name ("(projects)/x.svg" -> "(projects)x.svg").
    const filename = rawFilename.replace(/\//g, '')
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      sort: 'createdAt',
    })
    const usable = existing.docs.find((doc) => doc.url)
    if (usable) return usable.id
    // Raw path keeps subdirectories (e.g. '(projects)/artchiveid.svg') — the
    // flattened name is only the DB/upload filename, not a disk path.
    const { dir, mimetype } = mediaKind(filename)
    const buf = await readFile(
      join(process.cwd(), 'public/assets', dir, rawFilename),
    )
    const created = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data: buf, mimetype, name: filename, size: buf.length },
    })
    return created.id
  } catch {
    return undefined
  }
}

export type UpsertPageData = Omit<
  RequiredDataFromCollectionSlug<'pages'>,
  'slug'
> & {
  seo?: Page['seo']
  contents?: Page['contents']
}

// payload.create/update's generic widens TSlug when data comes from a typed
// variable; bind narrow signatures so the literal collection slug drives
// inference. bind(payload) keeps `this` so the calls work at runtime.
const createPage = payload.create.bind(payload) as unknown as (options: {
  collection: 'pages'
  data: RequiredDataFromCollectionSlug<'pages'>
}) => Promise<Page>
const updatePage = payload.update.bind(payload) as unknown as (options: {
  collection: 'pages'
  id: string
  data: RequiredDataFromCollectionSlug<'pages'>
}) => Promise<Page>

export const upsertPage = async (
  slug: string,
  data: UpsertPageData,
): Promise<Page> => {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0]) {
    return updatePage({
      collection: 'pages',
      id: existing.docs[0].id,
      data: data as RequiredDataFromCollectionSlug<'pages'>,
    })
  }
  return createPage({
    collection: 'pages',
    data: { slug, ...data } as RequiredDataFromCollectionSlug<'pages'>,
  })
}

export type UpsertPostData = Omit<
  RequiredDataFromCollectionSlug<'posts'>,
  'slug'
> & {
  slug: string
  seo?: Post['seo']
  contents?: Post['contents']
}

const createPost = payload.create.bind(payload) as unknown as (options: {
  collection: 'posts'
  data: RequiredDataFromCollectionSlug<'posts'>
}) => Promise<Post>
const updatePost = payload.update.bind(payload) as unknown as (options: {
  collection: 'posts'
  id: string
  data: RequiredDataFromCollectionSlug<'posts'>
}) => Promise<Post>

export const upsertPost = async (
  slug: string,
  groupId: string,
  data: UpsertPostData,
): Promise<Post> => {
  const existing = await payload.find({
    collection: 'posts',
    where: {
      and: [{ slug: { equals: slug } }, { group: { equals: groupId } }],
    },
    limit: 1,
    depth: 0,
  })
  return existing.docs[0]
    ? updatePost({
        collection: 'posts',
        id: existing.docs[0].id,
        data: data as RequiredDataFromCollectionSlug<'posts'>,
      })
    : createPost({
        collection: 'posts',
        data: data as RequiredDataFromCollectionSlug<'posts'>,
      })
}

export const upsertGroup = async (name: string, prefix: string) => {
  const existing = await payload.find({
    collection: 'groups',
    where: { prefix: { equals: prefix } },
    limit: 1,
    depth: 0,
  })
  return (
    existing.docs[0] ??
    (await payload.create({
      collection: 'groups',
      data: { name, prefix },
    }))
  )
}
