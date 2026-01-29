import React from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from './ui/Button'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart } = useApp()
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF',
    }).format(price).replace('XOF', 'FCFA')
  }
  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-[#FF6B00]" />
              Mon Panier ({cartItems.length})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Votre panier est vide
                </h3>
                <p className="text-gray-500 mb-6">
                  Découvrez nos meilleures offres et commencez vos achats.
                </p>
                <Link to="/shop" onClick={() => setIsCartOpen(false)}>
                  <Button variant="primary">
                    Commencer mes achats
                  </Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-gray-100 pb-6 last:border-0"
                >
                  {/* Clickable Product Image */}
                  <Link 
                    to={`/product/${item.id}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200 hover:border-[#FF6B00] transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Clickable Product Title */}
                      <Link 
                        to={`/product/${item.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 hover:text-[#FF6B00] transition-colors"
                      >
                        {item.title}
                      </Link>
                      <p className="text-[#FF6B00] font-bold">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-sm font-medium text-gray-900 min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Sous-total</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Frais de livraison calculés à l'étape suivante
              </p>
              <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                <Button
                  fullWidth
                  size="lg"
                  className="shadow-lg shadow-orange-500/20"
                >
                  Commander ({formatPrice(subtotal)})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}