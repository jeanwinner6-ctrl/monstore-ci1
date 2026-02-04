import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, CartItem, User, Order, Customer } from '../types'
import { api } from '../services/api'

interface AppContextType {
  // Products
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  getProductById: (id: string) => Product | undefined
  
  // Cart
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  updateQuantity: (id: string, delta: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartCount: number
  isCartOpen: boolean
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>
  
  // Wishlist
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  
  // User
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  
  // Orders
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  
  // Customers (Admin)
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  
  // Search
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  searchResults: Product[]
  isAdminAuthenticated: boolean
  authenticateAdmin: (password: string) => boolean
}
const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  // Products (réel)
  const [products, setProducts] = useState<Product[]>([])
  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>([])
  // User
  const [user, setUser] = useState<User | null>(null)
  // Orders (réel)
  const [orders, setOrders] = useState<Order[]>([])
  // Customers (réel)
  const [customers, setCustomers] = useState<Customer[]>([])
  // Search
  const [searchQuery, setSearchQuery] = useState('')

  // Protection admin (mot de passe simple client-side)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const authenticateAdmin = (password: string): boolean => {
    const ADMIN_PASSWORD = "monstore"  // ← à personnaliser
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true)
      localStorage.setItem("adminAuthToken", "true") // persistance simple
      return true
    }
    return false
  }
  // Restauration session admin
  useEffect(() => {
    if (localStorage.getItem("adminAuthToken") === "true") {
      setIsAdminAuthenticated(true)
    }
  }, [])

  // Load initial real data (products, orders, customers) from API
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [prods, recOrders, custs] = await Promise.all([
          api.getProducts().catch(() => []),
          api.getRecentOrders().catch(() => []),
          api.getCustomers().catch(() => []),
        ])
        if (!mounted) return
        setProducts(Array.isArray(prods) ? prods : [])
        setOrders(Array.isArray(recOrders) ? recOrders : [])
        setCustomers(Array.isArray(custs) ? custs : [])
      } catch (e) {
        // rester à 0 si erreur
      }
    })()
    return () => { mounted = false }
  }, [])

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('monstore_cart')
    const savedWishlist = localStorage.getItem('monstore_wishlist')
    const savedUser = localStorage.getItem('monstore_user')
    
    if (savedCart) setCartItems(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('monstore_cart', JSON.stringify(cartItems))
  }, [cartItems])
  useEffect(() => {
    localStorage.setItem('monstore_wishlist', JSON.stringify(wishlist))
  }, [wishlist])
  useEffect(() => {
    if (user) {
      localStorage.setItem('monstore_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('monstore_user')
    }
  }, [user])

  // Product functions
  const getProductById = (id: string) => products.find(p => p.id === id)
  // Cart functions
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }
  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }
  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }
  const clearCart = () => setCartItems([])
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Wishlist functions
  const addToWishlist = (product: Product) => {
    if (!wishlist.find(p => p.id === product.id)) {
      setWishlist(prev => [...prev, product])
    }
  }
  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p.id !== id))
  }
  const isInWishlist = (id: string) => wishlist.some(p => p.id === id)

  // Auth functions (demo)
  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUser: User = {
      id: 'u1',
      firstName: 'Jean',
      lastName: 'Kouassi',
      email: email,
      phone: '07 07 00 00 00',
      addresses: [
        {
          id: 'a1',
          label: 'Maison',
          firstName: 'Jean',
          lastName: 'Kouassi',
          phone: '07 07 00 00 00',
          city: 'Abidjan',
          commune: 'Cocody',
          quartier: 'Angré 8ème Tranche',
          isDefault: true
        }
      ]
    }
    setUser(mockUser)
    return true
  }
  const logout = () => {
    setUser(null)
    localStorage.removeItem('monstore_user')
  }

  // Search
  const searchResults = searchQuery.length >= 2
    ? products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <AppContext.Provider value={{
      products,
      setProducts,
      getProductById,
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      user,
      setUser,
      isAuthenticated: !!user,
      login,
      logout,
      orders,
      setOrders,
      customers,
      setCustomers,
      searchQuery,
      setSearchQuery,
      searchResults,
      isAdminAuthenticated,
      authenticateAdmin,
    }}>
      {children}
    </AppContext.Provider>
  )
}
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}