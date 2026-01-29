import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
export function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb
          items={[
          {
            label: 'Politique de Confidentialité'
          }]
          } />


        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-gray-100 mt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Politique de Confidentialité
          </h1>

          <div className="prose max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                1. Collecte des informations
              </h2>
              <p>
                Nous recueillons des informations lorsque vous vous inscrivez
                sur notre site, vous connectez à votre compte, faites un achat,
                participez à un concours et/ou lorsque vous vous déconnectez.
                Les informations recueillies incluent votre nom, votre adresse
                e-mail, votre numéro de téléphone et/ou votre carte de crédit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                2. Utilisation des informations
              </h2>
              <p>
                Toutes les informations que nous recueillons auprès de vous
                peuvent être utilisées pour :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Personnaliser votre expérience et répondre à vos besoins
                  individuels
                </li>
                <li>Fournir un contenu publicitaire personnalisé</li>
                <li>Améliorer notre site Web</li>
                <li>
                  Améliorer le service client et vos besoins de prise en charge
                </li>
                <li>Vous contacter par e-mail</li>
                <li>Administrer un concours, une promotion ou une enquête</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                3. Confidentialité du commerce en ligne
              </h2>
              <p>
                Nous sommes les seuls propriétaires des informations recueillies
                sur ce site. Vos informations personnelles ne seront pas
                vendues, échangées, transférées, ou données à une autre société
                pour n'importe quelle raison, sans votre consentement, en dehors
                de ce qui est nécessaire pour répondre à une demande et / ou une
                transaction, comme par exemple pour expédier une commande.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                4. Protection des informations
              </h2>
              <p>
                Nous mettons en œuvre une variété de mesures de sécurité pour
                préserver la sécurité de vos informations personnelles. Nous
                utilisons un cryptage à la pointe de la technologie pour
                protéger les informations sensibles transmises en ligne.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                5. Cookies
              </h2>
              <p>
                Nos cookies améliorent l'accès à notre site et identifient les
                visiteurs réguliers. En outre, nos cookies améliorent
                l'expérience d'utilisateur grâce au suivi et au ciblage de ses
                intérêts. Cependant, cette utilisation des cookies n'est en
                aucune façon liée à des informations personnelles identifiables
                sur notre site.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>);

}