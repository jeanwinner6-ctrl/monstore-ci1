import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Cloudinary if credentials are present
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✓ Cloudinary configured');
} else {
  console.log('⚠ Cloudinary not configured - using fallback URLs');
}

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Helper functions for data persistence
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Initialize missing arrays/maps
    return {
      products: parsed.products || [],
      customers: parsed.customers || [],
      orders: parsed.orders || [],
      users: parsed.users || [],
      paymentConfig: parsed.paymentConfig || [],
      messages: parsed.messages || [],
      sellerApplications: parsed.sellerApplications || [],
      sellers: parsed.sellers || [],
      sellerProducts: parsed.sellerProducts || {},
    };
  } catch (error) {
    // If file doesn't exist or is invalid, return default structure
    return {
      products: [],
      customers: [],
      orders: [],
      users: [],
      paymentConfig: [],
      messages: [],
      sellerApplications: [],
      sellers: [],
      sellerProducts: {},
    };
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Remove sourceUrl from product object for public API responses
function sanitizeProduct(product) {
  const { sourceUrl, ...rest } = product;
  return rest;
}

// ===== IMAGE UPLOAD ENDPOINTS =====

// POST /upload - Upload file to Cloudinary or return placeholder
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'monstore' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      res.json({ url: result.secure_url });
    } else {
      // Fallback: return placeholder URL
      res.json({ url: 'https://via.placeholder.com/600x400?text=Image+Upload' });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// POST /upload/url - Mirror remote image URL to Cloudinary
app.post('/upload/url', async (req, res) => {
  try {
    const { sourceUrl } = req.body;
    if (!sourceUrl) {
      return res.status(400).json({ error: 'No sourceUrl provided' });
    }

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary from URL
      const result = await cloudinary.uploader.upload(sourceUrl, {
        folder: 'monstore',
      });
      res.json({ url: result.secure_url });
    } else {
      // Fallback: return the original sourceUrl
      res.json({ url: sourceUrl });
    }
  } catch (error) {
    console.error('URL upload error:', error);
    res.status(500).json({ error: 'URL upload failed' });
  }
});

// ===== PRODUCTS ENDPOINTS =====

