import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import StarRating from './StarRating'
import { formatPrice, calcDiscountPercent } from '../../utils/formatters'
import useCartStore from '../../store/cartStore'
import useWishlistStore from '../../store/wishlistStore'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, isWished } = useWishlistStore()
  const wished = isWished(product.id)
  const [added, setAdded] = useState(false)
  const discount = calcDiscountPercent(product.originalPrice, product.price)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggle(product)
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="card group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[var(--color-bg-secondary)] aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="badge bg-[var(--color-primary-500)] text-white text-[0.6875rem]">Nouveau</span>
          )}
          {product.isSale && discount > 0 && (
            <span className="badge bg-[var(--color-accent-500)] text-white text-[0.6875rem]">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <Heart
            size={16}
            fill={wished ? 'var(--color-accent-500)' : 'none'}
            stroke={wished ? 'var(--color-accent-500)' : 'var(--color-text-secondary)'}
          />
        </button>

        {/* Low stock */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 right-2">
            <span className="badge bg-[var(--color-warning-50)] text-[var(--color-warning-600)] text-[0.6875rem] w-full justify-center">
              Plus que {product.stock} en stock !
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="text-sm font-600 text-[var(--color-text)] line-clamp-2 leading-snug group-hover:text-[var(--color-primary-500)] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} size={13} />
          <span className="text-xs text-[var(--color-text-muted)]">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-base font-700 text-[var(--color-text)]">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={[
            'btn w-full mt-1 text-xs',
            added ? 'bg-[var(--color-success-500)] border-[var(--color-success-500)] text-white' : 'btn-primary',
            product.stock === 0 ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
          aria-label={`Ajouter ${product.name} au panier`}
        >
          <ShoppingCart size={14} />
          {added ? 'Ajouté !' : product.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
        </button>
      </div>
    </Link>
  )
}
