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
  const footerLogoId = await ensureMedia('veepi-logo.svg', 'VeePi logo')

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
      ...(footerLogoId ? { logo: footerLogoId } : {}),
      heading: 'Stay in the loop.',
      intro: richTextParagraph(
        'AI-powered creative content for medical & aesthetic professionals.',
      ),
      subscribe: {
        placeholder: 'e.g. youremail@email.com',
        buttonLabel: 'Subscribe',
        note: 'No spam. Just useful creative inspiration.',
      },
      links: [
        extLink('Privacy Policy', '/privacy-policy'),
        extLink('Terms of Service', '/terms-of-service'),
      ],
      socials: [
        {
          platform: 'linkedin',
          link: extLink('LinkedIn', 'https://www.linkedin.com'),
        },
        {
          platform: 'instagram',
          link: extLink('Instagram', 'https://www.instagram.com'),
        },
        {
          platform: 'tiktok',
          link: extLink('TikTok', 'https://www.tiktok.com'),
        },
      ],
      copyright: '© 2026 VeePi. All rights reserved.',
    },
  })
  console.log('Global footer updated')
}
