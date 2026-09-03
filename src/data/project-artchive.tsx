export const projectArtchiveMastheadData: {
  minicaps: string[]
  title: string
  image: {
    url: string
    alt: string
  }
} = {
  minicaps: ['ARTCHIVE ID'],
  title:
    'Crafting a Portal to Artistic Wonders with the Magical Creation of Artchive.id’s Mobile and Web Experience',
  image: {
    url: '/assets/images/(projects)/project-artchive-masthead.webp',
    alt: 'project-artchive-id-masthead',
  },
}

export const projectArtchiveDetailData: {
  expertises: string[]
  description: string
  ctaLabel: string
  ctaURL: string
} = {
  expertises: [
    'UI/UX Design',
    'Website Development',
    'Content Management',
    'Website Maintenance',
  ],
  description:
    'At Artchive.id, we conjured a digital realm where creativity and connection flourish. With enchanting designs and seamless functionality, we wove together a mystical platform that bridges artists, galleries, and collectors. Through an immersive web and mobile experience, users embark on a journey to explore, showcase, and uncover the boundless wonders of the art world. This platform serves as a gateway to artistic discovery, where every interaction feels like part of an enchanting tale, connecting people to the magic of creativity in ways never imagined.',
  ctaLabel: 'Discover the Wonder',
  ctaURL: 'https://artchive.id',
}

export const projectArtchiveCTAData: {
  heading: string
  paragraph: string
  buttonLabel: string
  mascot: {
    url: string
    alt: string
  }
} = {
  heading:
    'We create digital magic, captivate audiences, and transform ideas into realities.',
  paragraph:
    'Our passionate team crafts enchanting digital experiences that bridge creativity and technology. Through strategy, design, innovation, and storytelling, we bring bold ideas to life, captivating users and delivering results. From concept to execution, we shape solutions that inspire and empower.',
  buttonLabel: 'Feel Our Spirit',
  mascot: {
    url: '/assets/images/case-study-mascot.webp',
    alt: 'Case study mascot – a 3D-rendered cartoon monster with fluffy red fur',
  },
}

type GalleryLayout = 'normal' | 'hightlight'
type ProjectOverviewContent = {
  title: string
  heading: string
  descriptions: string[]
  galery: {
    layout: GalleryLayout
    images: string[]
  }
}
type ProjectOverview = {
  displayImage: string
  content: ProjectOverviewContent[]
}
export const projectArtchiveProjectShowcaseData: ProjectOverview = {
  displayImage: '/assets/images/(projects)/display.webp',
  content: [
    {
      title: 'A Visionary Website Experience',
      heading: 'Harnessing the Magic of Artistic Connections',
      descriptions: [
        'Seamlessly blending technology with creativity, the Artchive.id website was crafted to deliver an intuitive, immersive, and magical experience. Every interaction, transition, and detail was designed with precision to inspire awe and wonder. From fluid animations to dynamic layouts, the platform guides users through a seamless journey of art discovery, making every moment feel extraordinary.',
        'With glowing visuals, smooth navigation, and enchanting design elements, the website fosters a deep connection to the artistic world, as if stepping into a boundless realm of creativity. Whether exploring curated collections, engaging with artists, or showcasing masterpieces, every feature works in harmony to captivate and leave a lasting impression. Every pixel tells a story, every animation weaves magic, inviting users to dive into an ever-evolving artful ecosystem.',
      ],
      galery: {
        layout: 'normal',
        images: [
          '/assets/images/(projects)/artchive1.webp',
          '/assets/images/(projects)/artchive3.webp',
          '/assets/images/(projects)/artchive4.webp',
          '/assets/images/(projects)/artchive2.webp',
        ],
      },
    },
    {
      title: 'The Mobile Apps Experience',
      heading: 'Bringing Creativity to Your Fingertips',
      descriptions: [
        'The Artchive.id mobile app transforms the way users interact with the art world, delivering a seamless and magical experience directly to their hands. Designed for both functionality and inspiration, the app empowers users to explore art, connect with artists, and manage collections effortlessly, all while maintaining the enchanting essence of the platform.',
        'Every tap, swipe, and scroll was meticulously crafted to evoke a sense of wonder, with fluid animations and an intuitive interface that makes navigation a delight. From browsing curated galleries to accessing exclusive content, the mobile app acts as a portal to artistic discovery, allowing users to engage with creativity anytime, anywhere. It’s not just an app—it’s a gateway to boundless inspiration, designed to captivate and elevate every moment of the journey.',
      ],
      galery: {
        layout: 'hightlight',
        images: [
          '/assets/images/(projects)/artchive-phone5.webp',
          '/assets/images/(projects)/artchive-phone1.webp',
          '/assets/images/(projects)/artchive-phone2.webp',
          '/assets/images/(projects)/artchive-phone3.webp',
          '/assets/images/(projects)/artchive-phone4.webp',
        ],
      },
    },
  ],
}
