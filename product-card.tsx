import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Product
{
  id: string
  name: string
  description: string
  price: number
  stock: number
}

interface ProductCardProps
{
  product: Product
}

export function ProductCard({ product }: ProductCardProps)
{
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <img
            src={`/placeholder.svg?height=200&width=200`}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <Badge
              variant={
                product.stock > 10
                  ? "default"
                  : product.stock > 0
                    ? "secondary"
                    : "destructive"
              }
            >
              {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
            </Badge>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description || "No description available"}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-green-600">
              ${Number(product.price ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        <div className="flex gap-2 w-full">
          <Link href={`/shop/product/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Button className="flex-1" disabled={product.stock === 0}>
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
