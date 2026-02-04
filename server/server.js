const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const PORT = 3001
const DATA_PATH = path.join(__dirname, 'data.json')

// CORS dev
app.use(cors({ origin: ['http://localhost:5173'], credentials: false }))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// Cloudinary optionnel (fallback si absent)
let cloudinaryAvailable = false
let cloudinary
try {
  cloudinary = require('cloudinary').v2
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    })
    cloudinaryAvailable = true
    console.log('Cloudinary activé')
  } else {
    console.warn('Cloudinary: clés manquantes, placeholders utilisés.')
  }
} catch (e) {
  console.warn('Cloudinary non installé, placeholders utilisés:', e.message)
}

function readData() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(
      DATA_PATH,
      JSON.stringify({
        products: [], orders: [], customers: [], payments: [],
        sellerApplications: [], contactMessages: [], users: [],
        sellers: [], sellerProducts: {},
      }, null, 2)
    )
  }
  const db = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  db.products ||= []
  db.orders ||= []
  db.customers ||= []
  db.payments ||= []
  db.sellerApplications ||= []
  db.contactMessages ||= []
  db.users ||= []
  db.sellers ||= []
  db.sellerProducts ||= {}
  return db
}
function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

/* Overview */
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

/* Products — filtrer sourceUrl des réponses publiques */
app.get('/admin/products', (req, res) => {
  const db = readData()
  const sanitized = (db.products || []).map(({ sourceUrl, ...rest }) => rest)
  res.json(sanitized)
})
app.post('/admin/products', (req, res) => {
  const db = readData()
  const payload = req.body || {}
  const id = uuidv4()
  const product = { id, ...payload } // conserve sourceUrl en base si présent
  db.products = [product, ...(db.products || [])]
  writeData(db)
  const { sourceUrl, ...sanitized } = product
  res.status(201).json(sanitized)
})
app.delete('/admin/products/:id', (req, res) => {
  const db = readData()
  const id = req.params.id
  db.products = (db.products || []).filter(p => String(p.id) !== String(id))
  writeData(db)
  res.status(204).end()
})
app.post('/admin/products/bulk', (req, res) => {
  const db = readData()
  const items = Array.isArray((req.body || {}).items) ? req.body.items : []
  if (items.length === 0) return res.status(400).json({ error: 'items requis (array)' })
  const created = items.map((payload) => ({ id: uuidv4(), ...payload })) // garde sourceUrl
  db.products = [...created, ...(db.products || [])]
  writeData(db)
  const sanitized = created.map(({ sourceUrl, ...rest }) => rest)
  res.status(201).json(sanitized)
})
app.put('/admin/products/:id', (req, res) => {
  const db = readData()
  const id = req.params.id
  const updates = req.body || {}
  const idx = (db.products || []).findIndex(p => String(p.id) === String(id))
  if (idx === -1) return res.status(404).json({ error: 'Produit introuvable' })
  db.products[idx] = { ...db.products[idx], ...updates } // peut mettre à jour sourceUrl
  writeData(db)
  const { sourceUrl, ...sanitized } = db.products[idx]
  res.json(sanitized)
})

/* Admin-only: consulter/exporter les liens fournisseur (sourceUrl) */
app.get('/admin/products/sourcing', (req, res) => {
  const db = readData()
  const data = (db.products || []).map(p => ({
    id: p.id,
    title: p.title,
    sourceUrl: p.sourceUrl || '',
    category: p.category || '',
    subcategory: p.subcategory || '',
    createdAt: p.createdAt || '',
  }))
  res.json(data)
})
app.get('/admin/products/sourcing.csv', (req, res) => {
  const db = readData()
  const rows = (db.products || []).map(p => ({
    id: p.id,
    title: p.title || '',
    sourceUrl: p.sourceUrl || '',
    category: p.category || '',
    subcategory: p.subcategory || '',
  }))
  const header = 'id,title,sourceUrl,category,subcategory'
  const body = rows.map(r =>
    [r.id, `"${r.title.replace(/"/g,'""')}"`, r.sourceUrl, r.category, r.subcategory].join(',')
  ).join('\n')
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="sourcing.csv"')
  res.status(200).send(`${header}\n${body}`)
})

/* Customers, Orders, Users */
app.get('/admin/customers', (req, res) => {
  const db = readData()
  res.json(db.customers || [])
})
app.get('/admin/orders/recent', (req, res) => {
  const db = readData()
  const orders = (db.orders || []).slice(0, 20)
  res.json(orders)
})
app.get('/admin/users', (req, res) => {
  const db = readData()
  res.json(db.users || [])
})

/* Payments config */
app.get('/admin/payments/config', (req, res) => {
  const db = readData()
  const defaults = [
    { provider: 'wave', enabled: true },
    { provider: 'om', enabled: true },
    { provider: 'mtn', enabled: true },
    { provider: 'moov', enabled: false },
  ]
  const byProvider = new Map()
  defaults.forEach(c => byProvider.set(c.provider, c))
  ;(db.payments || []).forEach(c => byProvider.set(c.provider, { ...(byProvider.get(c.provider) || {}), ...c }))
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

/* Upload (Cloudinary si dispo, sinon fallback) */
const upload = multer({ storage: multer.memoryStorage() })
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file manquant' })
    if (cloudinaryAvailable) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => (error ? reject(error) : resolve(result))
        )
        stream.end(req.file.buffer)
      })
      return res.status(201).json({ url: result.secure_url })
    }
    const url = `https://placehold.co/600x400?text=Uploaded+${Date.now()}`
    res.status(201).json({ url })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Upload échoué' })
  }
})
app.post('/upload/url', async (req, res) => {
  try {
    const { sourceUrl } = req.body || {}
    if (!sourceUrl) return res.status(400).json({ error: 'sourceUrl manquant' })
    if (cloudinaryAvailable) {
      const result = await cloudinary.uploader.upload(sourceUrl, { folder: 'products' })
      return res.status(201).json({ url: result.secure_url })
    }
    return res.status(201).json({ url: sourceUrl })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Upload par URL échoué' })
  }
})

