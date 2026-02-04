# Backend API Integration Examples

This document provides examples of how to use the API service layer in your React components.

## Setup

1. Start the backend server:
```bash
cd server
npm install
npm start
```

2. Configure the frontend (optional):
```bash
# Create .env file in project root
VITE_API_BASE=http://localhost:3001
```

## Import the API

```typescript
import api from '../services/api';
// Or import specific services:
import { productsAPI, imageAPI, messagesAPI } from '../services/api';
```

## Product Management

### List Products
```typescript
const products = await api.products.list();
```

### Create Product
```typescript
const newProduct = await api.products.create({
  title: "New Product",
  price: 50000,
  category: "Electronics",
  image: "https://example.com/image.jpg",
  sourceUrl: "https://vendor.com/source", // Stored server-side only
  inStock: true,
  rating: 4.5,
  reviews: 10
});
```

### Bulk Create Products
```typescript
const products = await api.products.bulkCreate([
  { title: "Product 1", price: 10000, category: "Test", image: "...", inStock: true, rating: 4, reviews: 5 },
  { title: "Product 2", price: 20000, category: "Test", image: "...", inStock: true, rating: 5, reviews: 8 }
]);
```

### Update Product
```typescript
const updated = await api.products.update(productId, {
  price: 45000,
  image: "https://new-image.jpg"
});
```

### Delete Product
```typescript
const result = await api.products.delete(productId);
console.log(result); // { deleted: true, id: "..." }
```

## Vendor Sourcing (Admin Only)

### Get Sourcing Data
```typescript
const sourcing = await api.products.getSourcing();
// Returns: [{ id, title, sourceUrl, category, subcategory, createdAt }]
```

### Export Sourcing CSV
```typescript
const csv = await api.products.getSourcingCSV();
// Download the CSV
const blob = new Blob([csv], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'sourcing.csv';
a.click();
```

## Image Upload

### Upload File
```typescript
const file = event.target.files[0];
const result = await api.image.uploadFile(file);
console.log(result.url); // Cloudinary URL or fallback placeholder
```

### Mirror URL to Cloudinary
```typescript
const result = await api.image.uploadFromUrl("https://example.com/image.jpg");
console.log(result.url); // Cloudinary URL or original URL if not configured
```

## Contact Messages

### Create Message
```typescript
const message = await api.messages.create({
  name: "John Doe",
  email: "john@example.com",
  subject: "Question",
  message: "Hello, I have a question..."
});
```

### List Messages (Admin)
```typescript
const messages = await api.messages.list();
```

### Update Message Status
```typescript
const updated = await api.messages.update(messageId, { status: 'read' });
```

### Delete Message
```typescript
const result = await api.messages.delete(messageId);
```

## Seller Applications

### Create Application
```typescript
const application = await api.sellerApplications.create({
  name: "Jane Smith",
  email: "jane@example.com",
  businessName: "Jane's Store"
});
```

### List Applications
```typescript
const applications = await api.sellerApplications.list();
```

### Approve Application
```typescript
const result = await api.sellerApplications.approve(applicationId);
console.log(result.application); // Updated application
console.log(result.seller); // New seller profile
```

### Delete Application
```typescript
const result = await api.sellerApplications.delete(applicationId);
```

## Seller Management

### Get Seller Profile
```typescript
const seller = await api.seller.getProfile(sellerId);
```

### Get Seller Products
```typescript
const products = await api.seller.getProducts(sellerId);
```

### Create Seller Product
```typescript
const product = await api.seller.createProduct(sellerId, {
  title: "Seller Product",
  price: 25000,
  category: "Fashion",
  image: "https://example.com/product.jpg",
  inStock: true,
  rating: 4.7,
  reviews: 15
});
```

### Delete Seller Product
```typescript
const result = await api.seller.deleteProduct(sellerId, productId);
```

## Admin Data

### Get Customers
```typescript
const customers = await api.admin.getCustomers();
```

### Get Recent Orders
```typescript
const orders = await api.admin.getRecentOrders();
```

### Get Users
```typescript
const users = await api.admin.getUsers();
```

### Get Payment Config
```typescript
const config = await api.admin.getPaymentConfig();
console.log(config.stripe); // { enabled, publicKey, secretKey }
console.log(config.paypal); // { enabled, clientId, secret }
```

### Update Payment Config
```typescript
const updated = await api.admin.updatePaymentConfig({
  provider: "stripe",
  enabled: true,
  publicKey: "pk_live_...",
  secretKey: "sk_live_..."
});
```

## Error Handling

All API functions throw errors on failure. Use try-catch:

```typescript
try {
  const products = await api.products.list();
  setProducts(products);
} catch (error) {
  console.error('Failed to load products:', error);
  // Show error message to user
}
```

## React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products.list();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    
    try {
      await api.products.delete(id);
      await loadProducts(); // Reload list
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>Price: {product.price} FCFA</p>
          <button onClick={() => handleDelete(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Important Security Notes

1. **sourceUrl Privacy**: The `sourceUrl` field is NEVER returned in product list/get responses. It's only available through the admin sourcing endpoints.

2. **Admin Endpoints**: All `/admin/*` endpoints should be protected with authentication in production. This implementation focuses on the API structure - add authentication middleware as needed.

3. **Cloudinary**: If Cloudinary is not configured, image uploads return placeholder URLs. Configure Cloudinary credentials in `server/.env` for production use.

4. **Data Persistence**: All data is stored in `server/data.json`. For production, consider migrating to a proper database (MongoDB, PostgreSQL, etc.).
