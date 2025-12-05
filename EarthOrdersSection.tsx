'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

interface Order
{
    orderNumber: string
    productId: string
    status: string
    city: string
    country: string
    lat: number
    lng: number
}

export default function EarthOrdersSection()
{
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() =>
    {
        const fetchOrders = async () =>
        {
            try
            {
                const res = await fetch('/api/orders')

                if (!res.ok)
                {
                    throw new Error(`❌ Fetch failed: ${res.status}`)
                }

                const json = await res.json()

                // Ensure it's an array of valid objects
                if (Array.isArray(json))
                {
                    const validOrders = json.filter(
                        (o) =>
                            typeof o.lat === 'number' &&
                            typeof o.lng === 'number' &&
                            o.lat !== 0 &&
                            o.lng !== 0
                    )

                    setOrders(validOrders)
                } else
                {
                    console.warn('⚠️ Response is not an array:', json)
                }
            } catch (error)
            {
                console.error('❌ Error fetching orders:', error)
            }
        }

        fetchOrders()
    }, [])


    return (
        <div className="w-full h-[600px] bg-black rounded-2xl overflow-hidden shadow-lg">
            <Globe
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
                showAtmosphere
                atmosphereColor="skyblue"
                atmosphereAltitude={0.25}
                autoRotate
                autoRotateSpeed={0.4}
                enablePointerInteraction
                pointsData={orders}
                pointLat={(d: Order) => d.lat}
                pointLng={(d: Order) => d.lng}
                pointColor={() => '#ff4500'}
                pointAltitude={() => 0.1}
                pointRadius={() => 0.4}
                pointLabel={(d: Order) =>
                    `<b>Order:</b> ${d.orderNumber}<br/>
           <b>Product:</b> ${d.productId}<br/>
           <b>Status:</b> ${d.status}<br/>
           <b>Location:</b> ${d.city}, ${d.country}`
                }
            />
        </div>
    )
}
