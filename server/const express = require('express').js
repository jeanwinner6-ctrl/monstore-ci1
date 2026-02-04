const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3001
const DATA_PATH = path.join(__dirname, 'data.json')

app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

function readData() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({ products: [], orders: [], customers: [], payments: [] }, null, 2))
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
}
function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

// Overview
app.get('/admin/overview', (req, res) => {
  const db = readData()
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  const monthOrders = (db.orders || []).filter(o => {
    const d = new Date(o.date || new Date())
    return d.getMonth() === month && d.getFullYear() === year
  })
  const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  res.json({
    monthRevenue,
    ordersCount: (db.orders || []).length,
    customersCount: (db.customers || []).length,
    productsCount: (db.products || []).length,
  })
})

// Products
app.get('/admin/products', (req, res) => {
  const db = readData()
  res.json(db.products || [])
})
app.post('/admin/products', (req, res) => {
  const db = readData()
  const payload = req.body || {}
  const id = uuidv4()
  const product = { id, ...payload }
  db.products = [product, ...(db.products || [])]
  writeData(db)
  res.json(product)
})
app.delete('/admin/products/:id', (req, res) => {
  const db = readData()
  const id = req.params.id
  db.products = (db.products || []).filter(p => String(p.id) !== String(id))
  writeData(db)
  res.status(204).end()
})

// Customers
app.get('/admin/customers', (req, res) => {
  const db = readData()
  res.json(db.customers || [])
})

// Orders (récentes)
app.get('/admin/orders/recent', (req, res) => {
  const db = readData()
  const orders = (db.orders || []).slice(0, 20)
  res.json(orders)
})

// Paiements
app.get('/admin/payments/config', (req, res) => {
  const db = readData()
  // merge avec defaults si vide
  const defaults = [
    { provider: 'wave', enabled: true },
    { provider: 'om', enabled: true },
    { provider: 'mtn', enabled: true },
    { provider: 'moov', enabled: false },
  ]
  const byProvider = new Map()
  defaults.forEach(c => byProvider.set(c.provider, c))
  (db.payments || []).forEach(c => byProvider.set(c.provider, { ...(byProvider.get(c.provider) || {}), ...c }))
  res.json(Array.from(byProvider.values()))
})
app.put('/admin/payments/config', (req, res) => {
  const db = readData()
  const cfg = req.body
  if (!cfg || !cfg.provider) return res.status(400).json({ error: 'provider manquant' })
  const existing = (db.payments || [])
  const idx = existing.findIndex(c => c.provider === cfg.provider)
  if (idx >= 0) existing[idx] = { ...existing[idx], ...cfg }
  else existing.push(cfg)
  db.payments = existing
  writeData(db)
  res.json(cfg)
})

// Upload (mock de dev: renvoie une URL de placeholder)
const upload = multer({ storage: multer.memoryStorage() })
app.post('/upload', upload.single('file'), (req, res) => {
  // En prod, stocker le fichier (Cloudinary, S3, supabase storage, etc.) et renvoyer l'URL
  // Ici on renvoie une image placeholder avec un timestamp pour simuler
  const url = `https://placehold.co/600x400?text=Uploaded+${Date.now()}`
  res.json({ url })
})

app.listen(PORT, () => {
  console.log(`API MonStore.CI dev running on http://localhost:${PORT}`)
})