/* eslint-disable no-console -- verify Media video branch */
import { renderToStaticMarkup } from 'react-dom/server'
import MediaVisual from '../src/components/common/media'

const videoDoc = {
  id: 'vid1',
  alt: 'Hero video',
  url: 'https://cdn.example.com/hero.mp4',
  mimeType: 'video/mp4',
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
} as const

const video = renderToStaticMarkup(
  <MediaVisual media={videoDoc} objectFit="contain" className="rotate-45" />,
)
console.log('VIDEO:', video)
if (
  !video.includes('<video') ||
  !video.includes('src="https://cdn.example.com/hero.mp4"') ||
  !video.includes('autoPlay') ||
  !video.includes('muted') ||
  !video.includes('loop') ||
  !video.includes('playsInline') ||
  !video.includes('object-fit:contain')
) {
  throw new Error('video branch output incomplete')
}

const noMedia = renderToStaticMarkup(<MediaVisual media={null} />)
if (noMedia !== '') throw new Error('null media should render nothing')

console.log('OK')
