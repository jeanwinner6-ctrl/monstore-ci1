import React from 'react';
import { Star } from 'lucide-react';
interface FilterSidebarProps {
  className?: string;
}
export function FilterSidebar({ className = '' }: FilterSidebarProps) {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 ${className}`}>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Catégories</h3>
          <div className="space-y-2">
            {[
            'Électronique',
            'Mode',
            'Maison & Bureau',
            'Santé & Beauté',
            'Sports',
            'Informatique'].
            map((cat) =>
            <label key={cat} className="flex items-center">
                <input
                type="checkbox"
                className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]" />

                <span className="ml-2 text-sm text-gray-600 hover:text-[#FF6B00] cursor-pointer">
                  {cat}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-bold text-gray-900 mb-3">Prix (FCFA)</h3>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" />

            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" />

          </div>
          <button className="w-full py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200">
            Appliquer
          </button>
        </div>

        {/* Ratings */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-bold text-gray-900 mb-3">Note du produit</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) =>
            <label key={rating} className="flex items-center cursor-pointer">
                <input
                type="radio"
                name="rating"
                className="text-[#FF6B00] focus:ring-[#FF6B00]" />

                <div className="flex items-center ml-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) =>
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-gray-300'}`} />

                  )}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">& plus</span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Brands */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-bold text-gray-900 mb-3">Marques</h3>
          <div className="space-y-2">
            {[
            'Samsung',
            'Apple',
            'Tecno',
            'Infinix',
            'Xiaomi',
            'Nike',
            'Adidas'].
            map((brand) =>
            <label key={brand} className="flex items-center">
                <input
                type="checkbox"
                className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]" />

                <span className="ml-2 text-sm text-gray-600">{brand}</span>
              </label>
            )}
          </div>
        </div>
      </div>
    </div>);

}