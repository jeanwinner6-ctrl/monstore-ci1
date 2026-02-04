import React, { useState } from 'react'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useApp } from '../context/AppContext'

export function SellPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useApp()

  // Champs à remplir par le vendeur (les infos de compte viennent du contexte)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    shopName: '',
    categories: '',
    message: '',
  })

  const handleSubmit = async () => {
    // Sécurité: route déjà protégée, mais on vérifie quand même
    if (!isAuthenticated || !user?.id) {
      alert('Veuillez vous connecter pour envoyer une demande.')
      navigate('/login')
      return
    }
    if (!form.shopName.trim()) {
      alert('Veuillez indiquer le nom de la boutique.')
      return
    }
    try {
      setLoading(true)
      await api.applySeller({
        userId: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        shopName: form.shopName.trim(),
        categories: form.categories.trim(),
        message: form.message.trim(),
      })
      alert('Votre demande a été envoyée. Nous vous contacterons sous peu.')
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Envoi impossible. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendre sur MonStore</h1>
        <p className="text-gray-600 mb-6">
          Vous devez être inscrit et connecté pour faire une demande. Vos informations de compte seront transmises avec votre demande.
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          {/* Infos de compte (préremplies, non éditables ici) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom complet (compte)"
              value={user ? `${user.firstName} ${user.lastName}` : ''}
              disabled
            />
            <Input
              label="Téléphone (compte)"
              value={user?.phone ?? ''}
              disabled
            />
            <Input
              label="Email (compte)"
              value={user?.email ?? ''}
              disabled
              className="md:col-span-2"
            />
          </div>

          {/* Champs de la demande vendeur */}
          <Input
            label="Nom de la boutique"
            placeholder="Ex: Boutique Premium"
            value={form.shopName}
            onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            required
          />
          <Input
            label="Catégories proposées"
            placeholder="Électronique, Mode, Maison…"
            value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
          />
          <Textarea
            label="Message"
            placeholder="Parlez-nous de votre activité, de vos produits et de votre stock."
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>Annuler</Button>
            <Button onClick={handleSubmit} isLoading={loading}>Envoyer ma demande</Button>
          </div>
        </div>

        <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-100">
          <h2 className="font-bold text-gray-900 mb-2">Comment ça marche ?</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Envoyez votre demande avec les informations ci-dessus.</li>
            <li>Notre équipe vous contacte pour vérification et activation de votre boutique.</li>
            <li>Votre compte est promu vendeur; vous accédez à l’espace /seller.</li>
            <li>Vous ajoutez vos produits et commencez à vendre.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}