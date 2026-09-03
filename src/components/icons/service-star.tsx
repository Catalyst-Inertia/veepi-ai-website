'use client'

import React from 'react'
import Icon from '@ant-design/icons'
import type { GetProps } from 'antd'

type CustomIconComponentProps = GetProps<typeof Icon>

const IconSvg = () => (
  <>
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 0L17.1926 9.70664L25.6066 4.3934L20.2934 12.8074L30 15L20.2934 17.1926L25.6066 25.6066L17.1926 20.2934L15 30L12.8074 20.2934L4.3934 25.6066L9.70664 17.1926L0 15L9.70664 12.8074L4.3934 4.3934L12.8074 9.70664L15 0Z"
        fill="#F9F9F9"
      />
    </svg>
  </>
)

const CustomIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={IconSvg} {...props} />
)

export { CustomIcon as ServiceStarIcon }
