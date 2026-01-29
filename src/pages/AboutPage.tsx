import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Truck, ShieldCheck, HeadphonesIcon, Users } from 'lucide-react';
export function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            À propos de MonStore.CI
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            La première destination e-commerce en Côte d'Ivoire, connectant des
            millions d'acheteurs et de vendeurs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF6B00]">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Notre Mission</h3>
            <p className="text-gray-600">
              Faciliter le commerce en Côte d'Ivoire en offrant une plateforme
              fiable, sécurisée et accessible à tous.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Nos Valeurs</h3>
            <p className="text-gray-600">
              Intégrité, innovation et satisfaction client sont au cœur de tout
              ce que nous faisons.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Notre Promesse</h3>
            <p className="text-gray-600">
              Des produits authentiques, des prix justes et une livraison rapide
              partout dans le pays.
            </p>
          </div>
        </div>

        <div className="py-16">
          <div className="prose max-w-none text-gray-600">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Notre Histoire
            </h2>
            <p className="mb-4">
              Fondée en 2024, MonStore.CI est née d'une vision simple :
              transformer la façon dont les Ivoiriens achètent et vendent en
              ligne. Nous avons commencé avec une petite équipe passionnée à
              Abidjan et avons rapidement grandi pour devenir une référence
              nationale.
            </p>
            <p className="mb-4">
              Aujourd'hui, nous servons des milliers de clients chaque jour,
              offrant une gamme diversifiée de produits allant de l'électronique
              à la mode, en passant par l'électroménager et les produits de
              beauté.
            </p>
            <p>
              Notre succès repose sur notre engagement envers la qualité de
              service et notre capacité à adapter les meilleures pratiques du
              e-commerce mondial aux réalités locales, notamment grâce à
              l'intégration des paiements mobiles (Wave, Orange Money, MTN
              Money, Moov Money) et un réseau logistique performant.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Pourquoi nous choisir ?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">50k+</div>
              <div className="text-gray-600 font-medium">Produits</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">10k+</div>
              <div className="text-gray-600 font-medium">Clients Heureux</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">24h</div>
              <div className="text-gray-600 font-medium">Livraison Moyenne</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Client</div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}