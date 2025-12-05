'use client'

import dynamic from 'next/dynamic'

// ✅ Use absolute path if needed
const EarthOrdersSection = dynamic(() => import('@/components/EarthOrdersSection'), {
    ssr: false,
    loading: () => <p className="text-center">Loading globe...</p>,
})

export function EarthOrdersSectionWrapper()
{
    return <EarthOrdersSection />
}
