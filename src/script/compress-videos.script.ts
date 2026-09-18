/* eslint-disable no-console */
import { existsSync, readdirSync, statSync } from 'fs'
import { spawn } from 'node:child_process'
import { join } from 'node:path'

const DIR = ['public/videos']

main()

function main() {
  DIR.forEach((dir) => {
    if (!existsSync(dir)) {
      console.log(`${dir} not found`)
      return
    }

    const files = readdirSync(dir)

    files.forEach((file) => {
      if (!['.mp4', '.ogg'].some((f) => file.endsWith(f))) return

      const filePath = join(dir, file)
      const fileStat = statSync(filePath)
      const fileName = file.split('.')[0]

      if (fileStat.isFile()) {
        const outPath = join(dir, `${fileName}.webm`)
        console.log(`Creating: ${outPath}`)

        const sp = spawn('ffmpeg', [
          '-i',
          filePath,
          '-vf',
          "scale='min(1920,iw)':-2,fps=24",
          '-c:v',
          'libvpx-vp9',
          '-crf',
          '30',
          '-b:v',
          '0',
          '-g',
          '1',
          '-y',
          outPath,
        ])

        sp.on('error', (e) => console.log(e))
        sp.on('close', (code) => console.log(code))
      }
    })
  })
}
