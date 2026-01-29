// src/components/ProtectedAdminRoute.tsx
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function ProtectedAdminRoute() {
  const { isAdminAuthenticated, authenticateAdmin } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (isAdminAuthenticated) {
    return <Outlet />;  // ← affiche AdminDashboard si OK
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateAdmin(password)) {
      setError(null);
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Accès Administrateur
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez le mot de passe admin"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            autoFocus
          />

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#FF6B00] text-white py-3 rounded-lg font-medium hover:bg-[#e55a00]"
          >
            Accéder au dashboard
          </button>
        </form>
      </div>
    </div>
  );
}