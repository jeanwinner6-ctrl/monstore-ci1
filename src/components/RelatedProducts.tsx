import React from 'react'
import { Product } from '../types'
import { ProductCard } from './ProductCard'
interface RelatedProductsProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}
export function RelatedProducts({ products, onAddToCart }: RelatedProductsProps) {
  if (products.length === 0) return null
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-[#FF6B00] pl-3">
        Produits similaires
      </h2>
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