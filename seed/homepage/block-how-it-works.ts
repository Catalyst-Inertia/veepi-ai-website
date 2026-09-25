import type { BlockHowItWorksBlock } from '../../src/payload-types'
import { richTextParagraph } from '../lib'

export const buildHowItWorksBlock = (): BlockHowItWorksBlock => {
  return {
    blockType: 'block-how-it-works',
    identifier: 'block-how-it-works',
    sectionId: 'how-it-works',
    title: 'Your results in.\nYour next piece of content out.',
    description: richTextParagraph(
      'VeePi handles the creative process between your source material and your finished social content.',
    ),
    steps: [
      {
        title: 'Upload your results',
        description:
          'Start with what you already have. Upload before & after photos, treatment imagery, videos, or other source material from your practice.',
      },
      {
        title: 'Choose a creative direction',
        description:
          "Start with an idea, not a blank canvas. Browse VeePi's creative concepts and choose a direction that fits your specialty, result, or story.",
      },
      {
        title: 'VeePi builds the story',
        description:
          'This is where your raw material becomes something people want to watch. VeePi transforms your source material into a cinematic social concept with movement, storytelling, visual direction, and a strong opening hook.',
      },
      {
        title: 'Review the result',
        description:
          'See the creative before it goes live. Review your generated video and make sure the final result feels right for your practice and your audience.',
      },
      {
        title: 'Adapt the format',
        description:
          'One creative. Multiple ways to share it. Turn your content into the formats your audience already watches.',
      },
      {
        title: 'Publish',
        description:
          'Your content is ready for the platforms that matter. Take your finished creative and put your latest results, expertise, and stories in front of your audience.',
      },
    ],
  }
}
