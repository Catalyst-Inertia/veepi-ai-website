// Single source of truth for the CMS/frontend origin. Both `payload.config.ts`
// (server bundle) and the live-preview refresh route (client bundle) import this
// constant so `RefreshRouteOnSave` validates event origins against the exact
// origin Payload itself is served from. Keep this module dependency-free: it
// must be importable from plain Node, the Payload config, and the client.
//
// NOTE: `process.env.NEXT_PUBLIC_SERVER_URL` is inlined at build time by Next.js
// for client bundles; the node build reads it at runtime. Strip any trailing
// slashes so the origin is always normalized to a bare `scheme://host[:port]`.
export const SERVER_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
).replace(/\/+$/, '')
