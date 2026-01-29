import React from 'react'
import { Link } from 'react-router-dom'
import { AccountSidebar } from '../components/AccountSidebar'
import { Breadcrumb } from '../components/Breadcrumb'
import { OrderCard } from '../components/OrderCard'
import { useApp } from '../context/AppContext'
import { Package } from 'lucide-react'
import { Button } from '../components/ui/Button'
export function OrderHistoryPage() {
  const { orders, isAuthenticated } = useApp()
  const breadcrumbItems = [
    { label: 'Mon Compte', href: '/account' },
    { label: 'Mes Commandes' }
  ]
  // Filter orders for current user (in a real app, this would be done on the backend)
  const userOrders = orders
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Mes Commandes</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>
          
          <div className="lg:col-span-3">
            {userOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
                <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande.</p>
                <Link to="/shop">
                  <Button>Commencer mes achats</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}