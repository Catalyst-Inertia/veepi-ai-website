export const CONTACT_CONTENT_TYPE_OPTIONS = [
  { value: 'before-and-after', label: 'Before & After' },
  { value: 'educational', label: 'Educational' },
  { value: 'patient-journeys', label: 'Patient Journeys' },
  { value: 'doctor-branding', label: 'Doctor Branding' },
  { value: 'social-content', label: 'Social Content' },
  { value: 'others', label: 'Others' },
] as const

export type ContactContentType =
  (typeof CONTACT_CONTENT_TYPE_OPTIONS)[number]['value']

export const ALLOWED_CONTENT_TYPES: Record<string, true> = Object.fromEntries(
  CONTACT_CONTENT_TYPE_OPTIONS.map((o) => [o.value, true]),
)
