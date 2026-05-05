import './globals.css'

import type { Metadata } from 'next'
import { Great_Vibes, Inter, Noto_Serif } from 'next/font/google'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
})

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin', 'vietnamese'],
})

const greatVibes = Great_Vibes({
  weight: '400',
  variable: '--font-great-vibes',
  subsets: ['latin', 'vietnamese'],
})

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tx-va-wedding.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Xuân Tùng & Vân Anh — Thiệp cưới',
  description:
    'Thiệp cưới Xuân Tùng & Vân Anh. Tiệc đãi khách 08/06/2026, lễ thành hôn 09/06/2026 tại Sân đình thôn Gia Lương, Đông Anh, Hà Nội.',
  openGraph: {
    title: 'Xuân Tùng & Vân Anh — Thiệp cưới',
    description:
      'Thiệp cưới Xuân Tùng & Vân Anh. Tiệc đãi khách 08/06/2026, lễ thành hôn 09/06/2026 tại Sân đình thôn Gia Lương, Đông Anh, Hà Nội.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Xuân Tùng & Vân Anh',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Thiệp cưới Xuân Tùng & Vân Anh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xuân Tùng & Vân Anh — Thiệp cưới',
    description:
      'Thiệp cưới Xuân Tùng & Vân Anh. Tiệc đãi khách 08/06/2026, lễ thành hôn 09/06/2026 tại Sân đình thôn Gia Lương, Đông Anh, Hà Nội.',
    images: ['/images/og-image.png'],
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
      className={`${inter.variable} ${notoSerif.variable} ${greatVibes.variable} h-full antialiased`}
      lang='vi'>
      <body
        suppressHydrationWarning
        className='flex min-h-full flex-col bg-cream font-sans text-wine'>
        <a
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-wine focus:px-4 focus:py-2 focus:text-cream focus:outline-2 focus:outline-offset-2 focus:outline-gold-light'
          href='#main-content'>
          Chuyển đến nội dung chính
        </a>
        {children}
      </body>
    </html>
  )
}
