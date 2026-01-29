import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
export function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb
          items={[
          {
            label: 'Conditions Générales'
          }]
          } />


        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100 mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Conditions Générales d'Utilisation
          </h1>

          <div className="prose max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                1. Introduction
              </h2>
              <p>
                Bienvenue sur MonStore.CI. En accédant à notre site web, vous
                acceptez d'être lié par les présentes conditions générales
                d'utilisation, toutes les lois et réglementations applicables,
                et acceptez que vous êtes responsable du respect des lois
                locales applicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                2. Utilisation de la licence
              </h2>
              <p>
                Il est permis de télécharger temporairement une copie du
                matériel (information ou logiciel) sur le site web de
                MonStore.CI pour une visualisation transitoire personnelle et
                non commerciale uniquement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                3. Commandes et Paiements
              </h2>
              <p>
                Toutes les commandes sont sujettes à disponibilité et
                confirmation du prix de la commande. Les délais d'expédition
                peuvent varier en fonction de la disponibilité et des garanties
                ou représentations faites quant aux délais de livraison.
              </p>
              <p className="mt-2">
                Nous acceptons les paiements via Wave, Orange Money, MTN Money,
                Moov Money et cartes bancaires. Le paiement est dû au moment de
                la commande.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                4. Retours et Remboursements
              </h2>
              <p>
                Vous disposez d'un délai de 7 jours après réception de votre
                commande pour retourner un produit qui ne vous conviendrait pas.
                Le produit doit être dans son emballage d'origine et en parfait
                état.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                5. Limitation de responsabilité
              </h2>
              <p>
                En aucun cas MonStore.CI ou ses fournisseurs ne seront
                responsables de tout dommage (y compris, sans limitation, les
                dommages pour perte de données ou de profit, ou en raison d'une
                interruption d'activité) découlant de l'utilisation ou de
                l'incapacité d'utiliser le matériel sur le site Internet de
                MonStore.CI.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>);

}