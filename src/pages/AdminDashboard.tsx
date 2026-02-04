import React, { useEffect, useState } from 'react'
import { Users, ShoppingBag, DollarSign, Package, TrendingUp, Download, Plus, Settings, AlertTriangle, Eye, Edit, Search, Trash2, LogOut } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Textarea'
import { useApp } from '../context/AppContext'
import { ImageUploader } from '../components/ui/ImageUploader'
import { api } from '../services/api'
import type { AdminOverview, Order, Customer, Product, PaymentProviderConfig } from '../types'
import { jsPDF } from 'jspdf'
import { AdminUsersTable } from '../components/admin/AdminUsersTable'
import { AdminSellerApplications } from '../components/admin/AdminSellerApplications'
import { AdminContactMessages } from '../components/admin/AdminContactMessages'
import { AdminBulkImport } from '../components/admin/AdminBulkImport'
import { Link } from 'react-router-dom'

// Catégories + sous-catégories
const CATEGORY_OPTIONS = ['Électronique', 'Mode', 'Maison', 'Beauté & Santé', 'Sports'] as const
const SUBCATEGORY_MAP: Record<(typeof CATEGORY_OPTIONS)[number], string[]> = {
  'Électronique': ['Téléphones', 'Ordinateurs', 'Accessoires', 'TV & Audio', 'Caméras'],
  'Mode': ['Chaussures', 'Femmes', 'Hommes', 'Montres', 'Enfants'],
  'Maison': ['Meubles', 'Cuisine', 'Éclairage', 'Literie', 'Décoration'],
  'Beauté & Santé': ['Maquillage', 'Soins', 'Cheveux', 'Santé', 'Parfums'],
  'Sports': ['Fitness', 'Football', 'Basketball', 'Camping', 'Vêtements'],
}

// Paiements: defaults + merge
const DEFAULT_PAYMENT_CONFIGS: PaymentProviderConfig[] = [
  { provider: 'wave', enabled: true },
  { provider: 'om', enabled: true },
  { provider: 'mtn', enabled: true },
  { provider: 'moov', enabled: false },
]
function mergeWithDefaults(apiConfigs: PaymentProviderConfig[] | undefined): PaymentProviderConfig[] {
  const byProvider = new Map<string, PaymentProviderConfig>()
  for (const cfg of DEFAULT_PAYMENT_CONFIGS) byProvider.set(cfg.provider, { ...cfg })
  for (const cfg of apiConfigs ?? []) {
    const prev = byProvider.get(cfg.provider)
    byProvider.set(cfg.provider, { ...(prev ?? {} as PaymentProviderConfig), ...cfg })
  }
  return Array.from(byProvider.values())
}

