import React, { useEffect, useState } from 'react'
import type { SellerApplication } from '../../types'
import { api } from '../../services/api'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Trash2 } from 'lucide-react'

export function AdminSellerApplications() {
  const [apps, setApps] = useState<SellerApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getSellerApplications().catch(() => [])
        setApps(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const setStatus = async (id: string, status: SellerApplication['status']) => {
    const saved = await api.updateSellerApplication(id, status)
    setApps(prev => prev.map(a => a.id === id ? saved : a))
  }

  const deleteApplication = async (id: string) => {
    if (!confirm('Supprimer cette demande vendeur ?')) return
    await api.deleteSellerApplication(id)
    setApps(prev => prev.filter(a => a.id !== id))
  }

  const approve = async (id: string) => {
    try {
      const profile = await api.approveSellerApplication(id)
      alert(`Vendeur approuvé. ID boutique: ${profile.id}`)
      const data = await api.getSellerApplications().catch(() => [])
      setApps(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
      alert('Approvisionnement vendeur impossible.')
    }
  } // ← fermeture correcte de la fonction

  const statusBadge = (status: SellerApplication['status']) => {
    if (status === 'approved') return <Badge variant="success">Approuvée</Badge>
    if (status === 'rejected') return <Badge variant="danger">Rejetée</Badge>
    return <Badge variant="warning">En attente</Badge>
  }

  if (loading) return <div>Chargement…</div>

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-bold mb-4">Demandes Vendeurs</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Entreprise</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id} className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium">{a.companyName || a.shopName || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{a.contactName || a.fullName || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{a.phone}</td>
                <td className="px-4 py-3 text-gray-500">{a.email}</td>
                <td className="px-4 py-3">{statusBadge(a.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => approve(a.id)}>Approuver</Button>
                    <Button variant="outline" onClick={() => setStatus(a.id, 'rejected')}>Rejeter</Button>
                    <Button variant="outline" onClick={() => deleteApplication(a.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr><td className="px-4 py-3 text-gray-500" colSpan={6}>Aucune demande</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}