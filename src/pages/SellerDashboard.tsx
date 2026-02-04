import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../services/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import type { Product, SellerProfile } from '../types'
import { Trash2, Plus } from 'lucide-react'

export function SellerDashboard() {
  const { user } = useApp()
  const sellerId = user?.sellerId || '' // l'admin met à jour user.sellerId après approbation
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'Électronique',
    subcategory: '',
    image: '',
    description: '',
    stock: '0',
  })

  useEffect(() => {
    (async () => {
      try {
        const [p, prods] = await Promise.all([
          api.getSellerProfile(sellerId).catch(() => null),
          api.getSellerProducts(sellerId).catch(() => []),
        ])
        setProfile(p)
        setProducts(prods)
      } finally {
        setLoading(false)
      }
    })()
  }, [sellerId])

  const addProduct = async () => {
    if (!form.title || !form.price) return
    const payload = {
      title: form.title,
      price: parseInt(form.price, 10),
      category: form.category,
      subcategory: form.subcategory || undefined,
      image: form.image || 'https://placehold.co/600x400?text=Produit',
      description: form.description,
      inStock: parseInt(form.stock || '0', 10) > 0,
      stock: parseInt(form.stock || '0', 10),
      rating: 0,
      reviews: 0,
    }
    const created = await api.createSellerProduct(sellerId, payload)
    setProducts(prev => [created, ...prev])
    setShowAdd(false)
    setForm({ title: '', price: '', category: 'Électronique', subcategory: '', image: '', description: '', stock: '0' })
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await api.deleteSellerProduct(sellerId, id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return <div className="p-6">Chargement…</div>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Espace Vendeur</h1>
          <p className="text-sm text-gray-600">Boutique: {profile?.shopName || user?.sellerShopName || '-'}</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-gray-600">Aucun produit. Ajoutez votre premier produit.</p>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-white border rounded p-4">
              <div className="flex items-center gap-3">
                <img src={p.image} alt={p.title} className="w-12 h-12 rounded border object-contain bg-gray-50" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.category}{p.subcategory ? ` • ${p.subcategory}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => deleteProduct(p.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Ajouter un produit" size="lg">
        <div className="space-y-3">
          <Input label="Nom" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prix (FCFA)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <Input label="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="Sous-catégorie" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
          <Input label="URL image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Annuler</Button>
            <Button onClick={addProduct}>Ajouter</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}