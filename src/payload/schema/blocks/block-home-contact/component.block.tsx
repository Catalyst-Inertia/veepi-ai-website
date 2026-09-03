'use client'

import MainButton from '@/components/common/button'
import RedDot from '@/components/common/red-dot'
import BoxContainer from '@/components/container/boxed'
import MediaVisual from '@/components/common/media'
import s from './index.module.scss'
import { Col, Form, Input, Row } from 'antd'
import { MagicWandIcon } from '@/components/icons/magic-wand'
import { PhoneIcon } from '@/components/icons/phone'
import SectionHeader from '@/components/common/section-header'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media } from '@/payload-types'
import { IDENTIFIER } from './schema.block'
import type { Block } from '@/types/blocks'

export type BlockHomeContactProps = { id?: string } & Extract<
  Block,
  { blockType: typeof IDENTIFIER }
>

const mediaUrl = (
  img: string | Media | null | undefined,
): { src: string | null; alt: string } =>
  typeof img === 'string'
    ? { src: img || null, alt: '' }
    : { src: img?.url || null, alt: img?.alt ?? '' }

export default function ContentsBlockHomeContact({
  id,
  title,
  description,
  image,
  whatsappNumber,
  submitLabel,
}: BlockHomeContactProps) {
  const [form] = Form.useForm()
  const { src, alt } = mediaUrl(image)
  const handleSubmit = async () => {
    const value = await form.validateFields()
    const waLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Hi%2C%20here%20my%20details%3A%0A%0AFirst%20Name%3A%20${value.first_name}%2C%0ALast%20Name%3A%20${value.last_name}%2C%0AEmail%3A%20${value.email}%2C%0APhone%20Number%3A%20${value.phone_number}%2C%0ACompany%3A%20${value.company_name}%2C%0A%0Amessage%3A%20${value.message}`
    window.open(waLink, '_blank', 'noopener,noreferrer')
  }
  return (
    <BoxContainer
      sectionClassName="py-8 lg:py-20 relative"
      sectionId={id ?? 'contact'}
    >
      <div className="flex flex-col lg:flex-row gap-[32px]">
        <div className="text-left w-full lg:w-1/2 flex flex-col gap-10">
          <SectionHeader label={title} />
          {description ? <RichText data={description} /> : null}
          {src ? (
            <div className="size-[628px] hidden lg:block relative bottom-0">
              <MediaVisual
                media={image}
                alt={alt}
                sizes="628px"
                objectFit="cover"
              />
            </div>
          ) : null}
        </div>
        <div className={`w-full lg:w-1/2 ${s.card} z-10`}>
          <Form
            layout="vertical"
            className="global-form"
            onFinish={handleSubmit}
            form={form}
          >
            <div className="flex flex-col gap-0 lg:gap-3">
              <Row gutter={[24, 0]}>
                <Col span={24} md={{ span: 12 }}>
                  <Form.Item name={'first_name'} label="First Name">
                    <Input placeholder="John" />
                  </Form.Item>
                </Col>
                <Col span={24} md={{ span: 12 }}>
                  <Form.Item name={'last_name'} label="Last Name">
                    <Input placeholder="Doe" />
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item name={'email'} label="Email">
                  <Input placeholder="johndoe@email.com" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={'company_name'} label="Company Name">
                  <Input placeholder="Your incredible company name!" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={'phone_number'} label="Phone Number">
                  <Input
                    addonBefore={<PhoneIcon />}
                    placeholder="+628123456789"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name={'message'} label="Message">
                  <Input.TextArea placeholder="Tell us your thought..." />
                </Form.Item>
              </Col>
            </div>
          </Form>
          <div className="pt-6">
            <MainButton
              className="!w-full"
              onClick={() => {
                handleSubmit()
              }}
            >
              {submitLabel}
              <span className="ml-4">
                <MagicWandIcon />
              </span>
            </MainButton>
          </div>
        </div>
      </div>
      <RedDot containerClass="absolute bottom-[15%] left-[-20%] lg:bottom-[-70%] lg:left-[-50%] z-[7]" />
    </BoxContainer>
  )
}
