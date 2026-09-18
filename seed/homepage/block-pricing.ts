import type { BlockPricingBlock } from '../../src/payload-types'
import { richTextParagraph } from '../lib'

export const buildPricingBlock = (
  partnerLogosId: string | undefined,
): BlockPricingBlock => {
  return {
    identifier: 'block-pricing',
    blockType: 'block-pricing',
    sectionId: 'pricing',
    title: 'Create more.\nStay visible.',
    tagLabel: 'SUBSCRIPTION',
    tagline: richTextParagraph('Choose the plan that fits your practice.'),
    description: richTextParagraph(
      "Whether you're building your personal brand, promoting multiple treatments, or creating content at scale, VeePi gives your team access to an evolving library of creative possibilities.",
    ),
    logos: partnerLogosId
      ? [
          { logo: partnerLogosId },
          { logo: partnerLogosId },
          { logo: partnerLogosId },
        ]
      : [],
    plans: [
      {
        planName: 'Essential',
        tagline: richTextParagraph(
          'For practices getting started with AI-powered content.',
        ),
        description: richTextParagraph(
          'A focused way to turn your existing results into polished social content.',
        ),
        includesLabel: 'Includes',
        includes: [
          { item: 'Access to VeePi creative concepts' },
          { item: 'AI-generated social video content' },
          { item: 'Multiple social formats' },
          { item: 'Creative direction built for medical content' },
          { item: 'Content creation workflow' },
          { item: 'Concept discovery' },
        ],
        cta: {
          label: 'CONTACT VEEPI',
          variant: 'primary',
        },
      },
      {
        planName: 'Professional',
        tagline: richTextParagraph(
          'For practices ready to create consistently.',
        ),
        description: richTextParagraph(
          'A more flexible content engine for practices with an active social presence.',
        ),
        includesLabel: 'Includes',
        includes: [
          { item: 'Everything in Essential' },
          { item: 'Expanded creative possibilities' },
          { item: 'Multiple content formats' },
          { item: 'Broader specialty and content categories' },
          { item: 'Ongoing access to new creative concepts' },
          { item: 'Built for consistent social content production' },
        ],
        cta: {
          label: 'CONTACT VEEPI',
          variant: 'primary',
        },
      },
      {
        planName: 'Custom',
        tagline: richTextParagraph(
          'For practices and teams creating at scale.',
        ),
        description: richTextParagraph(
          'A tailored VeePi setup built around your content needs and workflow.',
        ),
        includesLabel: 'Includes',
        includes: [
          { item: 'Everything in Professional' },
          { item: 'Custom content requirements' },
          { item: 'Scalable creative production' },
          { item: 'Tailored consultation' },
          { item: 'Practice-specific content strategy' },
        ],
        cta: {
          label: 'CONTACT VEEPI',
          variant: 'primary',
        },
      },
    ],
  }
}
