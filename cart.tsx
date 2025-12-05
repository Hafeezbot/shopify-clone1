"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CartItem } from "./cart-item"
import { ShoppingCart, Trash2, AlertCircle } from "lucide-react"
import { CartDemo } from "./cart-demo"

interface CartData {
  cart: any
  items: any[]
  total: number
  itemCount: number
  message?: string
}

interface CartProps {
  userId?: string
  sessionId?: string
}

export function Cart({ userId, sessionId }: CartProps) {
  const [cartData, setCartData] = useState<CartData>({
    cart: null,
    items: [],
    total: 0,
    itemCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isDemoMode, setIsDemoMode] = useState(false)

  const fetchCart = async () => {
    try {
      setHasError(false)
      setIsLoading(true)

      const params = new URLSearchParams()
      if (userId) params.append("user_id", userId)
      if (sessionId) params.append("session_id", sessionId)

      console.log("Fetching cart with params:", params.toString())

      const response = await fetch(`/api/cart?${params}`)

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", response.status, errorText)
        setHasError(true)
        setErrorMessage(`API Error: ${response.status} ${errorText}`)
        return
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text()
        console.error("Non-JSON response:", errorText)
        setHasError(true)
        setErrorMessage("Server returned non-JSON response")
        return
      }

      const data = await response.json()
      console.log("Cart data received:", data)

      setCartData(data)

      // Check if we're in demo mode
      if (data.message && data.message.includes("demo mode")) {
        setIsDemoMode(true)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      setHasError(true)
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (product: {
    product_id: string
    product_name: string
    product_price: number
    product_image?: string
    quantity?: number
  }) => {
    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          ...product,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error adding to cart:", response.status, errorText)
        return
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        await fetchCart()
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const clearCart = async () => {
    try {
      const params = new URLSearchParams()
      if (userId) params.append("user_id", userId)
      if (sessionId) params.append("session_id", sessionId)

      const response = await fetch(`/api/cart/clear?${params}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCart()
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  useEffect(() => {
    if (userId || sessionId) {
      fetchCart()
    }
  }, [userId, sessionId])

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading cart...</p>
        </CardContent>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Cart Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">There was an issue loading your cart:</p>
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <code className="text-sm text-red-800">{errorMessage}</code>
            </div>
            <div className="space-y-2">
              <Button onClick={fetchCart} className="mr-2">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.open("/api/debug", "_blank")}>
                View Debug Info
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold mb-4">Try Demo Mode Instead:</h3>
            <CartDemo />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Shopping Cart ({cartData.itemCount} items)
        </CardTitle>
        {isDemoMode && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            {cartData.message}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {cartData.items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
            <Button
              className="mt-4"
              onClick={() =>
                addToCart({
                  product_id: "sample-product",
                  product_name: "Sample Product",
                  product_price: 29.99,
                  product_image: "/placeholder.svg?height=100&width=100",
                })
              }
            >
              Add Sample Product
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartData.items.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} />
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
                <div className="text-right">
                  <p className="text-lg font-semibold">Total: ${cartData.total.toFixed(2)}</p>
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
