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
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