// GET /admin/products - List all products WITHOUT sourceUrl
app.get('/admin/products', async (req, res) => {
  try {
    const data = await readData();
    const sanitized = data.products.map(sanitizeProduct);
    res.json(sanitized);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /admin/products - Create a product (store sourceUrl internally, omit from response)
app.post('/admin/products', async (req, res) => {
  try {
    const data = await readData();
    const product = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    data.products.push(product);
    await writeData(data);
    
    res.status(201).json(sanitizeProduct(product));
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// POST /admin/products/bulk - Bulk create products
app.post('/admin/products/bulk', async (req, res) => {
  try {
    const data = await readData();
    const products = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Expected an array of products' });
    }

    const createdProducts = products.map(p => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...p,
    }));

    data.products.push(...createdProducts);
    await writeData(data);

    res.status(201).json(createdProducts.map(sanitizeProduct));
  } catch (error) {
    console.error('Error bulk creating products:', error);
    res.status(500).json({ error: 'Failed to bulk create products' });
  }
});

// PUT /admin/products/:id - Update a product
app.put('/admin/products/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    data.products[index] = { ...data.products[index], ...req.body };
    await writeData(data);

    res.json(sanitizeProduct(data.products[index]));
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /admin/products/:id - Delete a product
app.delete('/admin/products/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    data.products.splice(index, 1);
    await writeData(data);

    res.json({ deleted: true, id: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ===== VENDOR SOURCING ENDPOINTS (Admin-only) =====

// GET /admin/products/sourcing - Return sourcing data with sourceUrl
app.get('/admin/products/sourcing', async (req, res) => {
  try {
    const data = await readData();
    const sourcing = data.products.map(p => ({
      id: p.id,
      title: p.title,
      sourceUrl: p.sourceUrl || '',
      category: p.category || '',
      subcategory: p.subcategory || '',
      createdAt: p.createdAt || '',
    }));
    res.json(sourcing);
  } catch (error) {
    console.error('Error fetching sourcing data:', error);
    res.status(500).json({ error: 'Failed to fetch sourcing data' });
  }
});

// GET /admin/products/sourcing.csv - Export sourcing data as CSV
app.get('/admin/products/sourcing.csv', async (req, res) => {
  try {
    const data = await readData();
    const headers = ['ID', 'Title', 'Source URL', 'Category', 'Subcategory', 'Created At'];
    const rows = data.products.map(p => [
      p.id,
      p.title || '',
      p.sourceUrl || '',
      p.category || '',
      p.subcategory || '',
      p.createdAt || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sourcing.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting sourcing CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// ===== ADMIN DATA ENDPOINTS =====

// GET /admin/customers
app.get('/admin/customers', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /admin/orders/recent - Get recent orders (limit ~20)
app.get('/admin/orders/recent', async (req, res) => {
  try {
    const data = await readData();
    const recent = data.orders.slice(-20).reverse();
    res.json(recent);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});

// GET /admin/users
app.get('/admin/users', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /admin/payments/config - Get payment config merged with defaults
app.get('/admin/payments/config', async (req, res) => {
  try {
    const data = await readData();
    const defaults = {
      stripe: { enabled: false, publicKey: '', secretKey: '' },
      paypal: { enabled: false, clientId: '', secret: '' },
      cashOnDelivery: { enabled: true },
    };

    // Merge with stored config
    const merged = { ...defaults };
    data.paymentConfig.forEach(config => {
      merged[config.provider] = { ...merged[config.provider], ...config };
    });

    res.json(merged);
  } catch (error) {
    console.error('Error fetching payment config:', error);
    res.status(500).json({ error: 'Failed to fetch payment config' });
  }
});

// PUT /admin/payments/config - Upsert payment config by provider
app.put('/admin/payments/config', async (req, res) => {
  try {
    const data = await readData();
    const { provider, ...config } = req.body;

    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }

    const index = data.paymentConfig.findIndex(c => c.provider === provider);
    const newConfig = { provider, ...config };

    if (index === -1) {
      data.paymentConfig.push(newConfig);
    } else {
      data.paymentConfig[index] = newConfig;
    }

    await writeData(data);
    res.json(newConfig);
  } catch (error) {
    console.error('Error updating payment config:', error);
    res.status(500).json({ error: 'Failed to update payment config' });
  }
});

// ===== CONTACT MESSAGES ENDPOINTS =====

// POST /contact - Create a contact message
app.post('/contact', async (req, res) => {
  try {
    const data = await readData();
    const message = {
      id: Date.now().toString(),
      status: 'new',
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    data.messages.push(message);
    await writeData(data);
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// GET /admin/messages - List all messages
app.get('/admin/messages', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PUT /admin/messages/:id - Update message status
app.put('/admin/messages/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.messages.findIndex(m => m.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    data.messages[index] = { ...data.messages[index], ...req.body };
    await writeData(data);

    res.json(data.messages[index]);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE /admin/messages/:id - Delete a message
app.delete('/admin/messages/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.messages.findIndex(m => m.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    data.messages.splice(index, 1);
    await writeData(data);

    res.json({ deleted: true, id: req.params.id });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ===== SELLER APPLICATIONS ENDPOINTS =====

// GET /admin/sellers/applications - List all applications
app.get('/admin/sellers/applications', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.sellerApplications);
  } catch (error) {
    console.error('Error fetching seller applications:', error);
    res.status(500).json({ error: 'Failed to fetch seller applications' });
  }
});

// PUT /admin/sellers/applications/:id - Update application status
app.put('/admin/sellers/applications/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.sellerApplications.findIndex(a => a.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    data.sellerApplications[index] = { ...data.sellerApplications[index], ...req.body };
    await writeData(data);

    res.json(data.sellerApplications[index]);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// POST /admin/sellers/applications/:id/approve - Approve application
app.post('/admin/sellers/applications/:id/approve', async (req, res) => {
  try {
    const data = await readData();
    const appIndex = data.sellerApplications.findIndex(a => a.id === req.params.id);
    
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = data.sellerApplications[appIndex];
    
    // Set status to approved
    application.status = 'approved';
    application.approvedAt = new Date().toISOString();

    // Create seller profile
    const seller = {
      id: Date.now().toString(),
      name: application.businessName || application.name,
      email: application.email,
      userId: application.userId,
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    data.sellers.push(seller);

    // Initialize seller products array
    data.sellerProducts[seller.id] = [];

    // If user exists, mark as seller
    if (application.userId) {
      const userIndex = data.users.findIndex(u => u.id === application.userId);
      if (userIndex !== -1) {
        data.users[userIndex].isSeller = true;
        data.users[userIndex].sellerId = seller.id;
      }
    }

    await writeData(data);

    res.json({ application, seller });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ error: 'Failed to approve application' });
  }
});

// DELETE /admin/sellers/applications/:id - Delete application
app.delete('/admin/sellers/applications/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.sellerApplications.findIndex(a => a.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    data.sellerApplications.splice(index, 1);
    await writeData(data);

    res.json({ deleted: true, id: req.params.id });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// ===== SELLER SPACE ENDPOINTS =====

// GET /seller/profile/:sellerId - Get seller profile
app.get('/seller/profile/:sellerId', async (req, res) => {
  try {
    const data = await readData();
    const seller = data.sellers.find(s => s.id === req.params.sellerId);
    
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    res.json(seller);
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    res.status(500).json({ error: 'Failed to fetch seller profile' });
  }
});

// GET /seller/:sellerId/products - Get seller products
app.get('/seller/:sellerId/products', async (req, res) => {
  try {
    const data = await readData();
    const products = data.sellerProducts[req.params.sellerId] || [];
    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ error: 'Failed to fetch seller products' });
  }
});

// POST /seller/:sellerId/products - Create seller product
app.post('/seller/:sellerId/products', async (req, res) => {
  try {
    const data = await readData();
    
    if (!data.sellerProducts[req.params.sellerId]) {
      data.sellerProducts[req.params.sellerId] = [];
    }

    const product = {
      id: Date.now().toString(),
      sellerId: req.params.sellerId,
      createdAt: new Date().toISOString(),
      ...req.body,
    };

    data.sellerProducts[req.params.sellerId].push(product);
    await writeData(data);

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating seller product:', error);
    res.status(500).json({ error: 'Failed to create seller product' });
  }
});

// DELETE /seller/:sellerId/products/:productId - Delete seller product
app.delete('/seller/:sellerId/products/:productId', async (req, res) => {
  try {
    const data = await readData();
    const products = data.sellerProducts[req.params.sellerId] || [];
    const index = products.findIndex(p => p.id === req.params.productId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products.splice(index, 1);
    await writeData(data);

    res.json({ deleted: true, id: req.params.productId });
  } catch (error) {
    console.error('Error deleting seller product:', error);
    res.status(500).json({ error: 'Failed to delete seller product' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
