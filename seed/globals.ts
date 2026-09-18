/* eslint-disable no-console -- globals seed */
import payload from 'payload'
import { ensureMedia, richTextParagraph } from './lib'

const WHATSAPP_URL =
  'https://api.whatsapp.com/send?phone=6282340931249&text=Hi%20There%2C%0A%0AIf%20you%20want%20to%20create%20great%20sites%2C%20follow%20us%20%F0%9F%92%8E'

// Header/footer link fields store (label, type, externalUrl) — `url` is a
// virtual resolved field, so seeds write the stored shape.
const extLink = (label: string, externalUrl: string) => ({
  label,
  type: 'external' as const,
  externalUrl,
})

export async function seedGlobals(): Promise<void> {
  const navItems = [
    extLink('Projects', '/#projects'),
    extLink('About', '/#about'),
    extLink('Services', '/#services'),
    extLink('Blogs', '/#blogs'),
  ]
  const logoId = await ensureMedia('logo-white.webp', 'Catatia logo')
  const backgroundId = await ensureMedia(
    'footer-bg.webp',
    'Catatia footer background',
  )

  await payload.updateGlobal({
    slug: 'header',
    data: {
      ...(logoId ? { logo: logoId } : {}),
      nav: navItems,
      cta: extLink('Ring The Bell', WHATSAPP_URL),
    },
  })
  console.log('Global header updated')

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      ...(logoId ? { logo: logoId } : {}),
      ...(backgroundId ? { background: backgroundId } : {}),
      heading: 'Let’s collaborate!',
      intro: richTextParagraph(
        'This is no mere website—it’s a gateway to digital sorcery, crafted with the mystical magic of CATATIA. Together, let’s forge a partnership and conjure extraordinary creations that defy the ordinary!',
      ),
      cta: extLink('Reach Out', WHATSAPP_URL),
      sectionLabels: { links: 'The Magic Atlas', contact: 'Portal Key' },
      links: [
        extLink('Project', '/#project'),
        extLink('About', '/#about'),
        extLink('Services', '/#services'),
        extLink('Contact', '/#contact'),
        extLink('FAQ', '/#faq'),
        extLink('Blog', '/#blog'),
      ],
      socials: [
        { platform: 'tiktok', link: extLink('TikTok', 'https://tiktok.com') },
        {
          platform: 'facebook',
          link: extLink('Facebook', 'https://facebook.com'),
        },
        {
          platform: 'instagram',
          link: extLink('Instagram', 'https://instagram.com'),
        },
        {
          platform: 'linkedin',
          link: extLink('LinkedIn', 'https://linkedin.com'),
        },
      ],
      contact: [
        { icon: 'phone', label: '+62 823 - 4092 - 1249' },
        { icon: 'mail', label: 'hello@catatia.com' },
        { icon: 'location', label: 'Jl Padma Gg. Jaya Raya No.7' },
      ],
      copyright: '© 2025 Catatia All right reserved',
    },
  })
  console.log('Global footer updated')
}
