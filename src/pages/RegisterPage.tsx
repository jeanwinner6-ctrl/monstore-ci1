import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, Phone } from 'lucide-react';
export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/login';
    }, 1500);
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link
              to="/login"
              className="font-medium text-[#FF6B00] hover:text-[#e66000]">

              Connectez-vous
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Jean"
                icon={<User className="w-4 h-4" />}
                required />

              <Input label="Nom" placeholder="Kouassi" required />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="jean@exemple.com"
              icon={<Mail className="w-4 h-4" />}
              required />


            <Input
              label="Téléphone"
              type="tel"
              placeholder="07 07 00 00 00"
              icon={<Phone className="w-4 h-4" />}
              required />


            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              required />


            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              required />


            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
                required />

              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900">

                J'accepte les{' '}
                <Link to="/terms" className="text-[#FF6B00] hover:underline">
                  Conditions Générales
                </Link>
              </label>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            S'inscrire
          </Button>
        </form>
      </div>
    </div>);

}