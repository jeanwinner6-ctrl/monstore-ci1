import React from 'react';
import { Truck, ShieldCheck, HeadphonesIcon, RotateCcw } from 'lucide-react';
export function TrustBadges() {
  const badges = [
  {
    icon: <Truck className="w-8 h-8 text-[#FF6B00]" />,
    title: 'Livraison Rapide',
    description: "Partout à Abidjan et à l'intérieur"
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#FF6B00]" />,
    title: 'Paiement Sécurisé',
    description: '100% sécurisé avec Mobile Money'
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8 text-[#FF6B00]" />,
    title: 'Service Client 24/7',
    description: 'Support dédié pour vous aider'
  },
  {
    icon: <RotateCcw className="w-8 h-8 text-[#FF6B00]" />,
    title: 'Retours Faciles',
    description: "7 jours pour changer d'avis"
  }];

  return (
    <div className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) =>
          <div
            key={index}
            className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">

              <div className="flex-shrink-0 bg-orange-50 p-3 rounded-full">
                {badge.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{badge.title}</h3>
                <p className="text-sm text-gray-500">{badge.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}