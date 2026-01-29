import React, { useState } from 'react'
import { Users, ShoppingBag, DollarSign, Package, TrendingUp, Download, Plus, Settings, AlertTriangle, Eye, Edit, Trash2, X, Search } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { Textarea } from '../components/ui/Textarea'
import { useApp } from '../context/AppContext'

export function AdminDashboard() {
  const { products, setProducts, orders, customers } = useApp()
  
  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showManageCustomers, setShowManageCustomers] = useState(false)
  const [showPaymentSettings, setShowPaymentSettings] = useState(false)
  const [showAllOrders, setShowAllOrders] = useState(false)
  
  // New product form (ajout du champ stock)
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: 'Électronique',
    description: '',
    image: '',
    inStock: true,
    stock: ''  // ← ajouté
  })

  // Stats calculation
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalCustomers = customers.length
  const totalProducts = products.length

  const stats = [
    {
      label: 'Revenus du mois',
      value: new Intl.NumberFormat('fr-CI').format(totalRevenue) + ' FCFA',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      trend: '+12%'
    },
    {
      label: 'Commandes',
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
      trend: '+8%'
    },
    {
      label: 'Clients',
      value: totalCustomers.toLocaleString(),
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      trend: '+15%'
    },
    {
      label: 'Produits',
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: 'bg-orange-100 text-orange-600',
      trend: '+3%'
    },
  ]

  // Low stock products → version dynamique (remplace la liste statique)
  const lowStockProducts = products
    .filter(product => product.inStock && (product.stock ?? 10) <= 10)
    .sort((a, b) => (a.stock ?? 10) - (b.stock ?? 10))
    .slice(0, 4)
    .map(product => ({
      name: product.title,
      stock: product.stock ?? 0,
      status: (product.stock ?? 0) <= 5 ? 'critical' : 'warning'
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

  const handleDownloadReport = () => {
    const csvContent = [
      ['ID', 'Client', 'Date', 'Total', 'Statut'],
      ...orders.map(order => [
        order.id,
        order.customer,
        order.date,
        order.total + ' FCFA',
        order.status
      ])
    ].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rapport_monstore_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price) return
    const product = {
      id: String(products.length + 1),
      title: newProduct.title,
      price: parseInt(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      rating: 4.5,
      reviews: 0,
      inStock: newProduct.inStock,
      stock: newProduct.stock ? parseInt(newProduct.stock) : 50  // ← ajouté
    }
    setProducts([...products, product])
    setNewProduct({ 
      title: '', 
      price: '', 
      category: 'Électronique', 
      description: '', 
      image: '', 
      inStock: true,
      stock: ''  // reset
    })
    setShowAddProduct(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI').format(price) + ' FCFA'
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
          <Button onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger le rapport
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
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
                  {orders.slice(0, 5).map((order) => (
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
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

            {/* Stock Alerts – maintenant dynamique */}
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
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          product.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-gray-600 truncate max-w-[150px]">{product.name}</span>
                      </div>
                      <span className={`font-bold ${
                        product.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
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
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
              >
                <option>Électronique</option>
                <option>Mode</option>
                <option>Maison</option>
                <option>Beauté & Santé</option>
                <option>Sports</option>
              </select>
            </div>
          </div>
          <Input
            label="URL de l'image"
            placeholder="https://..."
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Description du produit..."
            rows={3}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={newProduct.inStock}
              onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
              className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">En stock</label>
          </div>

          {/* Champ stock ajouté ici */}
          <Input
            label="Stock initial"
            type="number"
            placeholder="50"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddProduct(false)}>Annuler</Button>
            <Button onClick={handleAddProduct}>Ajouter le produit</Button>
          </div>
        </div>
      </Modal>

      {/* Les autres modals restent inchangés */}
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
                {customers.map((customer) => (
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
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Payment Settings Modal */}
      <Modal isOpen={showPaymentSettings} onClose={() => setShowPaymentSettings(false)} title="Configuration des paiements" size="lg">
        <div className="space-y-6">
          <p className="text-sm text-gray-600">Configurez vos méthodes de paiement Mobile Money pour la Côte d'Ivoire.</p>
          
          {[
            { name: 'Wave', color: 'bg-blue-500', enabled: true },
            { name: 'Orange Money', color: 'bg-orange-500', enabled: true },
            { name: 'MTN Money', color: 'bg-yellow-400', enabled: true },
            { name: 'Moov Money', color: 'bg-blue-800', enabled: false },
          ].map((provider) => (
            <div key={provider.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${provider.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {provider.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{provider.name}</p>
                  <p className="text-xs text-gray-500">Paiement mobile</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={provider.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF6B00] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
              </label>
            </div>
          ))}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Clés API</h4>
            <p className="text-xs text-gray-500 mb-3">Entrez vos clés API pour activer les paiements en production.</p>
            <Input label="Clé API Wave" placeholder="wv_live_..." className="mb-3" />
            <Input label="Clé API Orange Money" placeholder="om_live_..." />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowPaymentSettings(false)}>Annuler</Button>
            <Button onClick={() => setShowPaymentSettings(false)}>Enregistrer</Button>
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
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3 text-gray-500">{order.date}</td>
                  <td className="px-4 py-3">{order.items}</td>
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
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  )
}