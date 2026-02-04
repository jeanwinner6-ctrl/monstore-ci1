import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function ProtectedSellerRoute() {
  const { user, isAuthenticated } = useApp()
  // doit être connecté
  if (!isAuthenticated) return <Navigate to="/login" replace />
  // doit être vendeur approuvé par l'admin
  if (!user?.isSeller) return <Navigate to="/sell" replace />
  return <Outlet />
}