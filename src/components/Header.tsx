import React, { useState, useRef, useEffect } from 'react'
import { Search, ShoppingCart, User, MapPin, Menu, X, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function Header() {
  const navigate = useNavigate()
  const { 
    cartCount, 
    setIsCartOpen, 
    user, 
    isAuthenticated, 
    searchQuery, 
    setSearchQuery, 
    searchResults,
    wishlist 
  } = useApp()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node) &&
          mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
      setSearchQuery('')
    }
  }

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    setShowSearchResults(value.length >= 2)
  }

  const handleProductClick = (productId: string) => {
    setShowSearchResults(false)
    setSearchQuery('')
    navigate(`/product/${productId}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI').format(price) + ' FCFA'
  }

  const SearchResultsDropdown = () => (
    <>
      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-2">{searchResults.length} résultat(s)</p>
            {searchResults.slice(0, 8).map(product => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md transition-colors text-left"
              >
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-12 h-12 object-contain bg-gray-50 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <span className="text-sm font-bold text-[#FF6B00]">{formatPrice(product.price)}</span>
              </button>
            ))}
            {searchResults.length > 8 && (
              <button
                onClick={handleSearch}
                className="w-full text-center py-3 text-sm font-medium text-[#FF6B00] hover:bg-orange-50 rounded-md"
              >
                Voir tous les résultats ({searchResults.length})
              </button>
            )}
          </div>
        </div>
      )}
      {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-6 text-center z-50">
          <p className="text-gray-500">Aucun produit trouvé pour "{searchQuery}"</p>
          <p className="text-sm text-gray-400 mt-1">Essayez avec d'autres mots-clés</p>
        </div>
      )}
    </>
  )

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-100 text-xs py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="flex items-center hover:text-[#FF6B00] cursor-pointer">
              <MapPin className="w-3 h-3 mr-1" />
              Livraison à: Abidjan, Cocody
            </span>
            <span className="hover:text-[#FF6B00] cursor-pointer">
              Vendre sur MonStore
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="hover:text-[#FF6B00]">Aide</Link>
            <Link to="/orders" className="hover:text-[#FF6B00]">Suivre ma commande</Link>
            {/* Lien Admin supprimé ici */}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              Mon<span className="text-[#FF6B00]">Store</span>
              <span className="text-sm text-gray-500 ml-0.5">.CI</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="relative w-full flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                placeholder="Chercher un produit, une marque ou une catégorie..."
                className="w-full pl-4 pr-12 py-2.5 rounded-l-md border border-gray-300 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
              />
              <button 
                type="submit"
                className="bg-[#FF6B00] text-white px-6 py-2.5 rounded-r-md hover:bg-[#e66000] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            <SearchResultsDropdown />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden md:flex items-center text-gray-700 hover:text-[#FF6B00] relative"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="hidden md:flex items-center cursor-pointer hover:text-[#FF6B00] group"
            >
              <User className="w-6 h-6 text-gray-700 group-hover:text-[#FF6B00]" />
              <div className="ml-2 flex flex-col">
                <span className="text-xs text-gray-500">
                  {isAuthenticated ? `Bonjour, ${user?.firstName}` : 'Bonjour,'}
                </span>
                <span className="text-sm font-medium text-gray-900 group-hover:text-[#FF6B00]">
                  {isAuthenticated ? 'Mon Compte' : 'Se connecter'}
                </span>
              </div>
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center text-gray-700 hover:text-[#FF6B00] relative"
            >
              <ShoppingCart className="w-7 h-7" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
              <span className="hidden md:block ml-2 font-medium">Panier</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div ref={mobileSearchRef} className="mt-4 md:hidden relative">
          <form onSubmit={handleSearch} className="relative w-full flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
              placeholder="Chercher..."
              className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#FF6B00]"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 text-gray-500">
              <Search className="w-5 h-5" />
            </button>
          </form>
          <SearchResultsDropdown />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 overflow-hidden">
          <nav className="flex flex-col py-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b border-gray-100"
            >
              Accueil
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b border-gray-100"
            >
              Boutique
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b border-gray-100"
            >
              Catégories
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium border-b border-gray-100 flex items-center justify-between"
            >
              <span className="flex items-center"><Heart className="w-5 h-5 mr-3" /> Favoris</span>
              {wishlist.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>
              )}
            </Link>
            {/* Lien Admin Dashboard supprimé ici */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium flex items-center"
            >
              <User className="w-5 h-5 mr-3" />
              {isAuthenticated ? 'Mon Compte' : 'Se connecter'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}