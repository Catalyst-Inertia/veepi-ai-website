/* eslint-disable no-console */
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const BLOCKS_DIR = 'src/payload/schema/blocks'

main()

function main() {
  if (!existsSync(BLOCKS_DIR)) {
    console.log(`${BLOCKS_DIR} not found`)
    return
  }

  const blockDirs = readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(BLOCKS_DIR, entry.name))

  blockDirs.forEach((dir) => {
    const files = readdirSync(dir)

    files.forEach((file) => {
      const isThumbnail = file.startsWith('thumbnail.')
      const isSupported = ['.png', '.jpg', '.jpeg'].some((ext) =>
        file.endsWith(ext),
      )
      if (!isThumbnail || !isSupported) {
        return
      }

      const filePath = join(dir, file)
      const fileStat = statSync(filePath)

      if (fileStat.isFile()) {
        const fileName = file.slice(0, file.lastIndexOf('.'))
        const outPath = join(dir, `${fileName}.webp`)
        console.log(`Creating: ${outPath}`)
        const isPng = file.endsWith('.png')
        const codecArgs = isPng
          ? '-c:v libwebp -lossless 1'
          : '-c:v libwebp -quality 90'

        execSync(
          `ffmpeg -i "${filePath}" -loglevel error -hide_banner -vf "scale='min(1920,iw)':-2" ${codecArgs} -y "${outPath}"`,
        )

        console.log(`Removing: ${filePath}`)
        unlinkSync(filePath)
      }
    })
  })
}
