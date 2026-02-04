import React, { useEffect, useState } from 'react'
import type { User } from '../../types'
import { api } from '../../services/api'

export function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getUsers().catch(() => [])
        setUsers(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div>Chargement…</div>

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-bold mb-4">Inscriptions (Utilisateurs)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{u.phone}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td className="px-4 py-3 text-gray-500" colSpan={3}>Aucun utilisateur</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}