/* Seller applications + Approve -> créer profil vendeur */
app.post('/seller/apply', (req, res) => {
  const db = readData()
  const { userId, fullName, email, phone, shopName, categories, message } = req.body || {}
  if (!shopName || (!userId && !fullName)) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }
  const id = uuidv4()
  const submittedAt = new Date().toISOString()
  const appItem = {
    id, userId: userId || '', fullName: fullName || '', email: email || '',
    phone: phone || '', shopName, categories: categories || '', message: message || '',
    status: 'pending', submittedAt
  }
  db.sellerApplications = [appItem, ...(db.sellerApplications || [])]
  writeData(db)
  res.status(201).json(appItem)
})
app.get('/admin/sellers/applications', (req, res) => {
  const db = readData()
  res.json(db.sellerApplications || [])
})
app.put('/admin/sellers/applications/:id', (req, res) => {
  const db = readData()
  const { id } = req.params
  const { status } = req.body || {}
  const valid = ['pending', 'approved', 'rejected']
  if (!valid.includes(status)) return res.status(400).json({ error: 'Statut invalide' })
  const idx = (db.sellerApplications || []).findIndex(a => a.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Demande introuvable' })
  db.sellerApplications[idx] = { ...db.sellerApplications[idx], status }
  writeData(db)
  res.json(db.sellerApplications[idx])
})
app.post('/admin/sellers/applications/:id/approve', (req, res) => {
  const db = readData()
  const { id } = req.params
  const idx = (db.sellerApplications || []).findIndex(a => a.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Demande introuvable' })
  const appItem = db.sellerApplications[idx]
  db.sellerApplications[idx] = { ...appItem, status: 'approved' }
  const sellerId = uuidv4()
  const profile = {
    id: sellerId,
    userId: appItem.userId || '',
    fullName: appItem.fullName || '',
    shopName: appItem.shopName || 'Boutique',
    phone: appItem.phone || '',
    email: appItem.email || '',
    createdAt: new Date().toISOString(),
  }
  db.sellers = [profile, ...(db.sellers || [])]
  db.sellerProducts[sellerId] = db.sellerProducts[sellerId] || []
  const uidx = (db.users || []).findIndex(u => u.id === appItem.userId)
  if (uidx !== -1) {
    db.users[uidx] = { ...db.users[uidx], isSeller: true, sellerId, sellerShopName: profile.shopName }
  }
  writeData(db)
  res.status(201).json(profile)
})

/* Seller space APIs */
app.get('/seller/profile/:sellerId', (req, res) => {
  const db = readData()
  const profile = (db.sellers || []).find(s => s.id === req.params.sellerId)
  if (!profile) return res.status(404).json({ error: 'Vendeur introuvable' })
  res.json(profile)
})
app.get('/seller/:sellerId/products', (req, res) => {
  const db = readData()
  res.json(db.sellerProducts[req.params.sellerId] || [])
})
app.post('/seller/:sellerId/products', (req, res) => {
  const db = readData()
  const sellerId = req.params.sellerId
  const payload = req.body || {}
  const product = { id: uuidv4(), ...payload }
  db.sellerProducts[sellerId] = [product, ...(db.sellerProducts[sellerId] || [])]
  writeData(db)
  res.status(201).json(product)
})
app.delete('/seller/:sellerId/products/:productId', (req, res) => {
  const db = readData()
  const { sellerId, productId } = req.params
  db.sellerProducts[sellerId] = (db.sellerProducts[sellerId] || []).filter(p => String(p.id) !== String(productId))
  writeData(db)
  res.status(204).end()
})

/* Contact messages */
app.post('/contact', (req, res) => {
  const db = readData()
  const { name, email, phone, subject, message } = req.body || {}
  if (!name || !email || !subject || !message) return res.status(400).json({ error: 'Champs requis' })
  const item = { id: uuidv4(), name, email, phone: phone || '', subject, message, createdAt: new Date().toISOString(), status: 'new' }
  db.contactMessages = [item, ...(db.contactMessages || [])]
  writeData(db)
  res.status(201).json(item)
})
app.get('/admin/messages', (req, res) => {
  const db = readData()
  res.json(db.contactMessages || [])
})
app.put('/admin/messages/:id', (req, res) => {
  const db = readData()
  const { id } = req.params
  const idx = (db.contactMessages || []).findIndex(m => m.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Message introuvable' })
  const status = (req.body || {}).status
  db.contactMessages[idx] = { ...db.contactMessages[idx], status: status === 'read' ? 'read' : 'new' }
  writeData(db)
  res.json(db.contactMessages[idx])
})
app.delete('/admin/messages/:id', (req, res) => {
  const db = readData()
  const { id } = req.params
  const before = (db.contactMessages || []).length
  db.contactMessages = (db.contactMessages || []).filter(m => String(m.id) !== String(id))
  writeData(db)
  const deleted = (db.contactMessages || []).length < before
  res.status(200).json({ deleted, id })
})

/* Supprimer demande vendeur */
app.delete('/admin/sellers/applications/:id', (req, res) => {
  const db = readData()
  const { id } = req.params
  const before = (db.sellerApplications || []).length
  db.sellerApplications = (db.sellerApplications || []).filter(a => String(a.id) !== String(id))
  writeData(db)
  const deleted = (db.sellerApplications || []).length < before
  res.status(200).json({ deleted, id })
})

app.listen(PORT, () => {
  console.log(`API MonStore.CI dev running on http://localhost:${PORT}`)
})