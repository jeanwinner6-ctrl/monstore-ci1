import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, CartItem, User, Order } from '../types'
// Sample Products Data - Extended with more subcategories
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max 256GB - Titane Naturel',
    price: 850000,
    originalPrice: 950000,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Électronique',
    subcategory: 'Téléphones',
    discount: 10,
    inStock: true,
    description: "L'iPhone 15 Pro Max est le premier iPhone doté d'un design en titane de qualité aérospatiale.",
    images: [
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    ],
    specs: { 'Écran': 'Super Retina XDR 6,7"', 'Processeur': 'A17 Pro', 'Stockage': '256GB' }
  },
  {
    id: '2',
    title: 'Samsung Galaxy S24 Ultra - Gris',
    price: 790000,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Électronique',
    subcategory: 'Téléphones',
    inStock: true,
    description: 'Le Samsung Galaxy S24 Ultra avec son écran Dynamic AMOLED 2X et son S Pen intégré.',
    specs: { 'Écran': 'Dynamic AMOLED 6,8"', 'Processeur': 'Snapdragon 8 Gen 3', 'RAM': '12GB' }
  },
  {
    id: '3',
    title: 'MacBook Air M2 13" - Minuit',
    price: 920000,
    originalPrice: 1100000,
    rating: 4.9,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Électronique',
    subcategory: 'Ordinateurs',
    discount: 16,
    inStock: true,
    description: 'MacBook Air avec puce M2, design ultra-fin et autonomie exceptionnelle.',
    specs: { 'Puce': 'Apple M2', 'RAM': '8GB', 'Stockage': '256GB SSD' }
  },
  {
    id: '4',
    title: "Nike Air Force 1 '07 - Blanc",
    price: 65000,
    rating: 4.6,
    reviews: 230,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Mode',
    subcategory: 'Chaussures',
    inStock: true,
    description: 'Les iconiques Nike Air Force 1, un classique intemporel.',
    specs: { 'Matière': 'Cuir', 'Semelle': 'Caoutchouc', 'Style': 'Lifestyle' }
  },
  {
    id: '5',
    title: "Robe d'été Florale - Collection 2024",
    price: 15000,
    originalPrice: 25000,
    rating: 4.3,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Mode',
    subcategory: 'Femmes',
    discount: 40,
    inStock: true,
    description: "Robe légère et élégante parfaite pour l'été ivoirien.",
    specs: { 'Matière': 'Coton', 'Tailles': 'S, M, L, XL', 'Motif': 'Floral' }
  },
  {
    id: '6',
    title: 'Canapé 3 Places Scandinave - Gris',
    price: 250000,
    rating: 4.5,
    reviews: 12,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Maison',
    subcategory: 'Meubles',
    inStock: true,
    description: 'Canapé confortable au design scandinave moderne.',
    specs: { 'Dimensions': '200x85x90cm', 'Matière': 'Tissu polyester', 'Places': '3' }
  },
  {
    id: '7',
    title: 'Machine à Café Nespresso',
    price: 85000,
    originalPrice: 120000,
    rating: 4.7,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Maison',
    subcategory: 'Cuisine',
    discount: 29,
    inStock: true,
    description: 'Machine à café Nespresso pour un expresso parfait à la maison.',
    specs: { 'Pression': '19 bars', 'Réservoir': '1L', 'Temps de chauffe': '25s' }
  },
  {
    id: '8',
    title: 'Montre Connectée SmartWatch Pro',
    price: 35000,
    rating: 4.2,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Électronique',
    subcategory: 'Accessoires',
    inStock: true,
    description: 'Montre connectée avec suivi fitness et notifications.',
    specs: { 'Écran': 'AMOLED 1,4"', 'Autonomie': '7 jours', 'Étanchéité': 'IP68' }
  },
  {
    id: '9',
    title: 'Kit de Maquillage Professionnel',
    price: 45000,
    rating: 4.8,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1522335789203-abd652327216?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Beauté & Santé',
    subcategory: 'Maquillage',
    inStock: true,
    description: 'Kit complet de maquillage professionnel avec 50 pièces.',
    specs: { 'Pièces': '50', 'Inclus': 'Pinceaux, palettes, rouges à lèvres', 'Qualité': 'Professionnelle' }
  },
  {
    id: '10',
    title: 'PlayStation 5 Édition Standard',
    price: 450000,
    originalPrice: 500000,
    rating: 4.9,
    reviews: 340,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Électronique',
    subcategory: 'Accessoires',
    discount: 10,
    inStock: true,
    description: 'La console next-gen de Sony avec lecteur Blu-ray.',
    specs: { 'Stockage': '825GB SSD', 'Résolution': '4K/8K', 'Manette': 'DualSense' }
  },
  {
    id: '11',
    title: 'Écouteurs AirPods Pro 2',
    price: 180000,
    rating: 4.8,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Électronique',
    subcategory: 'Accessoires',
    inStock: true,
    description: 'AirPods Pro avec réduction de bruit active et audio spatial.',
    specs: { 'ANC': 'Oui', 'Autonomie': '6h', 'Boîtier': 'MagSafe' }
  },
  {
    id: '12',
    title: 'Sac à Main Cuir Premium',
    price: 75000,
    rating: 4.4,
    reviews: 33,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Mode',
    subcategory: 'Femmes',
    inStock: true,
    description: 'Sac à main en cuir véritable, élégant et spacieux.',
    specs: { 'Matière': 'Cuir véritable', 'Dimensions': '30x25x12cm', 'Poches': '3 intérieures' }
  },
  {
    id: '13',
    title: 'TV Samsung 55" 4K Smart',
    price: 380000,
    originalPrice: 450000,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Électronique',
    subcategory: 'TV & Audio',
    discount: 15,
    inStock: true,
    description: 'Téléviseur Samsung 55 pouces avec résolution 4K et Smart TV.',
    specs: { 'Taille': '55"', 'Résolution': '4K UHD', 'Smart TV': 'Tizen' }
  },
  {
    id: '14',
    title: 'Appareil Photo Canon EOS R6',
    price: 1200000,
    rating: 4.9,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Électronique',
    subcategory: 'Caméras',
    inStock: true,
    description: 'Appareil photo hybride plein format Canon EOS R6.',
    specs: { 'Capteur': 'Plein format 20MP', 'Vidéo': '4K 60fps', 'Stabilisation': '8 stops' }
  },
  {
    id: '15',
    title: 'Chemise Homme Slim Fit - Bleu',
    price: 18000,
    rating: 4.3,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Mode',
    subcategory: 'Hommes',
    inStock: true,
    description: 'Chemise élégante coupe slim fit en coton.',
    specs: { 'Matière': '100% Coton', 'Coupe': 'Slim Fit', 'Tailles': 'S-XXL' }
  },
  {
    id: '16',
    title: 'Montre Rolex Submariner',
    price: 8500000,
    rating: 5.0,
    reviews: 23,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Mode',
    subcategory: 'Montres',
    inStock: true,
    description: 'Montre de luxe Rolex Submariner automatique.',
    specs: { 'Mouvement': 'Automatique', 'Étanchéité': '300m', 'Matière': 'Acier Oystersteel' }
  },
  {
    id: '17',
    title: 'Ensemble Enfant Sport',
    price: 12000,
    originalPrice: 18000,
    rating: 4.5,
    reviews: 34,
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Mode',
    subcategory: 'Enfants',
    discount: 33,
    inStock: true,
    description: 'Ensemble sportif confortable pour enfants.',
    specs: { 'Matière': 'Polyester', 'Âges': '4-12 ans', 'Lavage': 'Machine 30°' }
  },
  {
    id: '18',
    title: 'Lampe de Bureau LED Design',
    price: 25000,
    rating: 4.4,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Maison',
    subcategory: 'Éclairage',
    inStock: true,
    description: 'Lampe de bureau LED avec variateur de lumière.',
    specs: { 'Puissance': '12W', 'Température': '3000-6000K', 'USB': 'Port de charge' }
  },
  {
    id: '19',
    title: 'Parure de Lit King Size',
    price: 45000,
    originalPrice: 60000,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Maison',
    subcategory: 'Literie',
    discount: 25,
    inStock: true,
    description: 'Parure de lit complète en coton égyptien.',
    specs: { 'Taille': 'King Size', 'Matière': 'Coton égyptien', 'Fils': '400 fils/cm²' }
  },
  {
    id: '20',
    title: 'Vase Décoratif Artisanal',
    price: 15000,
    rating: 4.6,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Maison',
    subcategory: 'Décoration',
    inStock: true,
    description: 'Vase artisanal fait main en céramique.',
    specs: { 'Hauteur': '30cm', 'Matière': 'Céramique', 'Style': 'Bohème' }
  },
  {
    id: '21',
    title: 'Parfum Chanel N°5',
    price: 95000,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Beauté & Santé',
    subcategory: 'Parfums',
    inStock: true,
    description: 'Le parfum iconique Chanel N°5 Eau de Parfum.',
    specs: { 'Volume': '100ml', 'Type': 'Eau de Parfum', 'Notes': 'Florales, Aldéhydées' }
  },
  {
    id: '22',
    title: 'Crème Hydratante Visage',
    price: 28000,
    rating: 4.5,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Beauté & Santé',
    subcategory: 'Soins',
    inStock: true,
    description: 'Crème hydratante pour tous types de peau.',
    specs: { 'Volume': '50ml', 'Type de peau': 'Tous types', 'Ingrédients': 'Acide hyaluronique' }
  },
  {
    id: '23',
    title: 'Shampoing Kérastase',
    price: 22000,
    rating: 4.6,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Beauté & Santé',
    subcategory: 'Cheveux',
    inStock: true,
    description: 'Shampoing professionnel Kérastase pour cheveux secs.',
    specs: { 'Volume': '250ml', 'Type': 'Cheveux secs', 'Sans': 'Parabènes' }
  },
  {
    id: '24',
    title: 'Vitamines Multivitaminées',
    price: 15000,
    rating: 4.4,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Beauté & Santé',
    subcategory: 'Santé',
    inStock: true,
    description: 'Complément alimentaire multivitaminé complet.',
    specs: { 'Gélules': '60', 'Durée': '2 mois', 'Vitamines': 'A, B, C, D, E' }
  },
  {
    id: '25',
    title: 'Tapis de Yoga Premium',
    price: 18000,
    rating: 4.7,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    subcategory: 'Fitness',
    inStock: true,
    description: 'Tapis de yoga antidérapant haute densité.',
    specs: { 'Épaisseur': '6mm', 'Matière': 'TPE écologique', 'Dimensions': '183x61cm' }
  },
  {
    id: '26',
    title: 'Ballon de Football Adidas',
    price: 25000,
    rating: 4.8,
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    subcategory: 'Football',
    inStock: true,
    description: 'Ballon de football officiel Adidas.',
    specs: { 'Taille': '5', 'Matière': 'PU', 'Certification': 'FIFA Quality Pro' }
  },
  {
    id: '27',
    title: 'Chaussures de Basketball Nike',
    price: 95000,
    originalPrice: 120000,
    rating: 4.6,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    subcategory: 'Basketball',
    discount: 20,
    inStock: true,
    description: 'Chaussures de basketball Nike haute performance.',
    specs: { 'Semelle': 'Zoom Air', 'Tige': 'Mesh respirant', 'Support': 'Cheville haute' }
  },
  {
    id: '28',
    title: 'Tente de Camping 4 Places',
    price: 85000,
    rating: 4.5,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    subcategory: 'Camping',
    inStock: true,
    description: 'Tente de camping familiale imperméable.',
    specs: { 'Capacité': '4 personnes', 'Imperméabilité': '3000mm', 'Poids': '4.5kg' }
  },
  {
    id: '29',
    title: 'Survêtement Adidas Homme',
    price: 55000,
    rating: 4.4,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    subcategory: 'Vêtements',
    inStock: true,
    description: 'Survêtement Adidas confortable pour le sport.',
    specs: { 'Matière': 'Polyester recyclé', 'Tailles': 'S-XXL', 'Technologie': 'AEROREADY' }
  }
]
// Sample Orders
const SAMPLE_ORDERS: Order[] = [
  { id: 'ORD-7829', customer: 'Jean Kouassi', date: '28 Jan 2024', total: 45000, status: 'delivered', items: 2 },
  { id: 'ORD-7830', customer: 'Marie Touré', date: '28 Jan 2024', total: 12500, status: 'processing', items: 1 },
  { id: 'ORD-7831', customer: 'Ibrahim Koné', date: '27 Jan 2024', total: 125000, status: 'pending', items: 3 },
  { id: 'ORD-7832', customer: 'Sarah Diop', date: '27 Jan 2024', total: 8900, status: 'shipped', items: 1 },
  { id: 'ORD-7833', customer: 'Michel Yapo', date: '26 Jan 2024', total: 250000, status: 'cancelled', items: 4 },
]
// Sample Customers
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  joinDate: string
}
const SAMPLE_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Jean Kouassi', email: 'jean@email.com', phone: '07 07 00 00 01', orders: 5, totalSpent: 450000, joinDate: '15 Dec 2023' },
  { id: 'c2', name: 'Marie Touré', email: 'marie@email.com', phone: '07 07 00 00 02', orders: 3, totalSpent: 125000, joinDate: '20 Dec 2023' },
  { id: 'c3', name: 'Ibrahim Koné', email: 'ibrahim@email.com', phone: '07 07 00 00 03', orders: 8, totalSpent: 890000, joinDate: '10 Nov 2023' },
  { id: 'c4', name: 'Sarah Diop', email: 'sarah@email.com', phone: '07 07 00 00 04', orders: 2, totalSpent: 65000, joinDate: '05 Jan 2024' },
]
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
  isAdminAuthenticated: boolean;
  authenticateAdmin: (password: string) => boolean;
}
const AppContext = createContext<AppContextType | undefined>(undefined)
export function AppProvider({ children }: { children: ReactNode }) {
  // Products
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS)
  
  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>([])
  
  // User
  const [user, setUser] = useState<User | null>(null)
  
  // Orders
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS)
  
  // Customers
  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS)
  
  // Search
  const [searchQuery, setSearchQuery] = useState('')

    // ────────────────────────────────────────────────
  // Protection admin (mot de passe simple client-side)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const authenticateAdmin = (password: string): boolean => {
    // CHANGE CE MOT DE PASSE ! Mets quelque chose de très fort et personnel
    const ADMIN_PASSWORD = "MonStrore";  // ← À MODIFIER OBLIGATOIREMENT

    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem("adminAuthToken", "true"); // persistance simple
      return true;
    }
    return false;
  };

  // Restauration de la session admin au chargement
  useEffect(() => {
    if (localStorage.getItem("adminAuthToken") === "true") {
      setIsAdminAuthenticated(true);
    }
  }, []);
  // ────────────────────────────────────────────────
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
  // Auth functions
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