'use client'

import Icon from '@ant-design/icons'
import type { GetProps } from 'antd'

type CustomIconComponentProps = GetProps<typeof Icon>

const IconSvg = ({
  width = 20,
  height = 20,
  stroke = '#F9F9F9',
}: {
  width: number
  height: number
  stroke?: string | 'currentColor'
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 11.7931L15.5324 8.09022C15.6472 7.96993 15.8332 7.96993 15.948 8.09022L16.9869 9.17932M14.0779 9.61504L15.3246 10.922M12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 12.683 22.9378 13.3514 22.8186 14M22 18L17.4969 22.8617C17.326 23.0461 17.049 23.0461 16.8781 22.8617L15 20.834M13 14C13 15.6569 11.6569 17 10 17C8.34315 17 7 15.6569 7 14C7 12.3431 8.34315 11 10 11C11.6569 11 13 12.3431 13 14Z"
      stroke={stroke}
      strokeLinecap="round"
    />
  </svg>
)

const CustomIcon = ({
  width = 20,
  height = 20,
  stroke = '#F9F9F9',
  ...props
}: Partial<
  CustomIconComponentProps & {
    width: number
    height: number
    stroke?: string | 'currentColor'
  }
>) => (
  <Icon
    component={() => (
      <IconSvg width={Number(width)} height={Number(height)} stroke={stroke} />
    )}
    {...props}
  />
)

export { CustomIcon as KeyCheckIcon }
