'use client'

import type { JSONFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'

import './submission-table.css'

/**
 * Read-only renderer for the inquiries `submission` JSON field.
 * Submission data is created via the public API only; the admin UI
 * never edits it, so this component never calls `setValue`.
 */
export const SubmissionTable: JSONFieldClientComponent = ({ path }) => {
  const { value } = useField<Record<string, unknown> | null>({ path })

  if (
    value == null ||
    typeof value !== 'object' ||
    Object.keys(value).length === 0
  ) {
    return <div className="submission-table__empty">No submission data</div>
  }

  return (
    <table className="submission-table">
      <thead>
        <tr>
          <th className="submission-table__key">Key</th>
          <th className="submission-table__value">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(value).map(([key, val]) => (
          <tr key={key}>
            <td className="submission-table__key">{key}</td>
            <td className="submission-table__value">
              {val !== null && typeof val === 'object'
                ? JSON.stringify(val)
                : String(val)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
