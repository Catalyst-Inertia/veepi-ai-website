# VeePi Design System

This document outlines the core design tokens and setup for the VeePi project, extracted from the design assets.

## Typography

The project uses two primary fonts. They are configured via CSS custom properties in Next.js (\`--font_title\` and \`--font_text\`).

- **Display / Titles**: `FreightDispCmp Pro`
  - Used for: \`h1\`, \`h2\`, \`h3\` (and any elements utilizing the Tailwind \`font-title\` utility).
- **Body / Normal Text**: `Sofia Pro`
  - Used for: \`p\`, \`span\`, and general UI text (Tailwind \`font-text\` utility).

> **Note**: Local font files (.woff2) for Sofia Pro and FreightDispCmp Pro must be placed in \`src/fonts/\`. See \`src/app/(frontend)/layout.tsx\` for the commented-out \`localFont\` setup.

## Colors

The following core palette is mapped into \`.env.example\` and synchronized to Sass and Tailwind variables.

| Role          | Variable           | Hex       | Notes                                                  |
| :------------ | :----------------- | :-------- | :----------------------------------------------------- |
| **Primary**   | `--primary_color`  | `#f0876b` | Core brand coral/orange used in gradients and accents. |
| **Secondary** | `--second_color`   | `#c05ec4` | Deep purple used alongside primary.                    |
| **Accent 1**  | `--accent_color_1` | `#8a38f5` | Bright purple accent.                                  |
| **Accent 2**  | `--accent_color_2` | `#fbf2e9` | Light cream (Light theme background).                  |
| **Accent 3**  | `--accent_color_3` | `#ffffff` | Pure white.                                            |
| **Black**     | `--black_color`    | `#372b34` | Dark charcoal (Dark theme background and dark text).   |
| **White**     | `--white_color`    | `#fbf2e9` | Default light color mapping.                           |

## Variables Setup

To apply new color overrides locally:

1. Update your \`.env\` file using \`.env.example\` as a template.
2. Run the generator scripts to sync the variables:
   \`\`\`bash
   bun run src/script/generate-sass-variable.ts
   bun run src/script/generate-tailwind-variable.ts
   \`\`\`

This ensures variables are injected accurately into both the SCSS architecture (\`theme.scss\`) and the Tailwind configuration (\`tailwind-variable.scss\`).
