import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Product } from '../types'
import { Button } from '../components/ui/Button'
import { ImageUploader } from '../components/ui/ImageUploader'
import { Input } from '../components/ui/Input'
import { CheckSquare, Square } from 'lucide-react'

export function AdminImageLibrary() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [urlById, setUrlById] = useState<Record<string, string>>({})

  useEffect(() => {
    (async () => {
      try {
        const list = await api.getProducts()
        setProducts(Array.isArray(list) ? list : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const toggleSelect = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const replaceWithFile = async (id: string, file: File) => {
    const { url } = await api.uploadImage(file)
    const updated = await api.updateProductImage(id, url)
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
  }

  const replaceWithUrl = async (id: string) => {
    const raw = (urlById[id] || '').trim()
    if (!raw) return
    try {
      const mirrored = await api.uploadImageByUrl(raw)
      const updated = await api.updateProductImage(id, mirrored.url)
      setProducts(prev => prev.map(p => p.id === id ? updated : p))
      setUrlById(prev => ({ ...prev, [id]: '' }))
    } catch (e) {
      alert('Upload par URL échoué.')
    }
  }

  const mirrorSelectedToCloudinary = async () => {
    const ids = Object.keys(selected).filter(id => selected[id])
    if (ids.length === 0) return
    for (const id of ids) {
      const p = products.find(x => x.id === id)
      if (!p || !p.image) continue
      if (p.image.includes('res.cloudinary.com')) continue
      try {
        const mirrored = await api.uploadImageByUrl(p.image)
        const updated = await api.updateProductImage(id, mirrored.url)
        setProducts(prev => prev.map(px => px.id === id ? updated : px))
      } catch (e) {
        console.warn('Mirror échoué pour', id)
      }
    }
    alert('Miroir Cloudinary effectué pour la sélection.')
  }

  if (loading) return <div className="p-6">Chargement…</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bibliothèque d’images</h1>
        <Button variant="outline" onClick={mirrorSelectedToCloudinary}>
          Miroir Cloudinary (sélection)
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-gray-600">Aucun produit.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleSelect(p.id)} className="text-gray-600">
                    {selected[p.id] ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                  <div>
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.category}{p.subcategory ? ` • ${p.subcategory}` : ''}</p>
                  </div>
                </div>
              </div>

              <img src={p.image} alt={p.title} className="w-full h-40 object-contain bg-gray-50 border rounded mt-3" />

              <div className="mt-3 space-y-2">
                {/* Remplacer par fichier */}
                <div>
                  <p className="text-xs text-gray-600 mb-1">Remplacer via fichier</p>
                  {/* Assure-toi que ImageUploader appelle onFileSelected(file: File | null) */}
                  <ImageUploader
                    onFileSelected={(f: File | null) => {
                      if (f) replaceWithFile(p.id, f)
                    }}
                  />
                  {/* Alternative si ImageUploader pose problème:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null
                      if (f) replaceWithFile(p.id, f)
                    }}
                  />
                  */}
                </div>

                {/* Remplacer par URL (miroir Cloudinary) */}
                <div>
                  <p className="text-xs text-gray-600 mb-1">Remplacer via URL (miroir)</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      value={urlById[p.id] || ''}
                      onChange={(e) => setUrlById(prev => ({ ...prev, [p.id]: e.target.value }))}
                    />
                    <Button variant="outline" onClick={() => replaceWithUrl(p.id)}>Remplacer</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}