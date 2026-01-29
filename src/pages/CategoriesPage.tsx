import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { Category } from '../types';
const CATEGORIES: Category[] = [
{
  id: '1',
  name: 'Électronique',
  slug: 'electronics',
  image:
  'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  subcategories: [
  'Téléphones',
  'Ordinateurs',
  'TV & Audio',
  'Caméras',
  'Accessoires']

},
{
  id: '2',
  name: 'Mode',
  slug: 'fashion',
  image:
  'https://images.unsplash.com/photo-1445205170230-05328324f30f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  subcategories: ['Hommes', 'Femmes', 'Enfants', 'Montres', 'Chaussures']
},
{
  id: '3',
  name: 'Maison',
  slug: 'home',
  image:
  'https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  subcategories: ['Meubles', 'Décoration', 'Cuisine', 'Literie', 'Éclairage']
},
{
  id: '4',
  name: 'Beauté & Santé',
  slug: 'beauty',
  image:
  'https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  subcategories: ['Maquillage', 'Soins', 'Parfums', 'Cheveux', 'Santé']
},
{
  id: '5',
  name: 'Sports',
  slug: 'sports',
  image:
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  subcategories: [
  'Fitness',
  'Football',
  'Basketball',
  'Camping',
  'Vêtements']

},
{
  id: '6',
  name: 'Alimentation',
  slug: 'food',
  image:
  'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  subcategories: ['Boissons', 'Épicerie', 'Frais', 'Snacks', 'Bio']
}];

export function CategoriesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Breadcrumb
            items={[
            {
              label: 'Toutes les catégories'
            }]
            } />

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Nos Catégories
          </h1>
          <p className="text-gray-600 mt-2">
            Explorez notre large sélection de produits par catégorie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) =>
          <Link
            key={category.id}
            to={`/shop?category=${category.slug}`}
            className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">

              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/80 to-transparent">
                  <h2 className="text-xl font-bold text-white">
                    {category.name}
                  </h2>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.map((sub) =>
                <span
                  key={sub}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full group-hover:bg-orange-50 group-hover:text-[#FF6B00] transition-colors">

                      {sub}
                    </span>
                )}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>);

}