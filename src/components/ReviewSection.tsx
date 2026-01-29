import React, { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Review } from '../types';
interface ReviewSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
export function ReviewSection({
  reviews,
  averageRating,
  totalReviews
}: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  // Calculate distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? count / totalReviews * 100 : 0;
    return {
      stars,
      count,
      percentage
    };
  });
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Avis Clients</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Summary */}
        <div className="col-span-1">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 mb-2">/ 5</span>
          </div>
          <div className="flex text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) =>
            <Star
              key={i}
              className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />

            )}
          </div>
          <p className="text-sm text-gray-500">{totalReviews} avis vérifiés</p>

          <div className="mt-6">
            <Button onClick={() => setShowForm(!showForm)} fullWidth>
              Écrire un avis
            </Button>
          </div>
        </div>

        {/* Distribution */}
        <div className="col-span-1 md:col-span-2">
          <div className="space-y-3">
            {distribution.map((item) =>
            <div key={item.stars} className="flex items-center text-sm">
                <span className="w-12 font-medium text-gray-600 flex items-center">
                  {item.stars} <Star className="w-3 h-3 ml-1 text-gray-400" />
                </span>
                <div className="flex-1 h-2 mx-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${item.percentage}%`
                  }} />

                </div>
                <span className="w-10 text-right text-gray-500">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      {showForm &&
      <div className="bg-gray-50 p-6 rounded-lg mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-gray-900 mb-4">Votre avis compte</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre note
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) =>
              <button
                key={star}
                className="text-gray-300 hover:text-yellow-400 focus:text-yellow-400 transition-colors">

                    <Star className="w-8 h-8 fill-current" />
                  </button>
              )}
              </div>
            </div>
            <Textarea
            label="Votre commentaire"
            placeholder="Dites-nous ce que vous avez pensé de ce produit..."
            rows={4} />

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button>Publier l'avis</Button>
            </div>
          </div>
        </div>
      }

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.map((review) =>
        <div
          key={review.id}
          className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">

            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {review.userName}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{review.date}</span>
                    {review.verified &&
                  <>
                        <span className="mx-1">•</span>
                        <span className="text-green-600 font-medium">
                          Achat vérifié
                        </span>
                      </>
                  }
                  </div>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) =>
              <Star
                key={i}
                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />

              )}
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4 pl-12">
              {review.comment}
            </p>

            <div className="pl-12">
              <button className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors">
                <ThumbsUp className="w-3 h-3 mr-1" />
                Utile ({review.helpful})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>);

}