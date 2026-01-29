import React from 'react'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Product } from '../types'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { useApp } from '../context/AppContext'
interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp()
  
  const inWishlist = isInWishlist(product.id)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF',
    }).format(price).replace('XOF', 'FCFA')
  }
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
    } else {
      addToCart(product)
    }
  }
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }
  return (
    <div className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="danger" className="font-bold">
            -{product.discount}%
          </Badge>
        </div>
      )}
      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistToggle}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
          inWishlist 
            ? 'bg-red-50 text-red-500' 
            : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100'
        }`}
      >
        <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
      </button>
      {/* Image - Clickable */}
      <Link to={`/product/${product.id}`} className="relative pt-[100%] overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-[#FF6B00] transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">
            ({product.reviews})
          </span>
        </div>
        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-[#FF6B00]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-green-600 mt-1 mb-3">
            Livraison estimée: 24-48h
          </p>
          <Button
            onClick={handleAddToCart}
            variant="primary"
            fullWidth
            size="sm"
            className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  )
}