/* eslint-disable no-console */
const DIR = 'public/assets/videos'

// Filename (no extension) -> background color to chroma-key out.
// Keyed videos encode VP9 with alpha (yuva420p) so they composite on any bg.
// Tuned on mascot.mp4: similarity too high eats light body parts (ghosting),
// too low leaves a white fringe — 0.12/0.2 is the best tradeoff.
const CHROMA_KEY: Record<string, string> = {
  mascot: '0xF7F8F8',
}

import { execSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

main()

function main() {
  if (!existsSync(DIR)) {
    console.log(`${DIR} not found`)
    return
  }

  const files = readdirSync(DIR)

  files.forEach((file) => {
    if (!file.endsWith('.mp4')) {
      console.log(`Skipping ${file}`)
      return
    }

    const filePath = join(DIR, file)
    const fileStat = statSync(filePath)

    if (fileStat.isFile()) {
      const fileName = file.slice(0, file.lastIndexOf('.'))
      const outPath = join(DIR, `${fileName}.webm`)
      const keyColor = CHROMA_KEY[fileName]
      console.log(`Creating: ${outPath}`)
      const filter = keyColor
        ? `colorkey=${keyColor}:0.12:0.2,scale='min(1920,iw)':-2,format=yuva420p`
        : `scale='min(1920,iw)':-2`
      const alphaArgs = keyColor
        ? '-pix_fmt yuva420p -auto-alt-ref 0 -lag-in-frames 0'
        : ''
      execSync(
        `ffmpeg -i "${filePath}" -loglevel error -hide_banner ` +
          `-vf "${filter}" ${alphaArgs} ` +
          `-c:v libvpx-vp9 -crf 40 -b:v 0 -deadline good -cpu-used 3 -row-mt 1 ` +
          `-c:a libopus -b:a 96k -y "${outPath}"`,
      )
    }
  })
}
