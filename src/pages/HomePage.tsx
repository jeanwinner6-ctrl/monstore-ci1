import React from 'react'
import { HeroCarousel } from '../components/HeroCarousel'
import { ProductGrid } from '../components/ProductGrid'
import { TrustBadges } from '../components/TrustBadges'
import { Product } from '../types'
import { Link, useNavigate } from 'react-router-dom'

interface HomePageProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}
export function HomePage({ products, onAddToCart }: HomePageProps) {
  const navigate = useNavigate()

  // Filter products for different sections
  const flashDeals = products.filter((p) => p.discount && p.discount > 0).slice(0, 5)
  const electronics = products.filter((p) => p.category === 'Électronique').slice(0, 5)
  const fashion = products.filter((p) => p.category === 'Mode').slice(0, 5)
  const home = products.filter((p) => p.category === 'Maison').slice(0, 5)

  // Numéro WhatsApp support (à personnaliser)
  const supportWhatsApp = '2250707000000' // ex: +225 07 07 00 00 00 → 2250707000000
  const waMessage = encodeURIComponent('Bonjour MonStore, je souhaite des informations.')
  const whatsappHref = `https://wa.me/${supportWhatsApp}?text=${waMessage}`

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <HeroCarousel />
          </div>
          <div className="hidden lg:flex flex-col gap-4">
            <div className="flex-1 bg-orange-50 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-orange-100">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Vendez sur MonStore
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ouvrez votre boutique et touchez des millions de clients.
              </p>
              {/* Page d’onboarding vendeurs */}
              <Link to="/sell" className="text-[#FF6B00] font-bold text-sm hover:underline">
                Commencer &rarr;
              </Link>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-blue-100">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Service Client
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Besoin d'aide ? Notre équipe est là 24/7.
              </p>
              {/* Lien WhatsApp support */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-bold text-sm hover:underline"
              >
                Contacter &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
      <TrustBadges />
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <ProductGrid
          title="Offres Flash du Jour"
          products={flashDeals}
          onAddToCart={onAddToCart}
          viewAllLink="/shop?filter=deals"
        />
        <div className="bg-[#FF6B00] rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">
              Téléchargez notre application
            </h2>
            <p className="text-orange-100 max-w-md">
              Profitez de meilleures offres et suivez vos commandes en temps
              réel.
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-colors">
              <span className="text-xs mr-1">Disponible sur</span>
              <span className="font-bold">App Store</span>
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-colors">
              <span className="text-xs mr-1">Disponible sur</span>
              <span className="font-bold">Google Play</span>
            </button>
          </div>
        </div>
        {electronics.length > 0 && (
          <ProductGrid
            title="Électronique & High-Tech"
            products={electronics}
            onAddToCart={onAddToCart}
            viewAllLink="/shop?category=electronics"
          />
        )}
        {fashion.length > 0 && (
          <ProductGrid
            title="Mode & Vêtements"
            products={fashion}
            onAddToCart={onAddToCart}
            viewAllLink="/shop?category=fashion"
          />
        )}
        {home.length > 0 && (
          <ProductGrid
            title="Maison & Décoration"
            products={home}
            onAddToCart={onAddToCart}
            viewAllLink="/shop?category=home"
          />
        )}
      </div>
    </div>
  )
}