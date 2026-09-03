/* eslint-disable no-console */
const DIR = [
  'public/assets/images',
  'public/assets/images/(projects)',
  'public/assets/icons',
]

import { execSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

main()

function main() {
  DIR.forEach((dir) => {
    if (!existsSync(dir)) {
      console.log(`${dir} not found`)
      return
    }

    const files = readdirSync(dir)

    files.forEach((file) => {
      if (!['.png', '.jpg', '.jpeg'].some((f) => file.endsWith(f))) {
        console.log(`Skipping ${file}`)
        return
      }

      const filePath = join(dir, file)
      const fileStat = statSync(filePath)
      const fileName = file.slice(0, file.lastIndexOf('.'))

      if (fileStat.isFile()) {
        const outPath = join(dir, `${fileName}.webp`)
        console.log(`Creating: ${outPath}`)
        const isPng = file.endsWith('.png')
        const codecArgs = isPng
          ? '-c:v libwebp -lossless 1'
          : '-c:v libwebp -quality 90'

        execSync(
          `ffmpeg -i "${filePath}" -loglevel error -hide_banner -vf "scale='min(1920,iw)':-2" ${codecArgs} -y "${outPath}"`,
        )
      }
    })
  })
}
