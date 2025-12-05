"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/lib/user-actions"
import { LogOut } from "lucide-react"

export function UserLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logoutUser()
    router.push("/shop")
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
