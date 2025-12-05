"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { LucideUser } from "lucide-react"

interface ShopUser {
  id: string
  email: string
  first_name: string
  last_name: string
}

export function ShopHeader() {
  const [user, setUser] = useState<ShopUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check user session
    fetch("/api/user-session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch((error) => {
        console.error("Session check failed:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/shop" className="text-2xl font-bold text-gray-900">
            MyShop
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/shop/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/shop/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ShoppingBag className="h-5 w-5" />
            </Button>

            {isLoading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <LucideUser className="h-4 w-4 mr-2" />
                  {user.first_name}
                </Button>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link href="/user-login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
