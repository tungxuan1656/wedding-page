import type { Metadata } from 'next'

import { CountdownSection } from '@/components/countdown/countdown-section'
import { EventDetailsSection } from '@/components/event/event-details-section'
import { GiftRegistrySection } from '@/components/event/gift-registry-section'
import { MapSection } from '@/components/event/map-section'
import { FamilySection } from '@/components/family/family-section'
import { PhotoGallerySection } from '@/components/gallery/mini-gallery-section'
import { HeroSection } from '@/components/hero'
import { RsvpSection } from '@/components/rsvp/rsvp-section'
import { FloatingCta, Footer } from '@/components/shared'
import { getGuestById } from '@/lib/guests'
import { strings } from '@/lib/i18n'

const { meta, hero } = strings

type HomePageProps = {
  searchParams?: Promise<{
    g?: string | string[]
  }>
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tx-va-wedding.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
  const title = `${hero.coupleNames} — Thiệp cưới`
  const description = hero.intro

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
          alt: `${meta.home.ogImageAlt}`,
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
  const slug =
    typeof resolvedSearchParams?.g === 'string'
      ? resolvedSearchParams.g.trim().toLowerCase()
      : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    eventType: 'WeddingEvent',
    name: `Đám cưới ${hero.coupleNames}`,
    description: hero.intro,
    startDate: '2026-06-08',
    endDate: '2026-06-09',
    location: {
      '@type': 'Place',
      name: hero.venue.name,
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
      <PhotoGallerySection />
      <MapSection />
      <GiftRegistrySection />
      <RsvpSection guestName={guest?.name} slug={slug} />
      <Footer />
      <FloatingCta />
    </main>
  )
}
