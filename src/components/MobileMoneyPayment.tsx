import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Phone } from 'lucide-react';
interface MobileMoneyPaymentProps {
  amount: number;
  onConfirm: () => void;
}
export function MobileMoneyPayment({
  amount,
  onConfirm
}: MobileMoneyPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const providers = [
  {
    id: 'wave',
    name: 'Wave',
    color: 'bg-blue-500',
    logo: 'W'
  },
  {
    id: 'om',
    name: 'Orange Money',
    color: 'bg-orange-500',
    logo: 'OM'
  },
  {
    id: 'mtn',
    name: 'MTN Money',
    color: 'bg-yellow-400',
    logo: 'M'
  },
  {
    id: 'moov',
    name: 'Moov Money',
    color: 'bg-blue-800',
    logo: 'MM'
  }];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF'
    }).
    format(price).
    replace('XOF', 'FCFA');
  };
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Paiement Mobile Money
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {providers.map((provider) =>
        <div
          key={provider.id}
          onClick={() => setSelectedProvider(provider.id)}
          className={`
              cursor-pointer rounded-lg p-4 border-2 flex flex-col items-center justify-center transition-all
              ${selectedProvider === provider.id ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
            `}>

            <div
            className={`w-10 h-10 rounded-full ${provider.color} text-white flex items-center justify-center font-bold mb-2`}>

              {provider.logo}
            </div>
            <span className="text-xs font-medium text-gray-700">
              {provider.name}
            </span>
          </div>
        )}
      </div>

      {selectedProvider &&
      <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Montant à payer:</p>
            <p className="text-2xl font-bold text-[#FF6B00]">
              {formatPrice(amount)}
            </p>
          </div>

          <Input
          label="Numéro de téléphone mobile"
          placeholder="07 07 00 00 00"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          icon={<Phone className="w-4 h-4" />} />


          <p className="text-xs text-gray-500">
            Vous recevrez une notification sur votre téléphone pour valider le
            paiement.
          </p>

          <Button
          onClick={onConfirm}
          fullWidth
          size="lg"
          className="mt-4"
          disabled={!phoneNumber || phoneNumber.length < 10}>

            Payer {formatPrice(amount)}
          </Button>
        </div>
      }
    </div>);

}