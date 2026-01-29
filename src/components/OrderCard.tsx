import React from 'react';
import { Order } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
interface OrderCardProps {
  order: Order;
}
export function OrderCard({ order }: OrderCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Livré';
      case 'processing':
        return 'En traitement';
      case 'shipped':
        return 'Expédié';
      case 'cancelled':
        return 'Annulé';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF'
    }).
    format(price).
    replace('XOF', 'FCFA');
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:gap-8">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">
              Commande passée le
            </p>
            <p className="text-sm font-medium text-gray-900">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
            <p className="text-sm font-medium text-gray-900">
              {formatPrice(order.total)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">
              N° de commande
            </p>
            <p className="text-sm font-medium text-gray-900">{order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={getStatusVariant(order.status) as any}>
            {getStatusLabel(order.status)}
          </Badge>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Facture
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 p-3 rounded-md">
              <Package className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {order.status === 'delivered' ?
                'Livré le 30 Janvier' :
                `Livraison estimée: ${order.status === 'processing' ? '2-3 jours' : 'Demain'}`}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {order.items} article{order.items > 1 ? 's' : ''}
              </p>

              {/* Sample product previews - in a real app this would come from order.products */}
              <div className="flex gap-2 mt-3">
                {[...Array(Math.min(3, order.items))].map((_, i) =>
                <div
                  key={i}
                  className="h-12 w-12 bg-gray-100 rounded border border-gray-200">
                </div>
                )}
                {order.items > 3 &&
                <div className="h-12 w-12 bg-gray-50 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                    +{order.items - 3}
                  </div>
                }
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link to={`/orders/${order.id}`}>
              <Button variant="primary" size="sm" className="w-full">
                Voir détails
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-full text-gray-600">
              <Clock className="w-3 h-3 mr-2" />
              Commander à nouveau
            </Button>
          </div>
        </div>
      </div>
    </div>);

}