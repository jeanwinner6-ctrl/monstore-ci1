import React, { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { api } from '../services/api';

export function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError('Veuillez remplir les champs requis: Prénom, Nom, Email, Sujet et Message.');
      return;
    }

    try {
      setLoading(true);
      await api.sendContactMessage({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSuccess('Message envoyé. Nous vous répondrons rapidement.');
      setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setError('Envoi impossible. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: 'Contact' }
            ]}
          />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Contactez-nous</h1>
          <p className="text-gray-600 mt-2">Notre équipe est là pour répondre à toutes vos questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Nos Coordonnées</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-[#FF6B00] mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Téléphone</p>
                    <p className="text-gray-600">+225 07 07 00 00 00</p>
                    <p className="text-gray-600">+225 01 01 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-[#FF6B00] mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">support@monstore.ci</p>
                    <p className="text-gray-600">info@monstore.ci</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#FF6B00] mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Adresse</p>
                    <p className="text-gray-600">Cocody, Angré 8ème Tranche</p>
                    <p className="text-gray-600">Abidjan, Côte d'Ivoire</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-[#FF6B00] mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Horaires</p>
                    <p className="text-gray-600">Lundi - Vendredi: 8h - 18h</p>
                    <p className="text-gray-600">Samedi: 9h - 15h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p>Carte Google Maps</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

              {/* Alerts */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Prénom"
                    placeholder="Jean"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="jean@exemple.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Téléphone"
                    placeholder="07 07 00 00 00"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <Input
                  label="Sujet"
                  placeholder="Ma commande #12345"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
                <Textarea
                  label="Message"
                  rows={6}
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />

                <div className="flex justify-end">
                  <Button type="submit" size="lg" isLoading={loading}>
                    Envoyer le message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}