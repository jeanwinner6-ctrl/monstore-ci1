import React, { useEffect, useState } from 'react'
import type { ContactMessage } from '../../types'
import { api } from '../../services/api'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Trash2 } from 'lucide-react'

export function AdminContactMessages() {
  const [msgs, setMsgs] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getContactMessages().catch(() => [])
        setMsgs(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const markRead = async (id: string) => {
    const saved = await api.markContactMessageRead(id)
    setMsgs(prev => prev.map(m => m.id === id ? saved : m))
  }

  // AJOUT: suppression message
  const deleteMessage = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return
    await api.deleteContactMessage(id)
    setMsgs(prev => prev.filter(m => m.id !== id))
  }

  if (loading) return <div>Chargement…</div>

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-bold mb-4">Messages de Contact</h2>
      <div className="space-y-3">
        {msgs.map(m => (
          <div key={m.id} className="border rounded p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">
                {m.subject} — <span className="text-gray-600">{m.name} ({m.email})</span>
              </p>
              <p className="text-sm text-gray-700 mt-1">{m.message}</p>
              <p className="text-xs text-gray-500 mt-1">Reçu: {new Date(m.createdAt).toLocaleString('fr-CI')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={m.status === 'new' ? 'warning' : 'info'}>
                {m.status === 'new' ? 'Nouveau' : 'Lu'}
              </Badge>
              {m.status === 'new' && (
                <Button variant="outline" onClick={() => markRead(m.id)}>Marquer comme lu</Button>
              )}
              {/* AJOUT: bouton supprimer */}
              <Button variant="outline" onClick={() => deleteMessage(m.id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        ))}
        {msgs.length === 0 && <p className="text-sm text-gray-500">Aucun message</p>}
      </div>
    </div>
  )
}