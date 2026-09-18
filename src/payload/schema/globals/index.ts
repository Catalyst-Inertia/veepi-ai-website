import type { GlobalConfig } from 'payload'

import { header } from './header.global'
import { footer } from './footer.global'
import { config } from './config.global'

export const globals: GlobalConfig[] = [header, footer, config]
