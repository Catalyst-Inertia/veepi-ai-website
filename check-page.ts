import payload from 'payload'
import config from './payload.config'

async function main() {
  await payload.init({ config })
  process.exit(0)
}
main()
