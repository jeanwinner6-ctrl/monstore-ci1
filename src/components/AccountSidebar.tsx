import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, Package, MapPin, Heart, LogOut, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'
export function AccountSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, wishlist } = useApp()
  
  const isActive = (path: string) => location.pathname === path
  const menuItems = [
    { icon: User, label: 'Mon Profil', path: '/account' },
    { icon: Package, label: 'Mes Commandes', path: '/orders' },
    { icon: Heart, label: 'Liste de souhaits', path: '/wishlist', badge: wishlist.length },
  ]
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-[#FF6B00] flex items-center justify-center text-white font-bold text-xl">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors mb-1
              ${isActive(item.path) 
                ? 'bg-orange-50 text-[#FF6B00]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <span className="flex items-center">
              <item.icon className={`mr-3 h-5 w-5 ${isActive(item.path) ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
              {item.label}
            </span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors mt-2"
        >
          <LogOut className="mr-3 h-5 w-5 text-red-500" />
          Déconnexion
        </button>
      </nav>
    </div>
  )
}