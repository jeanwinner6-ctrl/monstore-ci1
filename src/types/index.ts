export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  subcategory?: string
  discount?: number
  isNew?: boolean
  inStock: boolean
  description?: string
  images?: string[]
  specs?: Record<string, string>
  stock?: number
  createdAt?: string
  // sourceUrl is stored server-side only and NEVER exposed in public APIs
  sourceUrl?: string
}
export interface CartItem extends Product {
  quantity: number
}
export interface Order {
  id: string
  customer: string
  date: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: number
  products?: CartItem[]
}
export type Category = {
  id: string
  name: string
  slug: string
  image?: string
  subcategories: string[]
}
export interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  phone: string
  city: string
  commune: string
  quartier: string
  isDefault: boolean
}
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
}
export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  helpful: number
  verified?: boolean
}