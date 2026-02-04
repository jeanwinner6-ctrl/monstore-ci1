import type {
  AdminOverview,
  Order,
  Customer,
  Product,
  PaymentProviderConfig,
  User,
  SellerApplication,
  SellerProfile,
  ContactMessage,
} from '../types';

const API_BASE: string = import.meta.env.VITE_API_BASE ?? 'https://api.monstore.ci';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  getAdminOverview: () => http<AdminOverview>('/admin/overview'),
  getRecentOrders: () => http<Order[]>('/admin/orders/recent'),
  getCustomers: () => http<Customer[]>('/admin/customers'),
  getProducts: () => http<Product[]>('/admin/products'),
  createProduct: (payload: Omit<Product, 'id'>) =>
    http<Product>('/admin/products', { method: 'POST', body: JSON.stringify(payload) }),
  deleteProduct: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  },

  // Upload fichier -> Cloudinary
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  // AJOUT: upload miroir par URL distante -> Cloudinary
  uploadImageByUrl: (sourceUrl: string) =>
    http<{ url: string }>('/upload/url', { method: 'POST', body: JSON.stringify({ sourceUrl }) }),

  getPaymentConfigs: () => http<PaymentProviderConfig[]>('/admin/payments/config'),
  updatePaymentConfig: (cfg: PaymentProviderConfig) =>
    http<PaymentProviderConfig>('/admin/payments/config', { method: 'PUT', body: JSON.stringify(cfg) }),

  // Auth / Users
  register: (payload: { firstName: string; lastName: string; email: string; phone: string; password: string }) =>
    http<User>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getUsers: () => http<User[]>('/admin/users'),

  // Seller applications
  applySeller: (payload: { userId: string; fullName: string; email: string; phone: string; shopName: string; categories: string; message: string }) =>
    http<SellerApplication>('/seller/apply', { method: 'POST', body: JSON.stringify(payload) }),
  getSellerApplications: () => http<SellerApplication[]>('/admin/sellers/applications'),
  updateSellerApplication: (id: string, status: SellerApplication['status']) =>
    http<SellerApplication>(`/admin/sellers/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  approveSellerApplication: (id: string) =>
    http<SellerProfile>(`/admin/sellers/applications/${id}/approve`, { method: 'POST' }),

  // Seller space
  getSellerProfile: (sellerId: string) => http<SellerProfile>(`/seller/profile/${sellerId}`),
  getSellerProducts: (sellerId: string) => http<Product[]>(`/seller/${sellerId}/products`),
  createSellerProduct: (sellerId: string, payload: Omit<Product, 'id'>) =>
    http<Product>(`/seller/${sellerId}/products`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteSellerProduct: (sellerId: string, productId: string) =>
    fetch(`${API_BASE}/seller/${sellerId}/products/${productId}`, { method: 'DELETE' }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    }),

  // AJOUT: bulk import produits
  bulkCreateProducts: (items: Omit<Product, 'id'>[]) =>
    http<Product[]>('/admin/products/bulk', { method: 'POST', body: JSON.stringify({ items }) }),

  // AJOUT: mise à jour d’image produit
  updateProductImage: (productId: string, imageUrl: string) =>
    http<Product>(`/admin/products/${productId}`, { method: 'PUT', body: JSON.stringify({ image: imageUrl }) }),

  // Contact messages
  sendContactMessage: (payload: { name: string; email: string; phone?: string; subject: string; message: string }) =>
    http<ContactMessage>('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  getContactMessages: () => http<ContactMessage[]>('/admin/messages'),
  markContactMessageRead: (id: string) =>
    http<ContactMessage>(`/admin/messages/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'read' }) }),
  // AJOUT: supprimer un message de contact
  deleteContactMessage: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/messages/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    try { await res.json() } catch {}
  },

  // AJOUT: supprimer une demande vendeur
  deleteSellerApplication: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/sellers/applications/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    try { await res.json() } catch {}
  },
};