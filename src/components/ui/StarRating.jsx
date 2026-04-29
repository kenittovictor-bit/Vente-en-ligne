import { Star } from 'lucide-react'

/**
 * StarRating — display or interactive star rating 1-5
 */
export default function StarRating({ rating, maxStars = 5, size = 16, interactive = false, onChange }) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : 'img'} aria-label={`Note : ${rating} sur ${maxStars}`}>
      {stars.map((star) => {
        const filled = star <= Math.floor(rating)
        const partial = !filled && star <= rating + 0.5

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={[
              'leading-none transition-transform',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default pointer-events-none',
            ].join(' ')}
            aria-label={interactive ? `${star} étoile${star > 1 ? 's' : ''}` : undefined}
          >
            <Star
              size={size}
              fill={filled ? 'var(--color-warning-500)' : partial ? 'var(--color-warning-500)' : 'none'}
              stroke={filled || partial ? 'var(--color-warning-500)' : 'var(--color-text-muted)'}
              strokeWidth={1.5}
              opacity={partial ? 0.6 : 1}
            />
          </button>
        )
      })}
    </div>
  )
}
