"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface CartItemProps {
  item: {
    id: number
    product_id: string
    product_name: string
    product_price: number
    product_image?: string
    quantity: number
  }
  onUpdateQuantity: (itemId: number, quantity: number) => void
  onRemoveItem: (itemId: number) => void
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    setQuantity(newQuantity)
    await onUpdateQuantity(item.id, newQuantity)
    setIsUpdating(false)
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    await onRemoveItem(item.id)
    setIsUpdating(false)
  }

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={item.product_image || "/placeholder.svg?height=64&width=64"}
          alt={item.product_name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-medium">{item.product_name}</h3>
        <p className="text-sm text-gray-600">${item.product_price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={isUpdating || quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Input
          type="number"
          value={quantity}
          onChange={(e) => {
            const newQuantity = Number.parseInt(e.target.value) || 1
            handleQuantityChange(newQuantity)
          }}
          className="w-16 text-center"
          min="1"
          disabled={isUpdating}
        />

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={isUpdating}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-right">
        <p className="font-medium">${(item.product_price * quantity).toFixed(2)}</p>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-red-600 hover:text-red-700"
        onClick={handleRemove}
        disabled={isUpdating}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
