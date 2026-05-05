import { HeroSection } from '@/components/hero'
import { getGuestById } from '@/lib/guests'

type HomePageProps = {
  searchParams?: Promise<{
    g?: string | string[]
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams
  const guest = getGuestById(resolvedSearchParams?.g)

  return (
    <main>
      <HeroSection guest={guest} />
    </main>
  )
}
