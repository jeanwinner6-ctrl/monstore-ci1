import React, { useEffect } from 'react'
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { Header } from './components/Header'
import { CategoryNav } from './components/CategoryNav'
import { Footer } from './components/Footer'
import { CartSidebar } from './components/CartSidebar'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AccountPage } from './pages/AccountPage'
import { OrderHistoryPage } from './pages/OrderHistoryPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { WishlistPage } from './pages/WishlistPage'
import { SellPage } from './pages/SellPage'
import { AdminImageLibrary } from './pages/AdminImageLibrary'
// Nouveaux imports: espace vendeur protégé
import { SellerDashboard } from './pages/SellerDashboard'
import { ProtectedSellerRoute } from './components/ProtectedSellerRoute'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Protected Route for authenticated users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// Main App Content
function AppContent() {
  const { products, addToCart, cartItems, clearCart } = useApp()
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Routes>
        {/* Admin Route protégée */}
        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route
            index
            element={
              <>
                <Header />
                <AdminDashboard />
              </>
            }
          />
          <Route
    path="images"
    element={
      <>
        <Header />
        <AdminImageLibrary />
      </>
    }
  />
        </Route>

        {/* Espace Vendeur protégé (doit être vendeur approuvé) */}
        <Route path="/seller" element={<ProtectedSellerRoute />}>
          <Route
            index
            element={
              <>
                <Header />
                <SellerDashboard />
              </>
            }
          />
        </Route>

        {/* Main Routes */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <CategoryNav />
              <main>
                <Routes>
                  <Route
                    path="/"
                    element={<HomePage products={products} onAddToCart={addToCart} />}
                  />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route
                    path="/checkout"
                    element={<CheckoutPage cartItems={cartItems} clearCart={clearCart} />}
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />

                  {/* Vendeurs: la demande /sell nécessite d'être connecté */}
                  <Route
                    path="/sell"
                    element={
                      <ProtectedRoute>
                        <SellPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
      <CartSidebar />
    </div>
  )
}

export function App() {
  return (
    <Router>
      <AppProvider>
        <ScrollToTop />
        <AppContent />
      </AppProvider>
    </Router>
  )
}