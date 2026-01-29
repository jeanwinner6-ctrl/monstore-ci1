import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
const categories = [
  {
    name: 'Électronique',
    slug: 'electronics',
    subcategories: ['Téléphones', 'Ordinateurs', 'TV & Audio', 'Caméras', 'Accessoires'],
  },
  {
    name: 'Mode',
    slug: 'fashion',
    subcategories: ['Hommes', 'Femmes', 'Enfants', 'Montres', 'Chaussures'],
  },
  {
    name: 'Maison',
    slug: 'home',
    subcategories: ['Meubles', 'Décoration', 'Cuisine', 'Literie', 'Éclairage'],
  },
  {
    name: 'Beauté & Santé',
    slug: 'beauty',
    subcategories: ['Maquillage', 'Soins', 'Parfums', 'Cheveux', 'Santé'],
  },
  {
    name: 'Sports',
    slug: 'sports',
    subcategories: ['Fitness', 'Football', 'Basketball', 'Camping', 'Vêtements'],
  },
  {
    name: 'Alimentation',
    slug: 'food',
    subcategories: ['Boissons', 'Épicerie', 'Frais', 'Snacks', 'Bio'],
  },
  {
    name: 'Auto & Moto',
    slug: 'auto',
    subcategories: ['Pièces', 'Accessoires', 'Outils', 'Entretien', 'GPS'],
  },
]
export function CategoryNav() {
  const navigate = useNavigate()
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const handleSubcategoryClick = (categorySlug: string, subcategory: string) => {
    navigate(`/shop?category=${categorySlug}&sub=${subcategory.toLowerCase()}`)
    setShowAllCategories(false)
    setActiveCategory(null)
  }
  return (
    <div className="bg-white border-b border-gray-200 hidden md:block shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-1">
          {/* All Categories Button */}
          <div className="relative">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              onMouseEnter={() => setShowAllCategories(true)}
              className={`flex items-center px-4 py-3 mr-4 cursor-pointer rounded-t-md mt-1 transition-colors ${
                showAllCategories ? 'bg-[#FF6B00] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {showAllCategories ? <X className="w-5 h-5 mr-2" /> : <Menu className="w-5 h-5 mr-2" />}
              <span className="font-medium">Toutes les catégories</span>
            </button>
            {/* Mega Menu */}
            <AnimatePresence>
              {showAllCategories && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onMouseLeave={() => {
                    setShowAllCategories(false)
                    setActiveCategory(null)
                  }}
                  className="absolute left-0 top-full w-64 bg-white shadow-xl rounded-b-lg border border-gray-200 z-50"
                >
                  {categories.map((category) => (
                    <div
                      key={category.slug}
                      onMouseEnter={() => setActiveCategory(category.slug)}
                      className="relative"
                    >
                      <Link
                        to={`/shop?category=${category.slug}`}
                        onClick={() => setShowAllCategories(false)}
                        className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          activeCategory === category.slug
                            ? 'bg-orange-50 text-[#FF6B00]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{category.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      {/* Subcategories Panel */}
                      {activeCategory === category.slug && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="absolute left-full top-0 w-48 bg-white shadow-xl rounded-r-lg border border-gray-200 border-l-0 py-2"
                        >
                          {category.subcategories.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => handleSubcategoryClick(category.slug, sub)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors"
                            >
                              {sub}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Category Links */}
          {categories.slice(0, 6).map((category) => (
            <div key={category.slug} className="relative group">
              <Link
                to={`/shop?category=${category.slug}`}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#FF6B00] transition-colors"
              >
                {category.name}
                <ChevronDown className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100" />
              </Link>
              {/* Dropdown */}
              <div className="absolute left-0 top-full w-56 bg-white shadow-lg rounded-b-md border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                <div className="py-2">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      to={`/shop?category=${category.slug}&sub=${sub.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="flex-1"></div>
          <Link
            to="/shop?filter=deals"
            className="px-4 py-3 text-sm font-bold text-[#FF6B00] hover:underline animate-pulse"
          >
            🔥 OFFRES FLASH
          </Link>
        </div>
      </div>
    </div>
  )
}