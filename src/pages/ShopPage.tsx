import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Product } from '../types'
// Category mapping
const categoryMap: Record<string, string> = {
  'electronics': 'Électronique',
  'fashion': 'Mode',
  'home': 'Maison',
  'beauty': 'Beauté & Santé',
  'sports': 'Sports',
  'food': 'Alimentation',
  'auto': 'Auto & Moto'
}
// Subcategory mapping
const subcategoryMap: Record<string, Record<string, string>> = {
  'electronics': {
    'téléphones': 'Téléphones',
    'ordinateurs': 'Ordinateurs',
    'tv & audio': 'TV & Audio',
    'caméras': 'Caméras',
    'accessoires': 'Accessoires'
  },
  'fashion': {
    'hommes': 'Hommes',
    'femmes': 'Femmes',
    'enfants': 'Enfants',
    'montres': 'Montres',
    'chaussures': 'Chaussures'
  },
  'home': {
    'meubles': 'Meubles',
    'décoration': 'Décoration',
    'cuisine': 'Cuisine',
    'literie': 'Literie',
    'éclairage': 'Éclairage'
  },
  'beauty': {
    'maquillage': 'Maquillage',
    'soins': 'Soins',
    'parfums': 'Parfums',
    'cheveux': 'Cheveux',
    'santé': 'Santé'
  },
  'sports': {
    'fitness': 'Fitness',
    'football': 'Football',
    'basketball': 'Basketball',
    'camping': 'Camping',
    'vêtements': 'Vêtements'
  }
}
export function ShopPage() {
  const [searchParams] = useSearchParams()
  const { products, addToCart } = useApp()
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [sortBy, setSortBy] = useState('relevance')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  // Get search and category from URL
  const searchQuery = searchParams.get('search') || ''
  const categoryParam = searchParams.get('category') || ''
  const subParam = searchParams.get('sub') || ''
  const filterParam = searchParams.get('filter') || ''
  useEffect(() => {
    let result = [...products]
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.subcategory?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      )
    }
    // Filter by deals
    if (filterParam === 'deals') {
      result = result.filter(p => p.discount && p.discount > 0)
    }
    // Filter by category from URL
    if (categoryParam) {
      const categoryName = categoryMap[categoryParam]
      if (categoryName) {
        result = result.filter(p => p.category === categoryName)
      }
    }
    // Filter by subcategory from URL
    if (subParam && categoryParam) {
      const subMap = subcategoryMap[categoryParam]
      if (subMap) {
        const subcategoryName = subMap[subParam.toLowerCase()] || subParam
        result = result.filter(p => 
          p.subcategory?.toLowerCase() === subcategoryName.toLowerCase() ||
          p.subcategory?.toLowerCase() === subParam.toLowerCase()
        )
      }
    }
    // Filter by selected categories (checkbox)
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category))
    }
    // Filter by price range
    if (priceRange.min) {
      result = result.filter(p => p.price >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      result = result.filter(p => p.price <= parseInt(priceRange.max))
    }
    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
    }
    setFilteredProducts(result)
  }, [products, searchQuery, categoryParam, subParam, filterParam, sortBy, selectedCategories, priceRange])
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }
  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: '', max: '' })
  }
  const activeFiltersCount = selectedCategories.length + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0)
  // Get page title
  const getPageTitle = () => {
    if (filterParam === 'deals') return 'Offres Flash'
    if (searchQuery) return `Résultats pour "${searchQuery}"`
    if (subParam && categoryParam) {
      const subMap = subcategoryMap[categoryParam]
      const subName = subMap?.[subParam.toLowerCase()] || subParam
      return `${categoryMap[categoryParam] || categoryParam} - ${subName}`
    }
    if (categoryParam) return categoryMap[categoryParam] || 'Boutique'
    return 'Tous les produits'
  }
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-[#FF6B00]">Accueil</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/shop" className="hover:text-[#FF6B00]">Boutique</Link>
            {categoryParam && (
              <>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link to={`/shop?category=${categoryParam}`} className="hover:text-[#FF6B00]">
                  {categoryMap[categoryParam] || categoryParam}
                </Link>
              </>
            )}
            {subParam && (
              <>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-gray-900 font-medium">
                  {subcategoryMap[categoryParam]?.[subParam.toLowerCase()] || subParam}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Filtres</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-[#FF6B00] hover:underline">
                    Effacer tout
                  </button>
                )}
              </div>
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {['Électronique', 'Mode', 'Maison', 'Beauté & Santé', 'Sports'].map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                      />
                      <span className="ml-2 text-sm text-gray-600 hover:text-[#FF6B00]">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Price Range */}
              <div className="mb-6 border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Prix (FCFA)</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {/* Header & Sort */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
                <p className="text-sm text-gray-500">{filteredProducts.length} produit(s) trouvé(s)</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-[#FF6B00] text-white text-xs px-1.5 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] sm:text-sm rounded-md"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price-asc">Prix: Croissant</option>
                  <option value="price-desc">Prix: Décroissant</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>
            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
                <button onClick={clearFilters} className="text-[#FF6B00] hover:underline">
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Filtres</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-32">
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {['Électronique', 'Mode', 'Maison', 'Beauté & Santé', 'Sports'].map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                      />
                      <span className="ml-2 text-sm text-gray-600">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Prix (FCFA)</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-[#FF6B00] text-white py-3 rounded-md font-medium"
              >
                Voir {filteredProducts.length} résultat(s)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}