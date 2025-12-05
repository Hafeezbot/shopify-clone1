"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X } from "lucide-react"

interface ProductFiltersProps
{
  categories: string[]
  colors: string[]
  materials: string[]
  collars: string[]
  currentFilters: {
    category?: string
    color?: string
    material?: string
    collar?: string
    minPrice?: string
    maxPrice?: string
    search?: string
    inStock?: string
  }
}

export function ProductFilters({
  categories,
  colors,
  materials,
  collars,
  currentFilters,
}: ProductFiltersProps)
{
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(currentFilters.search || "")
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || "")
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || "")

  const getCheckedValues = (key: string) =>
    searchParams.get(key)?.split(",").filter(Boolean) || []

  const updateFilterList = (key: string, value: string, checked: boolean) =>
  {
    const currentValues = new Set(getCheckedValues(key))
    checked ? currentValues.add(value) : currentValues.delete(value)

    const params = new URLSearchParams(searchParams.toString())
    currentValues.size > 0
      ? params.set(key, Array.from(currentValues).join(","))
      : params.delete(key)

    router.push(`/shop?${params.toString()}`)
  }

  const updateFilters = (newFilters: Record<string, string | undefined>) =>
  {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newFilters).forEach(([key, value]) =>
      value && value !== "all" ? params.set(key, value) : params.delete(key)
    )
    router.push(`/shop?${params.toString()}`)
  }

  const clearAllFilters = () =>
  {
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
    router.push("/shop")
  }

  const handleSearchSubmit = (e: React.FormEvent) =>
  {
    e.preventDefault()
    updateFilters({
      ...Object.fromEntries(searchParams.entries()),
      search: search || undefined,
    })
  }

  const handlePriceFilter = () =>
  {
    updateFilters({
      ...Object.fromEntries(searchParams.entries()),
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    })
  }

  const hasActiveFilters = searchParams.toString().length > 0

  const checkboxClassName = "text-black border-black"

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Search</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" size="sm" className="w-full">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Category Checkboxes */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Category</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) =>
          {
            const checked = getCheckedValues("category").includes(category)
            return (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  className={checkboxClassName}
                  id={`category-${category}`}
                  checked={checked}
                  onCheckedChange={(checked) =>
                    updateFilterList("category", category, checked as boolean)
                  }
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Color Checkboxes */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Color</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {colors.map((color) =>
          {
            const checked = getCheckedValues("color").includes(color)
            return (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  className={checkboxClassName}
                  id={`color-${color}`}
                  checked={checked}
                  onCheckedChange={(checked) =>
                    updateFilterList("color", color, checked as boolean)
                  }
                />
                <Label htmlFor={`color-${color}`}>{color}</Label>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Material Checkboxes */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Material</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {materials.map((material) =>
          {
            const checked = getCheckedValues("material").includes(material)
            return (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  className={checkboxClassName}
                  id={`material-${material}`}
                  checked={checked}
                  onCheckedChange={(checked) =>
                    updateFilterList("material", material, checked as boolean)
                  }
                />
                <Label htmlFor={`material-${material}`}>{material}</Label>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Collar Checkboxes */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Collar</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {collars.map((collar) =>
          {
            const checked = getCheckedValues("collar").includes(collar)
            return (
              <div key={collar} className="flex items-center space-x-2">
                <Checkbox
                  className={checkboxClassName}
                  id={`collar-${collar}`}
                  checked={checked}
                  onCheckedChange={(checked) =>
                    updateFilterList("collar", collar, checked as boolean)
                  }
                />
                <Label htmlFor={`collar-${collar}`}>{collar}</Label>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Availability Checkboxes */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Availability</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {["true", "false"].map((val) =>
          {
            const label = val === "true" ? "In Stock" : "Out of Stock"
            const checked = getCheckedValues("inStock").includes(val)
            return (
              <div key={val} className="flex items-center space-x-2">
                <Checkbox
                  className={checkboxClassName}
                  id={`inStock-${val}`}
                  checked={checked}
                  onCheckedChange={(checked) =>
                    updateFilterList("inStock", val, checked as boolean)
                  }
                />
                <Label htmlFor={`inStock-${val}`}>{label}</Label>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Price Filter */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Price Range</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Min Price ($)</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Max Price ($)</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button onClick={handlePriceFilter} size="sm" className="w-full">
            Apply Price Filter
          </Button>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full flex items-center gap-2">
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
