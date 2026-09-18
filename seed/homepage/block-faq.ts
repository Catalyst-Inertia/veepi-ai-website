import type { BlockFaqBlock } from '../../src/payload-types'
import { richTextParagraph } from '../lib'

export const buildFaqBlock = (): BlockFaqBlock => {
  return {
    blockType: 'block-faq',
    identifier: 'block-faq',
    sectionId: 'faq',
    title: 'Questions, answered.',
    questions: [
      {
        question: 'What is VeePi?',
        answer: richTextParagraph(
          'VeePi is an AI-powered creative platform built specifically for medical and aesthetic professionals. It transforms existing practice content — including before & after photos, treatment imagery, videos, and results — into premium social media content.',
        ),
      },
      {
        question: 'What kind of content can I create with VeePi?',
        answer: richTextParagraph(
          'VeePi can create a range of social content including transformation videos, treatment and educational content, patient journeys, doctor branding, medical technology content, and more.',
        ),
      },
      {
        question: 'Do I need to create new content for VeePi?',
        answer: richTextParagraph(
          'No. VeePi is designed around the content you already have. You provide your source material, and VeePi turns it into a creative social concept.',
        ),
      },
      {
        question: 'Which medical specialties is VeePi built for?',
        answer: richTextParagraph(
          'VeePi is designed for medical and aesthetic professionals including plastic surgeons, cosmetic surgeons, dentists, cosmetic dentists, dermatologists, med spas, aesthetic clinics, facial rejuvenation specialists, and hair restoration specialists.',
        ),
      },
      {
        question: 'What formats can VeePi create?',
        answer: richTextParagraph(
          'Content can be adapted for multiple social formats, including 9:16, 1:1, and 16:9, for platforms and placements such as Reels, TikTok, Stories, YouTube, and social feeds.',
        ),
      },
      {
        question: 'Is VeePi just animating my photos?',
        answer: richTextParagraph(
          'No. VeePi is designed to provide the creative direction behind the content. Concepts can incorporate storytelling, hooks, camera movement, subject movement, transitions, visual effects, and cinematic direction.',
        ),
      },
      {
        question: 'Can I choose the type of creative I want?',
        answer: richTextParagraph(
          'Yes. VeePi includes a growing library of creative concepts that you can browse and use as a starting point for your own content.',
        ),
      },
      {
        question: 'How much does VeePi cost?',
        answer: richTextParagraph(
          'VeePi offers subscription options based on your content needs. Contact the VeePi team for a consultation and tailored pricing.',
        ),
      },
      {
        question: 'Can I see examples before getting started?',
        answer: richTextParagraph(
          'Yes. Explore the VeePi creative gallery to see examples of concepts, outputs, specialties, and formats.',
        ),
      },
    ],
  }
}
