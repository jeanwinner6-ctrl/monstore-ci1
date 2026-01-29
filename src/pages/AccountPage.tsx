import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountSidebar } from '../components/AccountSidebar'
import { Breadcrumb } from '../components/Breadcrumb'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Tabs } from '../components/ui/Tabs'
import { useApp } from '../context/AppContext'
import { LogOut, Plus, Trash2, Edit } from 'lucide-react'
export function AccountPage() {
  const navigate = useNavigate()
  const { user, setUser, logout } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  })
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      })
    }
    setIsEditing(false)
  }
  const ProfileForm = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#FF6B00] flex items-center justify-center text-white font-bold text-2xl">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{user?.firstName} {user?.lastName}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Prénom" 
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          disabled={!isEditing}
        />
        <Input 
          label="Nom" 
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          disabled={!isEditing}
        />
        <Input 
          label="Email" 
          value={user?.email || ''} 
          disabled 
        />
        <Input 
          label="Téléphone" 
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={!isEditing}
        />
      </div>
      
      {isEditing && (
        <div className="flex gap-3">
          <Button onClick={handleSave}>Enregistrer</Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
        </div>
      )}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
        <div className="space-y-4 max-w-md">
          <Input label="Mot de passe actuel" type="password" />
          <Input label="Nouveau mot de passe" type="password" />
          <Input label="Confirmer le nouveau mot de passe" type="password" />
          <Button>Mettre à jour le mot de passe</Button>
        </div>
      </div>
      <div className="pt-6 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center text-red-600 hover:text-red-700 font-medium"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Se déconnecter
        </button>
      </div>
    </div>
  )
  const AddressesList = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user?.addresses.map((address) => (
          <div 
            key={address.id}
            className={`border rounded-lg p-4 relative ${
              address.isDefault ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200'
            }`}
          >
            {address.isDefault && (
              <span className="absolute top-4 right-4 text-xs font-bold text-[#FF6B00] bg-white px-2 py-1 rounded-full border border-orange-100">
                Par défaut
              </span>
            )}
            <h4 className="font-bold text-gray-900 mb-2">{address.label}</h4>
            <p className="text-sm text-gray-600">{address.firstName} {address.lastName}</p>
            <p className="text-sm text-gray-600">{address.phone}</p>
            <p className="text-sm text-gray-600">{address.commune}, {address.quartier}</p>
            <p className="text-sm text-gray-600">{address.city}, Côte d'Ivoire</p>
            <div className="mt-4 flex gap-3">
              <button className="text-sm font-medium text-gray-600 hover:text-[#FF6B00]">
                <Edit className="w-4 h-4 inline mr-1" />
                Modifier
              </button>
              {!address.isDefault && (
                <button className="text-sm font-medium text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
        
        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[200px] hover:border-[#FF6B00] hover:bg-gray-50 transition-colors cursor-pointer border-dashed">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-sm font-medium text-gray-600">Ajouter une adresse</span>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Mon Compte' }]} />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Mon Profil</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <Tabs
                tabs={[
                  { id: 'profile', label: 'Informations Personnelles', content: <ProfileForm /> },
                  { id: 'addresses', label: 'Carnet d\'adresses', content: <AddressesList /> },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}