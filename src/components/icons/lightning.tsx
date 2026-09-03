'use client'

import Icon from '@ant-design/icons'
import type { GetProps } from 'antd'

type CustomIconComponentProps = GetProps<typeof Icon>

const IconSvg = ({
  width = 24,
  height = 24,
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
      d="M6.58825 14.8235L12.8107 2.37867C12.8579 2.28429 13.0001 2.31787 13.0001 2.42339V9.26127C13.0001 9.615 13.3574 9.85688 13.6858 9.72551L16.7791 8.4882C17.206 8.31745 17.6176 8.76483 17.412 9.17605L11.1896 21.6209C11.1424 21.7153 11.0001 21.6817 11.0001 21.5762V14.7383C11.0001 14.3846 10.6429 14.1427 10.3144 14.2741L7.22116 15.5114C6.79428 15.6821 6.38264 15.2347 6.58825 14.8235Z"
      stroke={stroke}
      strokeLinecap="round"
    />
  </svg>
)

const CustomIcon = ({
  width = 24,
  height = 24,
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

export { CustomIcon as LightningIcon }
