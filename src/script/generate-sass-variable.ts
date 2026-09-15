import 'dotenv/config'
import fs from 'fs'
import path from 'path'

// Define the output file path for Sass variables
const outputPath = path.join(process.cwd(), 'src', 'styles', 'theme.scss')
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath)
}

// Read environment variables
const sassVariables = `
:root {
--primary_color: ${process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#E5859E'};
--second_color: ${process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#A66395'};
--accent_color_1: ${process.env.NEXT_PUBLIC_ACCENT_COLOR_1 || '#DA8B9D'};
--accent_color_2: ${process.env.NEXT_PUBLIC_ACCENT_COLOR_2 || '#F6EFE9'};
--accent_color_3: ${process.env.NEXT_PUBLIC_ACCENT_COLOR_3 || '#FFFFFF'};
--black_color: ${process.env.NEXT_PUBLIC_BLACK_COLOR || '#171515'};
--white_color: ${process.env.NEXT_PUBLIC_WHITE_COLOR || '#F6EFE9'};
--font_text: "sofia-pro", sans-serif;
--font_title: "freightdispcmp-pro", serif;
}
`

// Write the Sass variables to the file
fs.writeFileSync(outputPath, sassVariables, 'utf8')