export function AdminDashboard() {
  const { setProducts } = useApp()

  // Données “réelles” chargées par API
  const [overview, setOverview] = useState<AdminOverview>({
    monthRevenue: 0,
    ordersCount: 0,
    customersCount: 0,
    productsCount: 0,
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setLocalProducts] = useState<Product[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Modals
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showManageCustomers, setShowManageCustomers] = useState(false)
  const [showPaymentSettings, setShowPaymentSettings] = useState(false)
  const [showAllOrders, setShowAllOrders] = useState(false)

  // Formulaire produit: dropshipping + upload d’image + sous-catégorie
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: 'Électronique' as (typeof CATEGORY_OPTIONS)[number],
    subcategory: SUBCATEGORY_MAP['Électronique'][0],
    description: '',
    imageSource: 'upload' as 'upload' | 'url',
    imageUrl: '',
    imageFile: null as File | null,
    inStock: true,
    dropshipping: false,
    stock: '',
  })

  // Paiements: configs
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentProviderConfig[]>(DEFAULT_PAYMENT_CONFIGS)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const [ov, recOrders, custs, prods, payCfg] = await Promise.all([
          api.getAdminOverview().catch(() => ({ monthRevenue: 0, ordersCount: 0, customersCount: 0, productsCount: 0 })),
          api.getRecentOrders().catch(() => []),
          api.getCustomers().catch(() => []),
          api.getProducts().catch(() => []),
          api.getPaymentConfigs().catch(() => []),
        ])
        if (!mounted) return
        setOverview(ov ?? { monthRevenue: 0, ordersCount: 0, customersCount: 0, productsCount: 0 })
        setOrders(Array.isArray(recOrders) ? recOrders : [])
        setCustomers(Array.isArray(custs) ? custs : [])
        setLocalProducts(Array.isArray(prods) ? prods : [])
        // Paiements: fusion avec defaults pour toujours voir les providers
        setPaymentConfigs(mergeWithDefaults(Array.isArray(payCfg) ? payCfg : []))
        setError(null)
      } catch (e: any) {
        setError(e?.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Stats calculées sur les données réelles (zéro par défaut)
  const totalRevenue = overview.monthRevenue ?? 0
  const totalOrders = overview.ordersCount ?? orders.length
  const totalCustomers = overview.customersCount ?? customers.length
  const totalProducts = overview.productsCount ?? products.length

  const stats = [
    { label: 'Revenus du mois', value: new Intl.NumberFormat('fr-CI').format(totalRevenue) + ' FCFA', icon: DollarSign, color: 'bg-green-100 text-green-600', trend: '' },
    { label: 'Commandes', value: (totalOrders || 0).toLocaleString(), icon: ShoppingBag, color: 'bg-blue-100 text-blue-600', trend: '' },
    { label: 'Clients', value: (totalCustomers || 0).toLocaleString(), icon: Users, color: 'bg-purple-100 text-purple-600', trend: '' },
    { label: 'Produits', value: (totalProducts || 0).toLocaleString(), icon: Package, color: 'bg-orange-100 text-orange-600', trend: '' },
  ]

  // Produits à stock faible (dynamique)
  const lowStockProducts = products
    .filter(p => (p.inStock ?? true) && (p.stock ?? 0) <= 10)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .slice(0, 4)
    .map(p => ({
      name: p.title,
      stock: p.stock ?? 0,
      status: (p.stock ?? 0) <= 5 ? 'critical' : 'warning',
    }))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return <Badge variant="success">Livré</Badge>
      case 'processing': return <Badge variant="info">Traitement</Badge>
      case 'shipped': return <Badge variant="warning">Expédié</Badge>
      case 'pending': return <Badge variant="warning">En attente</Badge>
      case 'cancelled': return <Badge variant="danger">Annulé</Badge>
      default: return <Badge>Inconnu</Badge>
    }
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('fr-CI').format(price) + ' FCFA'

  // Déconnexion admin (invalide le token local)
  const adminLogout = () => {
    localStorage.removeItem('adminAuthToken')
    window.location.reload()
  }

  // Rapport CSV
  const handleDownloadReportCSV = () => {
    const csvContent = [
      ['ID', 'Client', 'Date', 'Total', 'Statut'],
      ...orders.map(order => [
        order.id,
        order.customer,
        order.date,
        `${order.total} FCFA`,
        order.status,
      ]),
    ].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `monstoreci_rapport_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Rapport PDF
  const handleDownloadReportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const siteName = 'MonStore.CI'
    const title = 'Rapport des Commandes'
    const dateStr = new Date().toLocaleString('fr-CI')

    doc.setFont('helvetica', 'bold'); doc.setFontSize(18)
    doc.text(`${siteName} — ${title}`, 40, 40)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11)
    doc.text(`Généré le: ${dateStr}`, 40, 60)

    let y = 90
    doc.setFont('helvetica', 'bold')
    doc.text('ID', 40, y); doc.text('Client', 120, y); doc.text('Date', 260, y); doc.text('Total', 360, y); doc.text('Statut', 440, y)
    doc.setFont('helvetica', 'normal'); y += 12
    orders.forEach(order => {
      doc.text(order.id, 40, y)
      doc.text(order.customer, 120, y)
      doc.text(order.date, 260, y)
      doc.text(`${order.total} FCFA`, 360, y)
      doc.text(order.status, 440, y)
      y += 16
      if (y > 760) { doc.addPage(); y = 40 }
    })
    doc.save(`monstoreci_rapport_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price) return
    try {
      let finalImageUrl = newProduct.imageUrl || ''
      if (newProduct.imageSource === 'upload' && newProduct.imageFile) {
        const { url } = await api.uploadImage(newProduct.imageFile)
        finalImageUrl = url
      }
      const payload: Omit<Product, 'id'> = {
        title: newProduct.title,
        price: parseInt(newProduct.price, 10),
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        description: newProduct.description,
        image: finalImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        rating: 0,
        reviews: 0,
        dropshipping: newProduct.dropshipping,
        inStock: newProduct.dropshipping ? true : (parseInt(newProduct.stock || '0', 10) > 0),
        stock: newProduct.dropshipping ? undefined : (newProduct.stock ? parseInt(newProduct.stock, 10) : 0),
      }
      const created = await api.createProduct(payload)
      const createdProduct: Product = created.id ? created : { ...created, id: crypto.randomUUID() }
      setLocalProducts(prev => [createdProduct, ...prev])
      setProducts(prev => [createdProduct, ...prev])
      setNewProduct({
        title: '',
        price: '',
        category: 'Électronique',
        subcategory: SUBCATEGORY_MAP['Électronique'][0],
        description: '',
        imageSource: 'upload',
        imageUrl: '',
        imageFile: null,
        inStock: true,
        dropshipping: false,
        stock: '',
      })
      setShowAddProduct(false)
    } catch (e) {
      console.error(e)
      alert('Erreur lors de la création du produit.')
    }
  }

  // Suppression de produit
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      await api.deleteProduct(id)
      setLocalProducts(prev => prev.filter(p => p.id !== id))
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
      alert('Suppression échouée.')
    }
  }

  // Paiements: persistance immédiate du switch
  const handleToggleProvider = async (cfg: PaymentProviderConfig, enabled: boolean) => {
    const next = { ...cfg, enabled }
    // maj immédiate UI
    setPaymentConfigs(prev => prev.map(c => c.provider === cfg.provider ? next : c))
    try {
      await api.updatePaymentConfig(next)
    } catch (e) {
      console.error(e)
      alert('Erreur de mise à jour du statut du provider.')
    }
  }

  // Paiements: sauvegarde groupée des champs API
  const handleSavePaymentConfigs = async () => {
    try {
      for (const cfg of paymentConfigs) {
        await api.updatePaymentConfig(cfg)
      }
      alert('Configuration enregistrée.')
      // recharger depuis l’API pour refléter
      const latest = await api.getPaymentConfigs().catch(() => [])
      setPaymentConfigs(mergeWithDefaults(latest))
    } catch (e) {
      console.error(e)
      alert('Erreur lors de l’enregistrement de la configuration.')
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Bienvenue ! Voici un aperçu de votre boutique.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleDownloadReportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger CSV
            </Button>
            <Button variant="outline" onClick={handleDownloadReportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
            <AdminBulkImport onImported={(created) => {
              setLocalProducts(prev => [...created, ...prev])
              setProducts(prev => [...created, ...prev])
              alert(`${created.length} produits importés.`)
            }} />
            <Link to="/admin/images">
              <Button variant="outline">Bibliothèque d’images</Button>
            </Link>
            <Button variant="outline" onClick={adminLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter (Admin)
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  {stat.trend || '—'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Commandes Récentes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Commandes Récentes</h2>
              <button 
                onClick={() => setShowAllOrders(true)}
                className="text-sm text-[#FF6B00] hover:underline"
              >
                Voir tout
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(orders || []).slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-[#FF6B00]">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!orders || orders.length === 0) && (
                    <tr>
                      <td className="px-6 py-4 text-gray-500" colSpan={6}>Aucune commande récente</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Actions Rapides</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowAddProduct(true)}
                  className="w-full text-left px-4 py-3 rounded-md bg-[#FF6B00] hover:bg-[#e66000] text-white text-sm font-medium transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-3" /> Ajouter un produit
                </button>
                <button 
                  onClick={() => setShowManageCustomers(true)}
                  className="w-full text-left px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors flex items-center"
                >
                  <Users className="w-4 h-4 mr-3 text-gray-400" /> Gérer les clients
                </button>
                <button 
                  onClick={() => setShowPaymentSettings(true)}
                  className="w-full text-left px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors flex items-center"
                >
                  <Settings className="w-4 h-4 mr-3 text-gray-400" /> Configurer les paiements
                </button>
              </div>
            </div>

            {/* Liste Produits: suppression */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Produits</h2>
              {products.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun produit</p>
              ) : (
                <div className="space-y-3">
                  {products.slice(0, 8).map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-10 h-10 rounded border object-contain bg-gray-50" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.category}{p.subcategory ? ` • ${p.subcategory}` : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => handleDeleteProduct(p.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alertes Stock */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Alertes Stock
              </h2>
              <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucun produit en stock faible pour le moment</p>
                ) : (
                  lowStockProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${product.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-gray-600 truncate max-w-[150px]">{product.name}</span>
                      </div>
                      <span className={`font-bold ${product.status === 'critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {product.stock} restants
                      </span>
                    </div>
                  ))
                )}
              </div>
              <button className="w-full mt-4 text-center text-sm text-[#FF6B00] hover:underline">
                Gérer le stock →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAddProduct} onClose={() => setShowAddProduct(false)} title="Ajouter un produit" size="lg">
        <div className="space-y-4">
          <Input
            label="Nom du produit"
            placeholder="Ex: iPhone 15 Pro Max"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix (FCFA)"
              type="number"
              placeholder="850000"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newProduct.category}
                onChange={(e) => {
                  const cat = e.target.value as (typeof CATEGORY_OPTIONS)[number]
                  setNewProduct({ ...newProduct, category: cat, subcategory: SUBCATEGORY_MAP[cat][0] })
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
              >
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {/* Sous-catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sous-catégorie</label>
            <select
              value={newProduct.subcategory}
              onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
            >
              {SUBCATEGORY_MAP[newProduct.category].map(sc => <option key={sc} value={sc}>{sc}</option>)}
            </select>
          </div>

          {/* Source d'image: upload ou url */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={newProduct.imageSource === 'upload'}
                onChange={() => setNewProduct({ ...newProduct, imageSource: 'upload', imageUrl: '' })}
              />
              Téléverser une image
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={newProduct.imageSource === 'url'}
                onChange={() => setNewProduct({ ...newProduct, imageSource: 'url', imageFile: null })}
              />
              Utiliser une URL
            </label>
          </div>

          {newProduct.imageSource === 'upload' ? (
            <ImageUploader onFileSelected={(file) => setNewProduct({ ...newProduct, imageFile: file })} />
          ) : (
            <Input
              label="URL de l'image"
              placeholder="https://..."
              value={newProduct.imageUrl}
              onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            />
          )}

          <Textarea
            label="Description"
            placeholder="Description du produit..."
            rows={3}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newProduct.dropshipping}
                onChange={(e) => setNewProduct({ ...newProduct, dropshipping: e.target.checked })}
              />
              Dropshipping
            </label>
            {!newProduct.dropshipping && (
              <>
                <Input
                  label="Stock initial"
                  type="number"
                  placeholder="50"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                  />
                  En stock
                </label>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddProduct(false)}>Annuler</Button>
            <Button onClick={handleAddProduct}>Ajouter le produit</Button>
          </div>
        </div>
      </Modal>

      {/* Manage Customers Modal */}
      <Modal isOpen={showManageCustomers} onClose={() => setShowManageCustomers(false)} title="Gestion des clients" size="xl">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Téléphone</th>
                  <th className="px-4 py-3 text-left">Commandes</th>
                  <th className="px-4 py-3 text-left">Total dépensé</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(customers || []).map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">{customer.name}</td>
                    <td className="px-4 py-3 text-gray-500">{customer.email}</td>
                    <td className="px-4 py-3 text-gray-500">{customer.phone}</td>
                    <td className="px-4 py-3">{customer.orders}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-blue-500"><Eye className="w-4 h-4" /></button>
                        <button className="text-gray-400 hover:text-[#FF6B00]"><Edit className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!customers || customers.length === 0) && (
                  <tr>
                    <td className="px-4 py-3 text-gray-500" colSpan={6}>Aucun client</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Payment Settings Modal */}
      <Modal isOpen={showPaymentSettings} onClose={() => setShowPaymentSettings(false)} title="Configuration des paiements" size="lg">
        <div className="space-y-6">
          <p className="text-sm text-gray-600">Configurez vos méthodes de paiement Mobile Money pour la Côte d'Ivoire.</p>

          {paymentConfigs.map(cfg => (
            <div key={cfg.provider} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  cfg.provider === 'wave' ? 'bg-blue-500' :
                  cfg.provider === 'om' ? 'bg-orange-500' :
                  cfg.provider === 'mtn' ? 'bg-yellow-400' :
                  'bg-blue-800'
                }`}>
                  {cfg.provider.toUpperCase().charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {cfg.provider === 'wave' ? 'Wave' :
                     cfg.provider === 'om' ? 'Orange Money' :
                     cfg.provider === 'mtn' ? 'MTN Money' : 'Moov Money'}
                  </p>
                  <p className="text-xs text-gray-500">Paiement mobile</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!cfg.enabled}
                  onChange={(e) => handleToggleProvider(cfg, e.target.checked)}
                />
                <span className="ml-2 text-sm">{cfg.enabled ? 'Activé' : 'Désactivé'}</span>
              </label>
            </div>
          ))}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Clés API</h4>
            <p className="text-xs text-gray-500 mb-3">Entrez vos clés API pour activer les paiements en production.</p>
            {paymentConfigs.map(cfg => (
              <div key={`${cfg.provider}-keys`} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Input
                  label={`API Key (${cfg.provider})`}
                  value={cfg.apiKey ?? ''}
                  onChange={(e) => setPaymentConfigs(prev => prev.map(c => c.provider === cfg.provider ? { ...c, apiKey: e.target.value } : c))}
                />
                <Input
                  label={`API Secret (${cfg.provider})`}
                  value={cfg.apiSecret ?? ''}
                  onChange={(e) => setPaymentConfigs(prev => prev.map(c => c.provider === cfg.provider ? { ...c, apiSecret: e.target.value } : c))}
                />
                <Input
                  label={`Callback URL (${cfg.provider})`}
                  value={cfg.callbackUrl ?? ''}
                  onChange={(e) => setPaymentConfigs(prev => prev.map(c => c.provider === cfg.provider ? { ...c, callbackUrl: e.target.value } : c))}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowPaymentSettings(false)}>Annuler</Button>
            <Button onClick={handleSavePaymentConfigs}>Enregistrer</Button>
          </div>
        </div>
      </Modal>

      {/* All Orders Modal */}
      <Modal isOpen={showAllOrders} onClose={() => setShowAllOrders(false)} title="Toutes les commandes" size="xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Articles</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3 text-gray-500">{order.date}</td>
                  <td className="px-4 py-3">{(order as any).items ?? '-'}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-blue-500"><Eye className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-[#FF6B00]"><Edit className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td className="px-4 py-3 text-gray-500" colSpan={7}>Aucune commande</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>
      {/* Admin: Inscriptions & Demandes vendeurs */}
<div className="max-w-7xl mx-auto mt-8">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <AdminUsersTable />
    <AdminSellerApplications />
    <AdminContactMessages />
  </div>
</div>
    </div>
  )
}