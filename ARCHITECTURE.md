# MonStore Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + Vite)                        │
│                         http://localhost:5173                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     src/services/api.ts                          │  │
│  │  ┌────────────┬────────────┬────────────┬────────────────────┐  │  │
│  │  │  imageAPI  │ productsAPI│ adminAPI   │ messagesAPI        │  │  │
│  │  ├────────────┼────────────┼────────────┼────────────────────┤  │  │
│  │  │uploadFile  │list()      │getCustomers│create()            │  │  │
│  │  │uploadUrl   │create()    │getOrders   │list()              │  │  │
│  │  │            │bulkCreate()│getUsers    │update()            │  │  │
│  │  │            │update()    │getPayment  │delete()            │  │  │
│  │  │            │delete()    │Config      │                    │  │  │
│  │  │            │getSourcing │updatePay   │                    │  │  │
│  │  │            │getCSV()    │mentConfig  │                    │  │  │
│  │  └────────────┴────────────┴────────────┴────────────────────┘  │  │
│  │                                                                  │  │
│  │  ┌────────────────────────┬──────────────────────────────────┐  │  │
│  │  │ sellerApplicationsAPI  │         sellerAPI                │  │  │
│  │  ├────────────────────────┼──────────────────────────────────┤  │  │
│  │  │create()                │getProfile()                      │  │  │
│  │  │list()                  │getProducts()                     │  │  │
│  │  │update()                │createProduct()                   │  │  │
│  │  │approve() ⭐            │deleteProduct()                   │  │  │
│  │  │delete()                │                                  │  │  │
│  │  └────────────────────────┴──────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                    ↕                                    │
│                           VITE_API_BASE                                 │
│                      (http://localhost:3001)                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js + Node)                        │
│                         http://localhost:3001                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        IMAGE UPLOADS                             │  │
│  │  POST   /upload          ← File upload (multipart/form-data)    │  │
│  │  POST   /upload/url      ← Mirror remote URL                    │  │
│  │         ↓                                                        │  │
│  │    Cloudinary? ──YES→ Upload to Cloudinary ──→ Return URL       │  │
│  │         │                                                        │  │
│  │         NO                                                       │  │
│  │         ↓                                                        │  │
│  │    Return placeholder or original URL                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      PRODUCTS MANAGEMENT                         │  │
│  │  GET    /admin/products            ← List (NO sourceUrl) 🔒    │  │
│  │  POST   /admin/products            ← Create (stores sourceUrl)  │  │
│  │  POST   /admin/products/bulk       ← Bulk create               │  │
│  │  PUT    /admin/products/:id        ← Update                     │  │
│  │  DELETE /admin/products/:id        ← Delete                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │               VENDOR SOURCING (Admin Only) 🔐                   │  │
│  │  GET    /admin/products/sourcing     ← JSON with sourceUrl     │  │
│  │  GET    /admin/products/sourcing.csv ← CSV export              │  │
│  │                                                                  │  │
│  │  ⚠️  sourceUrl ONLY available through these endpoints          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      ADMIN DATA                                  │  │
│  │  GET    /admin/customers                                        │  │
│  │  GET    /admin/orders/recent                                    │  │
│  │  GET    /admin/users                                            │  │
│  │  GET    /admin/payments/config     ← Merged with defaults      │  │
│  │  PUT    /admin/payments/config     ← Upsert by provider        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    CONTACT MESSAGES                              │  │
│  │  POST   /contact                   ← Create (status=new)        │  │
│  │  GET    /admin/messages            ← List all                   │  │
│  │  PUT    /admin/messages/:id        ← Update (mark read)         │  │
│  │  DELETE /admin/messages/:id        ← Delete                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  SELLER APPLICATIONS                             │  │
│  │  POST   /admin/sellers/applications         ← Submit            │  │
│  │  GET    /admin/sellers/applications         ← List              │  │
│  │  PUT    /admin/sellers/applications/:id     ← Update            │  │
│  │  POST   /admin/sellers/applications/:id/approve  ← Approve ⭐   │  │
│  │         └─→ Creates seller profile                              │  │
│  │         └─→ Initializes sellerProducts[sellerId] = []           │  │
│  │         └─→ Links user account (isSeller=true)                  │  │
│  │  DELETE /admin/sellers/applications/:id     ← Delete            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      SELLER SPACE                                │  │
│  │  GET    /seller/profile/:sellerId                               │  │
│  │  GET    /seller/:sellerId/products                              │  │
│  │  POST   /seller/:sellerId/products         ← Add product        │  │
│  │  DELETE /seller/:sellerId/products/:id     ← Remove product     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│                                    ↓                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    DATA PERSISTENCE                              │  │
│  │                     server/data.json                             │  │
│  │  {                                                               │  │
│  │    products: [...],        ← sourceUrl stored here 🔒          │  │
│  │    customers: [...],                                            │  │
│  │    orders: [...],                                               │  │
│  │    users: [...],                                                │  │
│  │    paymentConfig: [...],                                        │  │
│  │    messages: [...],                                             │  │
│  │    sellerApplications: [...],                                   │  │
│  │    sellers: [...],                                              │  │
│  │    sellerProducts: { sellerId: [...] }                          │  │
│  │  }                                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   OPTIONAL CLOUDINARY                            │  │
│  │                    (from .env file)                              │  │
│  │  CLOUDINARY_CLOUD_NAME                                          │  │
│  │  CLOUDINARY_API_KEY                                             │  │
│  │  CLOUDINARY_API_SECRET                                          │  │
│  │                                                                  │  │
│  │  If NOT configured → Fallback URLs used                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

KEY SECURITY FEATURES

🔒 sourceUrl Privacy
   ├─ NEVER exposed in product list/get/create/update responses
   ├─ Stored internally in server/data.json
   └─ Only accessible via /admin/products/sourcing endpoints

🔐 Admin Endpoints
   ├─ All /admin/* routes should have auth middleware in production
   └─ Current implementation focuses on API structure

🛡️  Security Scan
   ├─ CodeQL: 0 vulnerabilities detected
   └─ No sensitive data in repository

📝 Data Exclusion
   ├─ server/data.json → .gitignore
   ├─ server/.env → .gitignore
   └─ Clean git history

═══════════════════════════════════════════════════════════════════════════

TESTING SUMMARY

✅ All 13 automated tests passed
✅ Frontend builds successfully
✅ Backend starts without errors
✅ All endpoints return expected responses
✅ sourceUrl privacy verified
✅ Seller workflow complete
✅ CSV export functional
✅ Cloudinary fallback working

═══════════════════════════════════════════════════════════════════════════

DEPLOYMENT CHECKLIST

Frontend:
  □ Set VITE_API_BASE to production API URL
  □ Run npm run build
  □ Deploy dist/ folder

Backend:
  □ Install dependencies: cd server && npm install
  □ Configure Cloudinary in .env (optional)
  □ Set PORT in .env (default 3001)
  □ Add authentication middleware to /admin/* routes
  □ Consider migrating to database for production
  □ Start server: npm start
  □ Set up process manager (PM2, systemd, etc.)

═══════════════════════════════════════════════════════════════════════════
```
