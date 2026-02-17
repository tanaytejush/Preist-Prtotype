import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface PriestReviewsProps {
  priestId: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: { first_name: string | null; last_name: string | null } | null;
}

const PriestReviews: React.FC<PriestReviewsProps> = ({ priestId }) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', priestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, user_id')
        .eq('priest_id', priestId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for reviewers
      if (data && data.length > 0) {
        const userIds = data.map((r: any) => r.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
        return data.map((r: any) => ({
          ...r,
          profiles: profileMap.get(r.user_id) || null,
        })) as Review[];
      }
      return [] as Review[];
    },
  });

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading reviews...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3 pb-3 border-b border-spiritual-gold/10">
        <div className="text-3xl font-bold text-spiritual-brown dark:text-spiritual-cream">
          {averageRating.toFixed(1)}
        </div>
        <div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Review list */}
      {reviews.map((review) => {
        const name = review.profiles
          ? `${review.profiles.first_name || ''} ${review.profiles.last_name || ''}`.trim()
          : 'Anonymous';
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <div key={review.id} className="flex gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-spiritual-gold/20 text-spiritual-brown text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{name}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriestReviews;
