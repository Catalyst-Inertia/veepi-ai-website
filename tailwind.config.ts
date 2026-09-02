import type { Config } from 'tailwindcss'

const withCustomProperties = (variable: string) => `var(${variable})`

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contents/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: withCustomProperties('--primary_color'),
        secondary: withCustomProperties('--second_color'),
        accent_color_1: withCustomProperties('--accent_color_1'),
        accent_color_2: withCustomProperties('--accent_color_2'),
        accent_color_3: withCustomProperties('--accent_color_3'),
        black: withCustomProperties('--black_color'),
        white: withCustomProperties('--white_color'),
      },
      fontFamily: {
        text: ['var(--font_text)'],
        title: ['var(--font_title)'],
      },
    },
  },
  plugins: [],
}
export default config
