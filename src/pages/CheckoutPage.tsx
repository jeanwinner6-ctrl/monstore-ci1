import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartItem } from '../types'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { MobileMoneyPayment } from '../components/MobileMoneyPayment'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
interface CheckoutPageProps {
  cartItems: CartItem[]
  clearCart: () => void
}
export function CheckoutPage({ cartItems, clearCart }: CheckoutPageProps) {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useApp()
  
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    city: user?.addresses[0]?.city || 'Abidjan',
    commune: user?.addresses[0]?.commune || '',
    quartier: user?.addresses[0]?.quartier || ''
  })
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50000 ? 0 : 1500
  const total = subtotal + shipping
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF',
    }).format(price).replace('XOF', 'FCFA')
  }
  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setStep(3)
      clearCart()
    }, 2000)
  }
  const handleAddressSubmit = () => {
    if (formData.firstName && formData.lastName && formData.phone && formData.commune) {
      setStep(2)
    }
  }
  // Redirect if cart is empty and not on success step
  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
        <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier pour passer commande.</p>
        <Link to="/shop">
          <Button size="lg">Continuer vos achats</Button>
        </Link>
      </div>
    )
  }
  if (step === 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande Confirmée !</h1>
        <p className="text-gray-600 mb-2 max-w-md">
          Merci pour votre commande. Vous recevrez un SMS de confirmation.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Livraison prévue sous 24-48h à {formData.commune}, {formData.city}
        </p>
        <div className="flex gap-4">
          <Link to="/orders">
            <Button variant="outline">Voir mes commandes</Button>
          </Link>
          <Link to="/">
            <Button>Continuer vos achats</Button>
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Finaliser la commande</h1>
        </div>
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-[#FF6B00] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <span className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Livraison</span>
          </div>
          <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? 'bg-[#FF6B00]' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-[#FF6B00] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <span className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Paiement</span>
          </div>
          <div className={`w-16 h-0.5 mx-4 ${step >= 3 ? 'bg-[#FF6B00]' : 'bg-gray-200'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-[#FF6B00] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            <span className={`ml-2 text-sm font-medium ${step >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>Confirmation</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            <div className={`bg-white p-6 rounded-lg shadow-sm border ${step === 1 ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <span className={`w-6 h-6 rounded-full ${step >= 1 ? 'bg-[#FF6B00]' : 'bg-gray-300'} text-white text-xs flex items-center justify-center mr-2`}>1</span>
                  Adresse de livraison
                </h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-sm text-[#FF6B00] hover:underline">
                    Modifier
                  </button>
                )}
              </div>
              {step === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Prénom" 
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <Input 
                    label="Nom" 
                    placeholder="Kouassi"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                  <Input
                    label="Téléphone"
                    placeholder="07 07 00 00 00"
                    className="md:col-span-2"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input 
                    label="Ville" 
                    placeholder="Abidjan"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <Input 
                    label="Commune" 
                    placeholder="Cocody"
                    value={formData.commune}
                    onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                  />
                  <Input
                    label="Quartier / Repère"
                    placeholder="Angré, près de la pharmacie..."
                    className="md:col-span-2"
                    value={formData.quartier}
                    onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                  />
                  <div className="md:col-span-2 mt-4">
                    <Button onClick={handleAddressSubmit} fullWidth>
                      Continuer vers le paiement
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 pl-8">
                  <p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p>
                  <p>{formData.phone}</p>
                  <p>{formData.city}, {formData.commune}, {formData.quartier}</p>
                </div>
              )}
            </div>
            {/* Step 2: Payment */}
            <div className={`bg-white p-6 rounded-lg shadow-sm border ${step === 2 ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-gray-200'}`}>
              <div className="flex items-center mb-4">
                <span className={`w-6 h-6 rounded-full ${step >= 2 ? 'bg-[#FF6B00]' : 'bg-gray-300'} text-white text-xs flex items-center justify-center mr-2`}>2</span>
                <h2 className="text-lg font-bold text-gray-900">Paiement</h2>
              </div>
              {step === 2 && (
                <MobileMoneyPayment amount={total} onConfirm={handlePayment} />
              )}
            </div>
          </div>
          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Résumé de la commande</h3>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/product/${item.id}`}
                    className="flex gap-3 hover:bg-gray-50 p-1 rounded transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded border border-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate hover:text-[#FF6B00]">{item.title}</p>
                      <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">✓ Livraison gratuite dès 50.000 FCFA</p>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span className="text-[#FF6B00]">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-6 bg-green-50 p-3 rounded-md flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800">
                  Paiement sécurisé et crypté. Satisfait ou remboursé sous 7 jours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}