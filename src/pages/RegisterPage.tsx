import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      setError('Veuillez remplir tous les champs requis.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      setIsLoading(true);
      const user = await api.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setUser(user);
      navigate('/account'); // ou /login si tu veux une connexion après inscription
    } catch (err: any) {
      setError('Inscription impossible. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/login" className="font-medium text-[#FF6B00] hover:text-[#e66000]">
              Connectez-vous
            </Link>
          </p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Jean"
                icon={<User className="w-4 h-4" />}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
              <Input
                label="Nom"
                placeholder="Kouassi"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="jean@exemple.com"
              icon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              placeholder="07 07 00 00 00"
              icon={<Phone className="w-4 h-4" />}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded" required />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
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
    </div>
  );
}