/* eslint-disable no-console -- globals seed */
import payload from 'payload'
import { ensureMedia, richTextParagraph } from './lib'

// Header/footer link fields store (label, type, externalUrl) — `url` is a
// virtual resolved field, so seeds write the stored shape.
const extLink = (label: string, externalUrl: string) => ({
  label,
  type: 'external' as const,
  externalUrl,
})

export async function seedGlobals(): Promise<void> {
  const navItems = [
    extLink('Home', '/'),
    extLink('Video Gallery', '/video-gallery'),
    extLink('Distribution', '/distribution'),
    extLink('Schedule a Call', 'https://calendly.com/chris-tixta/website'),
  ]
  const logoId = await ensureMedia('logo-white.webp', 'Catatia logo')
  const footerLogoId = await ensureMedia('veepi-logo.svg', 'VeePi logo')

  await payload.updateGlobal({
    slug: 'header',
    data: {
      ...(logoId ? { logo: logoId } : {}),
      nav: navItems,
      cta: extLink('Log In', 'https://veepi.ai/'),
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
