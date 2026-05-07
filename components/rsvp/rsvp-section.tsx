import { RsvpForm } from '@/components/rsvp/rsvp-form'
import { SectionWrapper } from '@/components/shared'

type RsvpSectionProps = {
  slug?: string
  guestName?: string
}

export const RsvpSection = ({ slug, guestName }: RsvpSectionProps) => {
  return (
    <div className='bg-cream'>
      <SectionWrapper
        aria-labelledby='rsvp-heading'
        className='px-6 py-12 sm:px-8 md:px-12 md:py-24'
        id='rsvp'>
        <div className='mx-auto max-w-lg overflow-hidden rounded-3xl border border-beige/60 bg-white shadow-2xl shadow-wine/5 md:rounded-[2.5rem]'>
          <div className='bg-linear-to-b from-beige/20 to-transparent p-6 md:p-8'>
            <div className='mb-5 text-center'>
              <h2
                className='font-serif text-3xl font-medium tracking-tight text-wine'
                id='rsvp-heading'>
                Xác nhận tham dự
              </h2>
              <div className='mx-auto mt-3 h-0.5 w-12 bg-gold/40' />
              <p className='mt-4 text-sm leading-relaxed text-text-muted'>
                Vui lòng điền thông tin để chúng mình chuẩn bị đón tiếp bạn một
                cách chu đáo nhất.
              </p>
            </div>
            <RsvpForm guestName={guestName} slug={slug} />
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}
