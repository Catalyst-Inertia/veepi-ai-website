import type { Page, Post } from '@/payload-types'

/**
 * Union of every block interface usable in Page/Post `contents`.
 * TS collapses identical union members, so each block appears exactly once.
 */
export type Block =
  | NonNullable<Page['contents']>[number]
  | NonNullable<Post['contents']>[number]
