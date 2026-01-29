import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
export function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Breadcrumb
            items={[
            {
              label: 'Contact'
            }]
            } />

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Contactez-nous
          </h1>
          <p className="text-gray-600 mt-2">
            Notre équipe est là pour répondre à toutes vos questions
          </p>
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
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Prénom" placeholder="Jean" />
                  <Input label="Nom" placeholder="Kouassi" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="jean@exemple.com" />

                  <Input label="Téléphone" placeholder="07 07 00 00 00" />
                </div>
                <Input label="Sujet" placeholder="Ma commande #12345" />
                <Textarea
                  label="Message"
                  rows={6}
                  placeholder="Comment pouvons-nous vous aider ?" />


                <div className="flex justify-end">
                  <Button size="lg">Envoyer le message</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>);

}