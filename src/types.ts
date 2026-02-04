export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  commune: string;
  quartier: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: Address[];
  // Nouveau: statut vendeur
  isSeller?: boolean;
  sellerId?: string;
  sellerShopName?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  discount?: number;
  inStock?: boolean;
  description?: string;
  specs?: Record<string, string>;
  dropshipping?: boolean;
  stock?: number;
}

export type CartItem = Product & { quantity: number };

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
  items?: number;
}

export interface AdminOverview {
  monthRevenue: number;
  ordersCount: number;
  customersCount: number;
  productsCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  totalSpent: number;
}

export interface PaymentProviderConfig {
  provider: 'wave' | 'om' | 'mtn' | 'moov';
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  callbackUrl?: string;
}

/* Demandes vendeurs liées à un utilisateur inscrit */
export interface SellerApplication {
  id: string;
  userId: string;            // ← lien vers l’utilisateur inscrit
  fullName?: string;
  contactName?: string;
  shopName?: string;
  companyName?: string;
  email: string;
  phone: string;
  city?: string;
  category?: string;
  categories?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

/* Profil vendeur */
export interface SellerProfile {
  id: string;
  userId: string;
  shopName: string;
  phone: string;
  email?: string;
  fullName?: string;
  createdAt: string;
}

/* Messages contact */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read';
}