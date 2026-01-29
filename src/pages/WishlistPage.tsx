import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Breadcrumb } from '../components/Breadcrumb'
import { Button } from '../components/ui/Button'
import { Product } from '../types'
export function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useApp()
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI').format(price) + ' FCFA'
  }
  const handleAddToCart = (product: Product) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Ma Liste de Souhaits' }]} />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Ma Liste de Souhaits
            {wishlist.length > 0 && (
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({wishlist.length} article{wishlist.length > 1 ? 's' : ''})
              </span>
            )}
          </h1>
        </div>
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Votre liste de souhaits est vide
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Parcourez notre boutique et ajoutez vos produits favoris en cliquant sur le cœur.
            </p>
            <Link to="/shop">
              <Button size="lg">Découvrir nos produits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden group"
              >
                <Link to={`/product/${product.id}`} className="block relative">
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 hover:text-[#FF6B00] transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-[#FF6B00]">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="flex-1"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}