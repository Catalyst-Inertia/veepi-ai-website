// Thin indirection over next/cache's revalidatePath/revalidateTag so the
// hooks' invalidation targets are observable outside a running Next server.
// Production code calls through to next/cache as before; smoke scripts install
// a recorder (setInvalidationRecorder) and assert the exact paths/tags the
// hooks invalidated.
import { revalidatePath, revalidateTag } from 'next/cache'

type InvalidationRecorder = { paths: string[]; tags: string[] } | null

let recorder: InvalidationRecorder = null

/** Test hook: capture invalidation targets instead of calling next/cache. */
export const setInvalidationRecorder = (r: InvalidationRecorder): void => {
  recorder = r
}

export const invalidatePath = (
  path: string,
  type?: 'layout' | 'page',
): void => {
  if (recorder) recorder.paths.push(path)
  else revalidatePath(path, type)
}

export const invalidateTag = (tag: string): void => {
  if (recorder) recorder.tags.push(tag)
  else revalidateTag(tag)
}
