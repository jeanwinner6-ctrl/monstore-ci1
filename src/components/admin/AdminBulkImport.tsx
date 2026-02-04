import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { api } from '../../services/api'
import * as Papa from 'papaparse' // correction: import TS-friendly (npm i papaparse && npm i -D @types/papaparse)

type Props = {
  onImported: (created: any[]) => void
}

const IMAGE_FALLBACKS: Record<string, string> = {
  'Électronique': 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80&auto=format&fit=crop',
  'Mode': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80&auto=format&fit=crop',
  'Maison': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80&auto=format&fit=crop',
  'Beauté & Santé': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80&auto=format&fit=crop',
  'Sports': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop',
  'Électronique/Téléphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop',
  'Électronique/Accessoires': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop',
  'Maison/Éclairage': 'https://images.unsplash.com/photo-1504203700686-10c95b13b7e6?w=1200&q=80&auto=format&fit=crop',
  'Mode/Chaussures': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop',
}

function getFallbackImage(category: string, subcategory?: string): string {
  const key = subcategory ? `${category}/${subcategory}` : category
  return IMAGE_FALLBACKS[key] || IMAGE_FALLBACKS[category] || 'https://placehold.co/1200x800?text=Produit'
}

export function AdminBulkImport({ onImported }: Props) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [csvUrl, setCsvUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toItems = async (rows: any[]) => {
    // Miroir Cloudinary automatique si image fournie (URL), sinon fallback
    const items = await Promise.all(rows.map(async (r) => {
      const title = String(r.title || '').trim()
      const category = String(r.category || '').trim() || 'Électronique'
      const subcategory = String(r.subcategory || '').trim() || undefined
      const priceNum = parseInt(String(r.price || '0'), 10)
      const stockNum = r.stock ? parseInt(String(r.stock), 10) : undefined
      const dropshipping = String(r.dropshipping || '').toLowerCase() === 'true'
      const rawImage = String(r.image || '').trim()
      const sourceUrl = String(r.source_url || r.sourceUrl || r.vendor_url || '').trim() // nouveau champ

      let finalImage = rawImage
      if (rawImage) {
        try {
          const mirrored = await api.uploadImageByUrl(rawImage)
          if (mirrored?.url) finalImage = mirrored.url
        } catch (e) {
          console.warn('Mirror URL failed, fallback used', rawImage)
          finalImage = rawImage
        }
      } else {
        finalImage = getFallbackImage(category, subcategory)
      }

      return {
        title,
        price: isNaN(priceNum) ? 0 : priceNum,
        category,
        subcategory,
        description: String(r.description || '').trim() || '',
        image: finalImage,
        rating: 0,
        reviews: 0,
        dropshipping,
        inStock: dropshipping ? true : ((stockNum || 0) > 0),
        stock: dropshipping ? undefined : (stockNum || 0),
        sourceUrl, // transmis au backend, jamais affiché côté site
      }
    }))

    return items.filter(i => i.title && i.price > 0)
  }

  const importItems = async (items: any[]) => {
    if (items.length === 0) {
      setError('Aucune ligne valide à importer.')
      return
    }
    const created = await api.bulkCreateProducts(items)
    onImported(created)
    setOpen(false)
    setFile(null)
    setCsvUrl('')
  }

  const handleParseFile = async () => {
    setError(null)
    if (!file) { setError('Sélectionnez un fichier CSV.'); return }
    setLoading(true)
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: any) => {
          const rows = results.data as any[]
          const items = await toItems(rows)
          await importItems(items)
        },
        error: (err: any) => {
          console.error(err); setError('Parsing CSV échoué.')
        }
      })
    } catch (e) {
      console.error(e)
      setError('Import échoué. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const handleParseUrl = async () => {
    setError(null)
    if (!csvUrl) { setError('Collez l’URL CSV (Google Sheets publié).'); return }
    setLoading(true)
    try {
      const text = await fetch(csvUrl).then(r => r.text())
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: any) => {
          const rows = results.data as any[]
          const items = await toItems(rows)
          await importItems(items)
        },
        error: (err: any) => {
          console.error(err); setError('Parsing CSV (URL) échoué.')
        }
      })
    } catch (e) {
      console.error(e)
      setError('Chargement de l’URL CSV impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Importer des produits (CSV)</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Importer des produits (CSV / URL)" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Colonnes attendues: title, price, category, subcategory, description, image, stock, dropshipping, source_url (non affiché sur le site).
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fichier CSV</label>
            <input type="file" accept=".csv,text/csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button onClick={handleParseFile} isLoading={loading}>Importer depuis fichier</Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL CSV (Google Sheets publié)</label>
            <input
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
              value={csvUrl}
              onChange={(e) => setCsvUrl(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <Button variant="outline" onClick={handleParseUrl} isLoading={loading}>Importer depuis URL</Button>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Fermer</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}