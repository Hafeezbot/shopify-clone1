import { ProductCard } from "@/components/product-card"
import { ShoppingBag } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <ShoppingBag className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No products available</h3>
        <p className="text-gray-500">Check back later for new products!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
