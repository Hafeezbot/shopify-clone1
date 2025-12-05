"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CartItem } from "./cart-item"
import { ShoppingCart, Trash2, AlertCircle } from "lucide-react"

interface DemoCartItem {
  id: number
  product_id: string
  product_name: string
  product_price: number
  product_image?: string
  quantity: number
}

export function CartDemo() {
  const [items, setItems] = useState<DemoCartItem[]>([])

  const addSampleProduct = () => {
    const newItem: DemoCartItem = {
      id: Date.now(),
      product_id: `product-${Date.now()}`,
      product_name: "Sample Product",
      product_price: 29.99,
      product_image: "/placeholder.svg?height=100&width=100",
      quantity: 1,
    }

    const existingIndex = items.findIndex((item) => item.product_id === newItem.product_id)
    if (existingIndex >= 0) {
      const updatedItems = [...items]
      updatedItems[existingIndex].quantity += 1
      setItems(updatedItems)
    } else {
      setItems([...items, newItem])
    }
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const removeItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Shopping Cart - Demo Mode ({itemCount} items)
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          Running in demo mode - database not connected
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
            <Button className="mt-4" onClick={addSampleProduct}>
              Add Sample Product
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} />
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
                <div className="text-right">
                  <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
