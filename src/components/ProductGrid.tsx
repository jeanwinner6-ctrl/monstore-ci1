import React from 'react'
import { ProductCard } from './ProductCard'
import { Product } from '../types'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
interface ProductGridProps {
  title?: string
  products: Product[]
  onAddToCart: (product: Product) => void
  viewAllLink?: string
}
export function ProductGrid({ title, products, onAddToCart, viewAllLink }: ProductGridProps) {
  if (products.length === 0) return null
  return (
    <div className="py-8">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-[#FF6B00] pl-3">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="flex items-center text-sm font-medium text-[#FF6B00] hover:text-[#e66000] group"
            >
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  )
}