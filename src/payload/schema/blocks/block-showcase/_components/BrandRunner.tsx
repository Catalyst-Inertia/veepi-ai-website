'use client'

import Image from 'next/image'

const BRANDS = [
  'aura',
  'bellavida',
  'curated',
  'enhance',
  'ford',
  'inland',
  'jwelers',
  'khoobehi',
  'ro',
  'sagedny',
  'silfa',
  'skin',
] as const

export default function BrandRunner() {
  const BRAND_SET = (
    <div className="flex shrink-0 animate-marquee items-center gap-[40px] pr-[40px]">
      {BRANDS.map((brand, i) => (
        <Image
          key={i}
          src={`/assets/brand/${brand}.png`}
          alt={brand}
          aria-hidden={true}
          width={90}
          height={40}
          className="h-[40px] w-[89.6px] flex-none object-contain"
        />
      ))}
    </div>
  )

  return (
    <div className="relative flex h-[120px] w-full items-center overflow-hidden">
      <div className="flex w-max items-center">
        {BRAND_SET}
        {BRAND_SET}
        {BRAND_SET}
        {BRAND_SET}
      </div>
      {/* Gradient fade overlay matching Figma #101010 edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,#101010_0%,transparent_30%,transparent_70%,#101010_100%)]"
      />
    </div>
  )
}
