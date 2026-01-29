import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Mail, Lock, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useApp()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/account')
    }
  }, [isAuthenticated, navigate])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setIsLoading(true)
    
    try {
      const success = await login(email, password)
      if (success) {
        navigate('/account')
      } else {
        setError('Email ou mot de passe incorrect')
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/register"
              className="font-medium text-[#FF6B00] hover:text-[#e66000]"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>
        {/* Demo credentials notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Mode Démo</p>
              <p>Utilisez n'importe quel email et mot de passe pour vous connecter.</p>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Adresse email"
              type="email"
              placeholder="jean@exemple.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right mt-1">
                <Link
                  to="#"
                  className="text-xs font-medium text-[#FF6B00] hover:text-[#e66000]"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
          </div>
          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            Se connecter
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou continuer avec
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" fullWidth>
              Google
            </Button>
            <Button type="button" variant="outline" fullWidth>
              Facebook
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}