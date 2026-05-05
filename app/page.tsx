import type { Metadata } from 'next'

import { CountdownSection } from '@/components/countdown/countdown-section'
import { EventDetailsSection } from '@/components/event/event-details-section'
import { FamilySection } from '@/components/family/family-section'
import { MiniGallerySection } from '@/components/gallery/mini-gallery-section'
import { HeroSection } from '@/components/hero'
import { HERO_COPY } from '@/components/hero/hero-copy'
import { RsvpSection } from '@/components/rsvp/rsvp-section'
import { getGuestById } from '@/lib/guests'

type HomePageProps = {
  searchParams?: Promise<{
    g?: string | string[]
  }>
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tx-va-wedding.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
  const title = `${HERO_COPY.coupleNames} — Thiệp cưới`
  const description = HERO_COPY.intro

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: `Thiệp cưới ${HERO_COPY.coupleNames}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-image.png'],
    },
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const guest = getGuestById(resolvedSearchParams?.g)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    eventType: 'WeddingEvent',
    name: `Đám cưới ${HERO_COPY.coupleNames}`,
    description: HERO_COPY.intro,
    startDate: '2026-06-08',
    endDate: '2026-06-09',
    location: {
      '@type': 'Place',
      name: HERO_COPY.venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Đông Anh, Hà Nội',
        addressCountry: 'VN',
      },
    },
  }

  return (
    <main id='main-content'>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
        type='application/ld+json'
      />
      <HeroSection guest={guest} />
      <CountdownSection />
      <FamilySection />
      <EventDetailsSection />
      <MiniGallerySection />
      <RsvpSection />
    </main>
  )
}
