import React, { useState, Fragment } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Truck, ShieldCheck, Heart, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/Breadcrumb'
import { ReviewSection } from '../components/ReviewSection'
import { RelatedProducts } from '../components/RelatedProducts'
import { useApp } from '../context/AppContext'
import { Review } from '../types'
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Jean Kouassi',
    rating: 5,
    comment: 'Excellent produit, la qualité est au rendez-vous. Livraison rapide en 24h à Abidjan.',
    date: '28 Jan 2024',
    helpful: 12,
    verified: true,
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Marie Touré',
    rating: 4,
    comment: 'Très bon produit mais un peu cher. Le service client est top par contre.',
    date: '25 Jan 2024',
    helpful: 5,
    verified: true,
  },
]
export function ProductDetailPage() {
  const { id } = useParams()
  const { getProductById, addToCart, addToWishlist, removeFromWishlist, isInWishlist, products } = useApp()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const product = getProductById(id || '')
  const inWishlist = product ? isInWishlist(product.id) : false
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF',
    }).format(price).replace('XOF', 'FCFA')
  }
  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/shop">
            <Button>Retour à la boutique</Button>
          </Link>
        </div>
      </div>
    )
  }
  const breadcrumbItems = [
    { label: 'Boutique', href: '/shop' },
    { label: product.category, href: `/shop?category=${product.category.toLowerCase()}` },
    { label: product.title },
  ]
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }
  // Get related products from same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 5)
  const productImages = product.images || [product.image]
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-white border-b border-gray-200 py-3 mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        {/* Product Main Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative">
                <img
                  src={productImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-4"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="danger" className="text-sm font-bold px-3 py-1">
                      -{product.discount}%
                    </Badge>
                  </div>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-md border-2 overflow-hidden bg-gray-50 ${
                        selectedImage === idx ? 'border-[#FF6B00]' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Info */}
            <div>
              <div className="mb-2">
                <Link
                  to={`/shop?category=${product.category.toLowerCase()}`}
                  className="text-sm text-[#FF6B00] font-medium hover:underline"
                >
                  {product.category}
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2 underline cursor-pointer">
                    {product.reviews} avis
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'En stock' : 'Rupture de stock'}
                </span>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#FF6B00]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">TVA incluse</p>
              </div>
              <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
                {product.description && (
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                )}
                {product.specs && (
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <Fragment key={key}>
                        <span className="text-gray-500">{key}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-md w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </Button>
                <button 
                  onClick={handleWishlistToggle}
                  className={`p-3 border rounded-md transition-colors ${
                    inWishlist 
                      ? 'border-red-300 bg-red-50 text-red-500' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Truck className="w-5 h-5 mr-2 text-[#FF6B00]" />
                  <span>Livraison gratuite dès 50.000 FCFA</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ShieldCheck className="w-5 h-5 mr-2 text-[#FF6B00]" />
                  <span>Garantie 12 mois incluse</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reviews & Related */}
        <div className="space-y-8">
          <ReviewSection
            reviews={MOCK_REVIEWS}
            averageRating={product.rating}
            totalReviews={product.reviews}
          />
          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} onAddToCart={addToCart} />
          )}
        </div>
      </div>
    </div>
  )
}