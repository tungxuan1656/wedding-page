import { strings } from '@/lib/i18n'

export const Footer = () => {
  const { footer: s, hero } = strings

  return (
    <footer className='bg-wine px-6 py-16 text-center text-cream sm:px-8 md:py-24'>
      <div className='mx-auto max-w-2xl space-y-8'>
        <div className='mx-auto h-px w-24 bg-gold/40' />

        <p className='font-script text-4xl sm:text-5xl'>
          {hero.groomName}
          <span className='mx-2 inline-block scale-75 align-middle text-gold-light opacity-80'>
            &
          </span>
          {hero.brideName}
        </p>

        <p className='text-base leading-relaxed text-cream/75'>{s.thankYou}</p>

        <div className='mx-auto h-px w-24 bg-gold/40' />

        <p className='text-xs tracking-[0.25em] text-cream/40 uppercase'>
          {s.weddingDate}
        </p>
      </div>
    </footer>
  )
}
