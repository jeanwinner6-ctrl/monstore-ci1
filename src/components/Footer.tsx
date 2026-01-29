import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin } from
'lucide-react';
import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              À propos de MonStore.CI
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Le leader du e-commerce en Côte d'Ivoire. Nous proposons une large
              gamme de produits de qualité aux meilleurs prix, livrés partout à
              Abidjan et à l'intérieur du pays.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors">

                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors">

                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors">

                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors">

                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              Service Client
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Comment acheter
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Méthodes de paiement
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Expédition et livraison
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Politique de retour
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Signaler un produit
                </Link>
              </li>
            </ul>
          </div>

          {/* Make Money */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              Gagnez de l'argent
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Vendez sur MonStore
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Devenez partenaire logistique
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#FF6B00] transition-colors">
                  Programme d'affiliation
                </Link>
              </li>
            </ul>

            <h3 className="text-white text-lg font-bold mt-6 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" /> +225 07 07 00 00 00
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" /> support@monstore.ci
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Cocody, Abidjan
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              Moyens de Paiement
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-2 rounded flex items-center justify-center h-12">
                <span className="font-bold text-blue-600">Wave</span>
              </div>
              <div className="bg-white p-2 rounded flex items-center justify-center h-12">
                <span className="font-bold text-orange-500">Orange</span>
              </div>
              <div className="bg-white p-2 rounded flex items-center justify-center h-12">
                <span className="font-bold text-yellow-400">MTN</span>
              </div>
              <div className="bg-white p-2 rounded flex items-center justify-center h-12">
                <span className="font-bold text-blue-800">Moov</span>
              </div>
              <div className="bg-white p-2 rounded flex items-center justify-center h-12 col-span-2">
                <span className="font-bold text-gray-800">
                  Visa / Mastercard
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MonStore.CI. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white">
              Confidentialité
            </Link>
            <Link to="#" className="hover:text-white">
              Conditions d'utilisation
            </Link>
            <Link to="#" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>);

}