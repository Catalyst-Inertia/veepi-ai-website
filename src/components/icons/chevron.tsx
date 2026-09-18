import React from 'react'

type Props = React.SVGAttributes<SVGElement>
export default function ChevronRight(props: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 6L15.2929 11.2929C15.6834 11.6834 15.6834 12.3166 15.2929 12.7071L10 18"
        stroke="#F9F9F9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
