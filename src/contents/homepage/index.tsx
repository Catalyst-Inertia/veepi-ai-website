import BlurTextAnimation from '@/components/common/blur-text-animation'
import ScrollTextAnimation from '@/components/common/scroll-text-animation'
import BoxContainer from '@/components/container/boxed'

export default function ContentsHomepage() {
  return (
    <div>
      <BoxContainer
        sectionClassName="mt-[113px] bg-white-color"
        containerClassName="py-[60px] text-black-color"
      >
        Homepage
        <BlurTextAnimation text="Split Text Animation" />
      </BoxContainer>
      <BoxContainer sectionClassName="bg-gray-200 py-[60px]">
        <ScrollTextAnimation />
      </BoxContainer>
    </div>
  )
}
