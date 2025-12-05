import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home()
{
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome</h1>
          <p className="mt-2 text-gray-600">Choose your destination</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/shop">
            <Button size="lg" className="w-full h-20 text-lg">
              🛍️ Visit Shop
              <span className="block text-sm font-normal mt-1">Browse our products</span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full h-20 text-lg">
              🔐 Admin Panel
              <span className="block text-sm font-normal mt-1">Manage products</span>
            </Button>
          </Link>
          <Link href="/user-login">
            <Button variant="secondary" size="lg" className="w-full h-20 text-lg">
              👤 User Login
              <span className="block text-sm font-normal mt-1">Access your account</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
