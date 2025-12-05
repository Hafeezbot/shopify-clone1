"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product
{
  id: string
  name: string
  description: string
  price: number
  stock: number
}

interface ProductFormProps
{
  product?: Product
}

export function ProductForm({ product }: ProductFormProps)
{
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isEditing = !!product

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>)
  {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try
    {
      const form = e.currentTarget

      const formData = {
        name: (form.name as HTMLInputElement).value,
        description: (form.description as HTMLTextAreaElement).value,
        price: parseFloat((form.price as HTMLInputElement).value),
        stock: parseInt((form.stock as HTMLInputElement).value),
      }

      const url = "/api/products"
      const method = isEditing ? "PUT" : "POST"

      if (isEditing && product?.id)
      {
        Object.assign(formData, { id: product.id })
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok)
      {
        setError(data.error || "Failed to save product. Please try again.")
        return
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err)
    {
      console.error(err)
      setError("An unexpected error occurred. Please try again.")
    } finally
    {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" defaultValue={product?.name || ""} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description || ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price || ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock || "0"}
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </Button>

        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
