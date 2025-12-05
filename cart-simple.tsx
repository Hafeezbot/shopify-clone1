"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Trash2, AlertCircle, CheckCircle } from "lucide-react"

interface CartData {
  cart: any
  items: any[]
  total: number
  itemCount: number
  mode?: string
}

interface CartProps {
  userId?: string
  sessionId?: string
}

export function CartSimple({ userId, sessionId }: CartProps) {
  const [cartData, setCartData] = useState<CartData>({
    cart: null,
    items: [],
    total: 0,
    itemCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [apiStatus, setApiStatus] = useState<"checking" | "working" | "failed">("checking")

  // Test API first
  const testAPI = async () => {
    try {
      console.log("Testing API connection...")
      const response = await fetch("/api/test")

      if (response.ok) {
        const data = await response.json()
        console.log("API test successful:", data)
        setApiStatus("working")
        return true
      } else {
        console.error("API test failed:", response.status)
        setApiStatus("failed")
        return false
      }
    } catch (error) {
      console.error("API test error:", error)
      setApiStatus("failed")
      return false
    }
  }

  const fetchCart = async () => {
    try {
      setHasError(false)
      setIsLoading(true)

      // Test API first
      const apiWorking = await testAPI()
      if (!apiWorking) {
        setHasError(true)
        setErrorMessage("API is not responding")
        return
      }

      const params = new URLSearchParams()
      if (userId) params.append("user_id", userId)
      if (sessionId) params.append("session_id", sessionId)

      console.log("Fetching cart with params:", params.toString())

      const response = await fetch(`/api/cart?${params}`)
      console.log("Cart response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Cart API Error:", response.status, errorText)
        setHasError(true)
        setErrorMessage(`Cart API Error: ${response.status} - ${errorText}`)
        return
      }

      const data = await response.json()
      console.log("Cart data received:", data)
      setCartData(data)
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
      console.log("Adding to cart:", product)

      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          ...product,
        }),
      })

      console.log("Add to cart response:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error adding to cart:", response.status, errorText)
        return
      }

      const data = await response.json()
      console.log("Add to cart success:", data)

      // Update cart data directly from response
      setCartData({
        cart: { id: data.cart_id },
        items: data.items,
        total: data.total,
        itemCount: data.itemCount,
        mode: data.mode,
      })
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
          <p className="text-sm text-gray-500 mt-2">API Status: {apiStatus}</p>
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
            <p className="text-gray-600 mb-4">There was an issue with the cart system:</p>
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <code className="text-sm text-red-800">{errorMessage}</code>
            </div>
            <div className="space-y-2">
              <Button onClick={fetchCart}>Try Again</Button>
              <Button variant="outline" onClick={() => window.open("/api/test", "_blank")}>
                Test API
              </Button>
            </div>
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
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-600">API Working</span>
          {cartData.mode && <span className="text-gray-500">• Mode: {cartData.mode}</span>}
        </div>
      </CardHeader>
      <CardContent>
        {cartData.items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
            <Button
              className="mt-4"
              onClick={() =>
                addToCart({
                  product_id: "sample-product-" + Date.now(),
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
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={item.product_image || "/placeholder.svg?height=64&width=64"}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product_name}</h3>
                  <p className="text-sm text-gray-600">${item.product_price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Qty: {item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.product_price * item.quantity).toFixed(2)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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
