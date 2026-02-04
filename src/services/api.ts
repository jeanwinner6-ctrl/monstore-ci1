// API Configuration
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

// HTTP helper function
async function http<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    // Handle CSV responses
    if (response.headers.get('content-type')?.includes('text/csv')) {
      return response.text() as unknown as T;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ===== TYPES =====

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image: string;
  category: string;
  subcategory?: string;
  discount?: number;
  isNew?: boolean;
  inStock: boolean;
  description?: string;
  images?: string[];
  specs?: Record<string, string>;
  stock?: number;
  createdAt?: string;
  // sourceUrl is NEVER included in public API responses
}

export type BulkProductInput = Omit<Product, 'id' | 'createdAt'>;

export interface UploadResponse {
  url: string;
}

export interface SourcingData {
  id: string;
  title: string;
  sourceUrl: string;
  category: string;
  subcategory: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  products?: any[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isSeller?: boolean;
  sellerId?: string;
}

export interface PaymentConfig {
  provider: string;
  enabled: boolean;
  [key: string]: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read';
  createdAt: string;
}

export interface SellerApplication {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  userId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  userId?: string;
  createdAt: string;
}

export interface SellerProduct extends Product {
  sellerId: string;
}

export interface DeleteResponse {
  deleted: boolean;
  id: string;
}

// ===== IMAGE UPLOAD API =====

export const imageAPI = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  uploadFromUrl: async (sourceUrl: string): Promise<UploadResponse> => {
    return http<UploadResponse>('/upload/url', {
      method: 'POST',
      body: JSON.stringify({ sourceUrl }),
    });
  },
};

// ===== PRODUCTS API =====

export const productsAPI = {
  list: async (): Promise<Product[]> => {
    return http<Product[]>('/admin/products');
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    return http<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  bulkCreate: async (products: BulkProductInput[]): Promise<Product[]> => {
    return http<Product[]>('/admin/products/bulk', {
      method: 'POST',
      body: JSON.stringify(products),
    });
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    return http<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string): Promise<DeleteResponse> => {
    return http<DeleteResponse>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Sourcing endpoints (admin-only, includes sourceUrl)
  getSourcing: async (): Promise<SourcingData[]> => {
    return http<SourcingData[]>('/admin/products/sourcing');
  },

  getSourcingCSV: async (): Promise<string> => {
    return http<string>('/admin/products/sourcing.csv');
  },
};

// ===== ADMIN DATA API =====

export const adminAPI = {
  getCustomers: async (): Promise<Customer[]> => {
    return http<Customer[]>('/admin/customers');
  },

  getRecentOrders: async (): Promise<Order[]> => {
    return http<Order[]>('/admin/orders/recent');
  },

  getUsers: async (): Promise<User[]> => {
    return http<User[]>('/admin/users');
  },

  getPaymentConfig: async (): Promise<Record<string, PaymentConfig>> => {
    return http<Record<string, PaymentConfig>>('/admin/payments/config');
  },

  updatePaymentConfig: async (config: PaymentConfig): Promise<PaymentConfig> => {
    return http<PaymentConfig>('/admin/payments/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  },
};

// ===== CONTACT MESSAGES API =====

export const messagesAPI = {
  create: async (message: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> => {
    return http<ContactMessage>('/contact', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  list: async (): Promise<ContactMessage[]> => {
    return http<ContactMessage[]>('/admin/messages');
  },

  update: async (id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> => {
    return http<ContactMessage>(`/admin/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string): Promise<DeleteResponse> => {
    return http<DeleteResponse>(`/admin/messages/${id}`, {
      method: 'DELETE',
    });
  },
};

// ===== SELLER APPLICATIONS API =====

export const sellerApplicationsAPI = {
  list: async (): Promise<SellerApplication[]> => {
    return http<SellerApplication[]>('/admin/sellers/applications');
  },

  update: async (id: string, updates: Partial<SellerApplication>): Promise<SellerApplication> => {
    return http<SellerApplication>(`/admin/sellers/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  approve: async (id: string, data?: any): Promise<{ application: SellerApplication; seller: Seller }> => {
    return http<{ application: SellerApplication; seller: Seller }>(
      `/admin/sellers/applications/${id}/approve`,
      {
        method: 'POST',
        body: JSON.stringify(data || {}),
      }
    );
  },

  delete: async (id: string): Promise<DeleteResponse> => {
    return http<DeleteResponse>(`/admin/sellers/applications/${id}`, {
      method: 'DELETE',
    });
  },
};

// ===== SELLER SPACE API =====

export const sellerAPI = {
  getProfile: async (sellerId: string): Promise<Seller> => {
    return http<Seller>(`/seller/profile/${sellerId}`);
  },

  getProducts: async (sellerId: string): Promise<SellerProduct[]> => {
    return http<SellerProduct[]>(`/seller/${sellerId}/products`);
  },

  createProduct: async (sellerId: string, product: Partial<SellerProduct>): Promise<SellerProduct> => {
    return http<SellerProduct>(`/seller/${sellerId}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  deleteProduct: async (sellerId: string, productId: string): Promise<DeleteResponse> => {
    return http<DeleteResponse>(`/seller/${sellerId}/products/${productId}`, {
      method: 'DELETE',
    });
  },
};

// Default export with all APIs
export default {
  image: imageAPI,
  products: productsAPI,
  admin: adminAPI,
  messages: messagesAPI,
  sellerApplications: sellerApplicationsAPI,
  seller: sellerAPI,
};
