import { Link } from 'react-router-dom'
import { Star, MessageSquare } from 'lucide-react'
import ProfileLayout from './ProfileLayout'
import StarRating from '../../components/ui/StarRating'
import { REVIEWS } from '../../data/mockProducts'
import { formatDate } from '../../utils/formatters'
import useAuthStore from '../../store/authStore'

export default function Reviews() {
  const { user } = useAuthStore()
  const userReviews = REVIEWS.filter((r) => r.userId === 'u1') // demo user

  return (
    <ProfileLayout>
      <h1 className="section-title mb-6">Mes avis</h1>
      {userReviews.length === 0 ? (
        <div className="text-center py-16 card">
          <Star size={48} className="mx-auto text-[var(--color-text-muted)] opacity-30 mb-3" />
          <p className="text-[var(--color-text-muted)] mb-4">Vous n'avez pas encore laissé d'avis.</p>
          <Link to="/products" className="btn btn-primary">Voir mes achats</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {userReviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="text-sm font-700">{review.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDate(review.date)}</p>
                </div>
                <StarRating rating={review.rating} size={14} />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">{review.comment}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2 flex items-center gap-1">
                <MessageSquare size={11} />
                {review.helpful} personnes ont trouvé cet avis utile
              </p>
            </div>
          ))}
        </div>
      )}
    </ProfileLayout>
  )
}
