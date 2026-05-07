import './globals.css'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro, Great_Vibes, Noto_Serif } from 'next/font/google'

import { AudioPlayer } from '@/components/shared'
import { strings } from '@/lib/i18n'

const { meta, shared } = strings

const sans = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

const notoSerif = Noto_Serif({
  weight: ['400', '700'],
  variable: '--font-noto-serif',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

const greatVibes = Great_Vibes({
  weight: '400',
  variable: '--font-great-vibes',
  subsets: ['latin'],
  display: 'swap',
})

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tx-va-wedding.vercel.app'

export const viewport: Viewport = {
  themeColor: '#8b1a2b',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: meta.home.title,
  description: meta.home.description,
  keywords: meta.home.keywords,
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: meta.home.title,
    description: meta.home.description,
    type: 'website',
    locale: 'vi_VN',
    siteName: `${strings.hero.groomName} & ${strings.hero.brideName}`,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: meta.home.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.home.title,
    description: meta.home.description,
    images: ['/images/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      suppressHydrationWarning
      className={`${sans.variable} ${notoSerif.variable} ${greatVibes.variable} h-full antialiased`}
      lang='vi'>
      <body
        suppressHydrationWarning
        className='flex min-h-full flex-col bg-cream font-sans text-wine'>
        <a
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-wine focus:px-4 focus:py-2 focus:text-cream focus:outline-2 focus:outline-offset-2 focus:outline-gold-light'
          href='#main-content'>
          {shared.skipToContent}
        </a>
        <AudioPlayer />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
