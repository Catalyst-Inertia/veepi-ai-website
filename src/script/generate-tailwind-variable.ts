import 'dotenv/config'
import fs from 'fs'
import path from 'path'

// Define the output file path for Sass variables
const outputPath = path.join(
  process.cwd(),
  'src',
  'styles',
  'tailwind-variable.scss',
)
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath)
}

// Read environment variables
const sassVariables = `
@import 'tailwindcss';
@theme {
--color-primary-color: ${process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#F36E69'};
--color-second-color: ${process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#8C2425'};
--color-accent-color-1: ${process.env.NEXT_PUBLIC_ACCENT_COLOR_1 || '#E9262C'};
--color-accent-color-2: ${process.env.NEXT_PUBLIC_ACCENT_COLOR_2 || '#F8AFA8'};
--color-black-color: ${process.env.NEXT_PUBLIC_BLACK_COLOR || '#09080D'};
--color-white-color: ${process.env.NEXT_PUBLIC_WHITE_COLOR || '#FFF'};

--font-text: ${'var(--font_text)'};
--font-title: ${'var(--font_title)'};
}
`

// Write the Sass variables to the file
fs.writeFileSync(outputPath, sassVariables, 'utf8')
