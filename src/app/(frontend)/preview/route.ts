import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

// Draft preview entry point. `?exit=1` disables draft mode instead.
// URL shape: /preview?path=<public path>&secret=<REVALIDATE_SECRET>[&exit=1]
export async function GET(request: Request): Promise<Response | never> {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const secret = searchParams.get('secret')

  const draft = await draftMode()

  if (searchParams.get('exit') === '1') {
    draft.disable()
    redirect(path && path.startsWith('/') ? path : '/')
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('You are not allowed to preview this page', {
      status: 401,
    })
  }
  if (!path || !path.startsWith('/')) {
    return new Response('Missing or invalid `path` search param', {
      status: 400,
    })
  }

  draft.enable()
  redirect(path)
}
