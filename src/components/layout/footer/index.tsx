import { getFooterData } from '@/cms/data/action'
import { draftMode } from 'next/headers'
import Media from '@/components/common/media'
import { RichText } from '@payloadcms/richtext-lexical/react'
import PayloadLink from '@/components/common/payload-link'
import SubscribeForm from './subscribe-form'
import { InstagramIcon } from '@/components/icon/instagram'
import { TikTokIcon } from '@/components/icon/tiktok'
import { LinkedInIcon } from '@/components/icon/linkedin'

export default async function ContainerPageFooter() {
  const draft = (await draftMode()).isEnabled
  const footer = await getFooterData(draft)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SocialIcons: Record<string, React.ComponentType<any>> = {
    instagram: InstagramIcon,
    tiktok: TikTokIcon,
    linkedin: LinkedInIcon,
  }

  return (
    <footer className="flex flex-col pt-10 gap-10 bg-[#372B34]">
      {/* Inner Section */}
      <div className="mx-auto w-full max-w-[1308px] px-5 xl:px-0 flex flex-col gap-10 lg:flex-row lg:justify-between lg:items-center lg:min-h-[239px]">
        {/* Logo Section */}
        <div className="w-full lg:w-[310px] flex flex-col gap-6">
          {footer.logo && typeof footer.logo === 'object' && (
            <div className="relative w-[202px] h-[80px]">
              <Media media={footer.logo} objectFit="contain" />
            </div>
          )}
          {footer.intro && (
            <div className="[&_p]:m-0 text-[16px] leading-6 text-[#FBF2E9]">
              <RichText data={footer.intro} />
            </div>
          )}
        </div>

        {/* Subscription Section */}
        <div className="w-full lg:w-[417px] flex flex-col gap-8">
          {footer.heading && (
            <h2 className="font-title text-[48px] leading-[48px] text-[#FBF2E9]">
              {footer.heading}
            </h2>
          )}
          <SubscribeForm
            placeholder={footer.subscribe?.placeholder ?? ''}
            buttonLabel={footer.subscribe?.buttonLabel ?? ''}
            note={footer.subscribe?.note ?? ''}
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#FBF2E9]">
        <div className="mx-auto w-full max-w-[1308px] px-5 xl:px-0 py-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            {footer.copyright && (
              <span className="text-[12px] leading-none uppercase text-[#FBF2E9]">
                {footer.copyright}
              </span>
            )}
            {footer.links?.map((linkItem, idx) => (
              <PayloadLink
                key={idx}
                link={linkItem}
                className="text-[12px] leading-none uppercase text-[#FBF2E9]"
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            {footer.socials?.map((social, idx) => {
              if (!social.platform) return null
              const IconComp = SocialIcons[social.platform]
              if (!IconComp) return null
              return (
                <PayloadLink
                  key={idx}
                  link={social.link}
                  className="flex items-center justify-center w-6 h-6 hover:opacity-80 transition-opacity"
                  aria-label={social.link.label || social.platform}
                >
                  <IconComp />
                </PayloadLink>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
