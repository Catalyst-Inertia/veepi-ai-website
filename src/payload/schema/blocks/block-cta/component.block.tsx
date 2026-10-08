import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Media from '@/components/common/media'

export type BlockCtaProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

export default function ContentsBlockCta(props: BlockCtaProps) {
  const {
    id,
    title,
    tagline,
    description,
    cta,
    stat1Value,
    stat1Label,
    stat2Value,
    stat2Label,
    stat3Value,
    stat3Label,
    phoneMedia,
  } = props

  const ctaLabel =
    cta?.label && cta.label !== 'GET STARTED & SEE HOW IT WORKS'
      ? cta.label
      : 'Schedule a Call'
  const ctaUrl =
    cta?.url && cta.url !== '/get-started'
      ? cta.url
      : 'https://calendly.com/chris-tixta/website'

  return (
    <section
      id={id}
      className="relative bg-[#101010] min-h-[1000px] lg:min-h-[1300px] flex items-center justify-center overflow-hidden py-20 lg:py-0 px-4 lg:px-0"
    >
      <div className="relative w-full max-w-[1310px] min-h-[636px] flex flex-col lg:block">
        {/* Background blobs — OUTSIDE the card, coral→purple gradient, blurred */}
        <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
          {/* Left blob */}
          <div
            className="absolute w-[730px] h-[723px]"
            style={{
              left: 'calc(50% - 365px - 778px)',
              top: 0,
              background:
                'linear-gradient(180deg, rgba(240,135,107,0.8) 0%, rgba(192,94,196,0.8) 100%)',
              filter: 'blur(100px)',
              transform: 'rotate(38.71deg)',
            }}
          />
          {/* Right blob */}
          <div
            className="absolute w-[730px] h-[723px]"
            style={{
              left: 'calc(50% - 365px + 487px)',
              top: 0,
              background:
                'linear-gradient(180deg, rgba(240,135,107,0.8) 0%, rgba(192,94,196,0.8) 100%)',
              filter: 'blur(100px)',
              transform: 'rotate(38.71deg)',
            }}
          />
        </div>

        {/* Glass card surface — dark semi-transparent fill with border */}
        <div
          className="absolute inset-0 rounded-[40px] border border-white/10 z-10 pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(60px)',
          }}
          aria-hidden
        />

        {/* Content inner — flex col, padding matching design: 80px top, 64px sides, 64px bottom */}
        <div className="relative z-20 flex flex-col gap-[40px] px-6 lg:px-[64px] pt-12 lg:pt-[80px] pb-12 lg:pb-[64px] lg:min-h-[636px] pointer-events-auto">
          {/* Left content column — max 680px */}
          <div className="flex flex-col gap-[40px] w-full lg:max-w-[680px]">
            {/* Header + details */}
            <div className="flex flex-col gap-[40px]">
              {/* Title — FreightDispCmp Pro 96/96, Linen */}
              <h2 className="font-title font-normal text-5xl lg:text-[96px] lg:leading-[96px] text-[#FBF2E9] m-0">
                {title}
              </h2>

              {/* Details — tagline + description, gap 16 */}
              <div className="flex flex-col gap-[16px] max-w-[421px]">
                {tagline && (
                  <p className="font-text font-extrabold text-[16px] leading-[24px] text-[#FBF2E9] m-0">
                    {tagline}
                  </p>
                )}
                {description && (
                  <div className="font-text font-normal text-[16px] leading-[24px] text-[#FBF2E9] [&_p]:m-0">
                    <RichText data={description} />
                  </div>
                )}
              </div>
            </div>

            {/* CTA button — gradient, 278×48, radius 8 */}
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row justify-center items-center px-[24px] py-[12px] gap-[16px] w-full lg:w-[278px] h-[48px] rounded-[8px] bg-[linear-gradient(90deg,#C05EC4_0%,#F0876B_100%)] transition-opacity hover:opacity-90"
            >
              <span className="font-text font-normal text-[12px] leading-[12px] uppercase text-[#FBF2E9] text-center">
                {ctaLabel}
              </span>
            </a>
          </div>

          {/* Stats row — flex row, gap 24, items-center */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-[24px]">
            {/* Stat 1 */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-[16px] lg:py-[16px]">
              <span className="font-title font-normal text-[48px] lg:text-[32px] leading-[48px] lg:leading-[32px] text-[#FBF2E9]">
                {stat1Value}
              </span>
              <p className="font-text font-normal text-[16px] lg:text-[12px] leading-[24px] lg:leading-[18px] text-[#FBF2E9] m-0 w-full max-w-full lg:max-w-[118px]">
                {stat1Label}
              </p>
            </div>

            {/* Separator */}
            <div className="hidden lg:block w-px h-[56px] bg-[#FBF2E9]" />

            {/* Stat 2 */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-[16px] lg:py-[16px]">
              <span className="font-title font-normal text-[48px] lg:text-[32px] leading-[48px] lg:leading-[32px] text-[#FBF2E9]">
                {stat2Value}
              </span>
              <p className="font-text font-normal text-[16px] lg:text-[12px] leading-[24px] lg:leading-[18px] text-[#FBF2E9] m-0 w-full max-w-full lg:max-w-[103px]">
                {stat2Label}
              </p>
            </div>

            {/* Separator */}
            <div className="hidden lg:block w-px h-[56px] bg-[#FBF2E9]" />

            {/* Stat 3 */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-[16px] lg:py-[16px]">
              <span className="font-title font-normal text-[48px] lg:text-[32px] leading-[48px] lg:leading-[32px] text-[#FBF2E9]">
                {stat3Value}
              </span>
              <p className="font-text font-normal text-[16px] lg:text-[12px] leading-[24px] lg:leading-[18px] text-[#FBF2E9] m-0 w-full max-w-full lg:max-w-[111px]">
                {stat3Label}
              </p>
            </div>
          </div>
        </div>

        {/* Phone mockup — sibling to card wrapper, overlaps card via z-index and absolute positioning */}
        <div
          className="hidden lg:block absolute z-30 pointer-events-none right-[63.65px] top-[calc(50%-400px)]"
          style={{
            width: '391.35px',
            height: '800px',
          }}
        >
          {/* Phone screen (video/image) — inset from frame edges, clipped to screen shape */}
          <div
            className="absolute overflow-hidden"
            style={{
              width: '353.13px',
              height: '766.33px',
              left: 'calc(50% - 176.57px)',
              top: 'calc(50% - 383.17px)',
              borderRadius: '36.405px',
            }}
          >
            {phoneMedia && (
              <Media
                media={phoneMedia}
                objectFit="cover"
                className="w-full h-full"
              />
            )}
          </div>

          {/* Phone frame image — overlaid above screen, same dimensions */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/phone-frame.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
          />

          {/* Status bar / dynamic island SVG overlay */}
          <svg
            width="392"
            height="800"
            viewBox="0 0 392 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
          >
            <path
              d="M59.1559 42.6918C59.7401 42.6918 60.2941 42.8 60.8179 43.0166C61.3417 43.2281 61.8051 43.5606 62.208 44.0138C62.6159 44.4621 62.9358 45.0388 63.1674 45.7439C63.3991 46.444 63.515 47.2876 63.515 48.2747V48.2898C63.515 49.5137 63.3387 50.5613 62.9861 51.4326C62.6336 52.3039 62.1274 52.9738 61.4676 53.4422C60.8129 53.9055 60.0297 54.1372 59.1181 54.1372C58.4482 54.1372 57.8439 54.0163 57.3049 53.7746C56.7711 53.5278 56.3279 53.1903 55.9753 52.7622C55.6278 52.3291 55.3936 51.8355 55.2727 51.2815L55.2576 51.1984H57.169L57.1992 51.274C57.2949 51.5258 57.4309 51.7474 57.6071 51.9388C57.7885 52.1302 58.005 52.2787 58.2568 52.3845C58.5137 52.4852 58.8008 52.5356 59.1181 52.5356C59.6923 52.5356 60.1606 52.3669 60.5233 52.0294C60.8909 51.6869 61.1654 51.2311 61.3467 50.662C61.5331 50.0879 61.6389 49.4533 61.664 48.7582C61.6691 48.6827 61.6716 48.6096 61.6716 48.5391C61.6716 48.4636 61.6716 48.3906 61.6716 48.32L61.3316 46.4994C61.3316 46.0864 61.2359 45.7111 61.0446 45.3737C60.8532 45.0363 60.5938 44.7693 60.2664 44.5729C59.9441 44.3765 59.5789 44.2783 59.171 44.2783C58.7781 44.2783 58.418 44.374 58.0906 44.5653C57.7633 44.7567 57.5014 45.0186 57.3049 45.351C57.1085 45.6784 57.0103 46.0461 57.0103 46.454V46.4691C57.0103 46.8922 57.1035 47.2674 57.2898 47.5948C57.4762 47.9171 57.7305 48.1715 58.0529 48.3578C58.3752 48.5442 58.7429 48.6373 59.1559 48.6373C59.5689 48.6373 59.939 48.5467 60.2664 48.3654C60.5938 48.1841 60.8532 47.9322 61.0446 47.6099C61.2359 47.2876 61.3316 46.9224 61.3316 46.5145V46.4994H61.7849V48.5089H61.5205C61.3896 48.796 61.1956 49.0629 60.9388 49.3097C60.6819 49.5565 60.3646 49.7555 59.9869 49.9065C59.6142 50.0576 59.176 50.1332 58.6724 50.1332C57.9773 50.1332 57.3629 49.9771 56.829 49.6648C56.2951 49.3525 55.8746 48.9244 55.5674 48.3805C55.2652 47.8365 55.1141 47.2221 55.1141 46.5371V46.522C55.1141 45.7817 55.2853 45.1244 55.6278 44.5502C55.9753 43.971 56.4538 43.5177 57.0632 43.1904C57.6777 42.858 58.3752 42.6918 59.1559 42.6918ZM66.4897 52.3996C66.1473 52.3996 65.8602 52.2863 65.6285 52.0596C65.4019 51.828 65.2885 51.5459 65.2885 51.2135C65.2885 50.8761 65.4019 50.594 65.6285 50.3674C65.8602 50.1357 66.1473 50.0199 66.4897 50.0199C66.8373 50.0199 67.1243 50.1357 67.351 50.3674C67.5776 50.594 67.691 50.8761 67.691 51.2135C67.691 51.5459 67.5776 51.828 67.351 52.0596C67.1243 52.2863 66.8373 52.3996 66.4897 52.3996ZM66.4897 46.794C66.1473 46.794 65.8602 46.6807 65.6285 46.454C65.4019 46.2223 65.2885 45.9403 65.2885 45.6079C65.2885 45.2704 65.4019 44.9884 65.6285 44.7618C65.8602 44.5301 66.1473 44.4142 66.4897 44.4142C66.8373 44.4142 67.1243 44.5301 67.351 44.7618C67.5776 44.9884 67.691 45.2704 67.691 45.6079C67.691 45.9403 67.5776 46.2223 67.351 46.454C67.1243 46.6807 66.8373 46.794 66.4897 46.794ZM74.7529 53.8652V51.7726H69.4192V50.1785C69.7063 49.69 69.9934 49.1989 70.2805 48.7053C70.5726 48.2118 70.8672 47.7207 71.1644 47.2322C71.4666 46.7386 71.7662 46.2526 72.0634 45.7741C72.3656 45.2906 72.6652 44.8146 72.9624 44.3463C73.2646 43.8728 73.5668 43.412 73.869 42.9637H76.6113V50.1634H78.0845V51.7726H76.6113V53.8652H74.7529ZM71.2324 50.2087H74.7831V44.52H74.6698C74.4482 44.8625 74.219 45.215 73.9823 45.5777C73.7506 45.9403 73.5164 46.3105 73.2797 46.6882C73.043 47.066 72.8088 47.4462 72.5771 47.829C72.3454 48.2067 72.1163 48.587 71.8896 48.9698C71.663 49.3475 71.4439 49.7227 71.2324 50.0954V50.2087ZM82.1396 53.8652V44.8826H82.0036L79.2915 46.794V44.9657L82.1396 42.9637H84.0812V53.8652H82.1396Z"
              fill="black"
            />
            <path
              d="M92.0072 48.3697C91.7971 48.366 91.622 48.3198 91.482 48.231C91.3456 48.1385 91.2442 48.022 91.1779 47.8814C91.1115 47.7371 91.0857 47.5854 91.1005 47.4263C91.1152 47.2635 91.1705 47.1137 91.2663 46.9768C91.3622 46.8362 91.5041 46.7234 91.6921 46.6383L100.538 42.5484C100.793 42.4337 101.027 42.3875 101.241 42.4097C101.454 42.4282 101.629 42.504 101.766 42.6372C101.902 42.7667 101.983 42.9369 102.009 43.1478C102.039 43.3549 101.994 43.588 101.876 43.847L97.8126 52.6927C97.7241 52.8925 97.608 53.0423 97.4643 53.1422C97.3205 53.2458 97.1676 53.305 97.0054 53.3198C96.8432 53.3383 96.6902 53.3142 96.5465 53.2476C96.4027 53.181 96.2866 53.0774 96.1982 52.9369C96.1097 52.8 96.0655 52.6298 96.0655 52.4263L96.0544 48.4696C96.0544 48.4104 96.0249 48.3808 95.9659 48.3808L92.0072 48.3697Z"
              fill="black"
            />
            <rect
              x="140.159"
              y="31.8545"
              width="111.035"
              height="32.7645"
              rx="16.3823"
              fill="black"
            />
            <circle cx="234.812" cy="48.2361" r="5.46075" fill="#0E101F" />
            <circle cx="234.812" cy="48.2364" r="4.46789" fill="#01031A" />
            <g filter="url(#filter0_f_35_3607)">
              <ellipse
                cx="234.812"
                cy="45.7546"
                rx="2.48216"
                ry="0.992864"
                fill="white"
                fillOpacity="0.1"
              />
            </g>
            <g filter="url(#filter1_f_35_3607)">
              <ellipse
                cx="234.812"
                cy="50.2227"
                rx="2.48216"
                ry="1.4893"
                fill="white"
                fillOpacity="0.1"
              />
            </g>
            <path
              d="M275.464 50.0566H276.526C277.112 50.0566 277.588 50.5151 277.588 51.0805V53.1283C277.588 53.6938 277.112 54.1522 276.526 54.1522H275.464C274.878 54.1522 274.402 53.6938 274.402 53.1283V51.0805C274.402 50.5151 274.878 50.0566 275.464 50.0566Z"
              fill="black"
            />
            <path
              d="M280.015 48.2363H281.077C281.663 48.2363 282.138 48.6947 282.138 49.2602V53.1283C282.138 53.6937 281.663 54.1521 281.077 54.1521H280.015C279.428 54.1521 278.953 53.6937 278.953 53.1283V49.2602C278.953 48.6947 279.428 48.2363 280.015 48.2363Z"
              fill="black"
            />
            <path
              opacity="0.2"
              d="M284.565 45.5059H285.627C286.214 45.5059 286.689 45.9643 286.689 46.5298V53.1282C286.689 53.6936 286.214 54.152 285.627 54.152H284.565C283.979 54.152 283.504 53.6936 283.504 53.1282V46.5298C283.504 45.9643 283.979 45.5059 284.565 45.5059Z"
              fill="black"
            />
            <path
              opacity="0.2"
              d="M289.116 42.7754H290.178C290.764 42.7754 291.24 43.2338 291.24 43.7993V53.1281C291.24 53.6935 290.764 54.152 290.178 54.152H289.116C288.53 54.152 288.054 53.6935 288.054 53.1281V43.7993C288.054 43.2338 288.53 42.7754 289.116 42.7754Z"
              fill="black"
            />
            <path
              d="M302.75 50.3161C300.627 50.3161 299.121 48.8163 299.121 46.6805C299.121 44.5448 300.627 43.0449 302.75 43.0449H308.174C310.292 43.0449 311.803 44.5448 311.803 46.6805C311.803 48.8163 310.292 50.3161 308.174 50.3161H306.41C306.11 50.0042 306.086 49.3263 306.314 49.0743H308.108C309.506 49.0743 310.496 48.0904 310.496 46.6805C310.496 45.2767 309.506 44.2868 308.108 44.2868H302.816C301.419 44.2868 300.429 45.2767 300.429 46.6805C300.429 48.0904 301.419 49.0743 302.816 49.0743H303.134C303.062 49.4462 303.092 49.8962 303.146 50.3161H302.75ZM307.598 53.1838C305.474 53.1838 303.968 51.684 303.968 49.5482C303.968 47.4125 305.474 45.9126 307.598 45.9126H309.356C309.638 46.2246 309.662 46.8785 309.458 47.1545H307.664C306.266 47.1545 305.276 48.1384 305.276 49.5482C305.276 50.9521 306.266 51.942 307.664 51.942H312.955C314.353 51.942 315.343 50.9521 315.343 49.5482C315.343 48.1384 314.353 47.1545 312.955 47.1545H312.637C312.709 46.7765 312.685 46.3326 312.625 45.9126H313.021C315.145 45.9126 316.651 47.4125 316.651 49.5482C316.651 51.684 315.145 53.1838 313.021 53.1838H307.598Z"
              fill="black"
            />
            <g opacity="0.3">
              <path
                d="M325.976 43.4832C325.369 44.4014 325.369 45.6796 325.369 48.2361C325.369 50.7926 325.369 52.0708 325.976 52.989C326.238 53.3865 326.575 53.7278 326.968 53.9935C327.875 54.607 329.138 54.607 331.663 54.607H341.554C344.079 54.607 345.342 54.607 346.249 53.9935C346.642 53.7278 346.979 53.3865 347.242 52.989C347.848 52.0708 347.848 50.7926 347.848 48.2361C347.848 45.6796 347.848 44.4014 347.242 43.4832C346.979 43.0857 346.642 42.7444 346.249 42.4788C345.342 41.8652 344.079 41.8652 341.554 41.8652H331.663C329.138 41.8652 327.875 41.8652 326.968 42.4788C326.575 42.7444 326.238 43.0857 325.976 43.4832Z"
                fill="black"
              />
              <path
                d="M349.943 48.0086C349.943 48.8032 349.472 49.5205 348.747 49.8288V46.1883C349.472 46.4967 349.943 47.2139 349.943 48.0086Z"
                fill="black"
              />
            </g>
            <path
              d="M325.369 48.2361C325.369 45.6796 325.369 44.4014 325.983 43.4832C326.249 43.0857 326.59 42.7444 326.987 42.4788C327.906 41.8652 329.184 41.8652 331.74 41.8652H334.361V54.607H331.74C329.184 54.607 327.906 54.607 326.987 53.9935C326.59 53.7278 326.249 53.3865 325.983 52.989C325.369 52.0708 325.369 50.7926 325.369 48.2361Z"
              fill="#F7CE45"
            />
            <path
              d="M334.336 52.0217C333.805 52.0217 333.339 51.9337 332.938 51.7577C332.541 51.5785 332.226 51.3308 331.995 51.0147C331.763 50.6953 331.63 50.3254 331.594 49.905L331.589 49.8415H333.002L333.007 49.8952C333.029 50.0777 333.096 50.2407 333.207 50.3841C333.321 50.5242 333.474 50.635 333.666 50.7165C333.859 50.7947 334.082 50.8338 334.336 50.8338C334.587 50.8338 334.805 50.7914 334.991 50.7067C335.18 50.6187 335.325 50.4981 335.426 50.345C335.531 50.1918 335.583 50.0158 335.583 49.817V49.8072C335.583 49.4683 335.462 49.2092 335.221 49.03C334.983 48.8507 334.651 48.7611 334.224 48.7611H333.417V47.7101H334.204C334.452 47.7101 334.667 47.6694 334.849 47.5879C335.032 47.5064 335.174 47.394 335.275 47.2506C335.376 47.104 335.426 46.9361 335.426 46.7471V46.7373C335.426 46.5418 335.382 46.374 335.294 46.2338C335.21 46.0904 335.084 45.9813 334.918 45.9063C334.755 45.8281 334.558 45.789 334.326 45.789C334.095 45.789 333.891 45.8281 333.715 45.9063C333.539 45.9845 333.399 46.097 333.295 46.2436C333.191 46.387 333.129 46.5565 333.109 46.752L333.104 46.796H331.745L331.75 46.7373C331.786 46.3137 331.913 45.9471 332.132 45.6375C332.353 45.3246 332.65 45.0834 333.021 44.914C333.396 44.7413 333.831 44.6549 334.326 44.6549C334.832 44.6549 335.271 44.7347 335.646 44.8944C336.021 45.0509 336.309 45.2708 336.511 45.5544C336.717 45.8346 336.819 46.1638 336.819 46.5418V46.5516C336.819 46.8449 336.754 47.1023 336.624 47.3239C336.494 47.5455 336.318 47.728 336.096 47.8714C335.874 48.0148 335.625 48.1159 335.348 48.1745V48.2038C335.873 48.2527 336.293 48.4222 336.609 48.7122C336.925 49.0023 337.083 49.3868 337.083 49.8659V49.8757C337.083 50.3026 336.968 50.6774 336.736 51C336.508 51.3226 336.189 51.5736 335.778 51.7528C335.368 51.932 334.887 52.0217 334.336 52.0217ZM337.943 51.8652V50.8729L340.216 48.6291C340.549 48.3098 340.806 48.0474 340.989 47.8421C341.171 47.6335 341.298 47.4527 341.37 47.2995C341.442 47.1431 341.478 46.9818 341.478 46.8156V46.8009C341.478 46.5988 341.434 46.4212 341.346 46.2681C341.261 46.1149 341.137 45.9959 340.974 45.9112C340.811 45.8232 340.617 45.7792 340.392 45.7792C340.164 45.7792 339.962 45.8281 339.786 45.9259C339.61 46.0204 339.473 46.1524 339.376 46.3218C339.278 46.488 339.229 46.6836 339.229 46.9084V46.9329H337.865L337.86 46.9084C337.86 46.4587 337.969 46.0627 338.188 45.7206C338.409 45.3784 338.714 45.1111 339.102 44.9189C339.493 44.7266 339.946 44.6305 340.461 44.6305C340.946 44.6305 341.373 44.7168 341.742 44.8895C342.113 45.0623 342.403 45.3018 342.612 45.6081C342.824 45.9145 342.929 46.2713 342.929 46.6787V46.6933C342.929 46.9606 342.877 47.2229 342.773 47.4804C342.669 47.7346 342.493 48.0099 342.245 48.3065C341.997 48.6031 341.659 48.9501 341.228 49.3477L339.527 50.9364L339.923 50.2912V50.9364L339.527 50.6774H343.032V51.8652H337.943Z"
              fill="black"
            />
            <rect
              x="140.595"
              y="760.864"
              width="109.215"
              height="4.55063"
              rx="2.27531"
              fill="black"
            />
            <defs>
              <filter
                id="filter0_f_35_3607"
                x="231.419"
                y="43.8516"
                width="6.78461"
                height="3.8056"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="0.455063"
                  result="effect1_foregroundBlur_35_3607"
                />
              </filter>
              <filter
                id="filter1_f_35_3607"
                x="231.419"
                y="47.8233"
                width="6.78461"
                height="4.79877"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="0.455063"
                  result="effect1_foregroundBlur_35_3607"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}
