"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutAdmin } from "@/lib/admin-actions"
import { LogOut } from "lucide-react"

export function LogoutButton()
{
  const router = useRouter()

  async function handleLogout()
  {
    await logout()
    router.push("/login")
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
