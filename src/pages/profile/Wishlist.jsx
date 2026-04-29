import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import ProfileLayout from './ProfileLayout'
import StarRating from '../../components/ui/StarRating'
import useWishlistStore from '../../store/wishlistStore'
import useCartStore from '../../store/cartStore'
import { formatPrice } from '../../utils/formatters'

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)

  return (
    <ProfileLayout>
      <h1 className="section-title mb-6">Ma wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 card">
          <Heart size={48} className="mx-auto text-[var(--color-text-muted)] opacity-30 mb-3" />
          <p className="text-[var(--color-text-muted)] mb-4">Votre wishlist est vide.</p>
          <Link to="/products" className="btn btn-primary">Découvrir les produits</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((product) => (
            <div key={product.id} className="card p-4 flex gap-4">
              <Link to={`/products/${product.id}`}>
                <img src={product.images[0]} alt={product.name} className="w-20 h-20 rounded-[var(--radius-lg)] object-cover bg-[var(--color-bg-secondary)]" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <Link to={`/products/${product.id}`} className="text-sm font-600 line-clamp-2 hover:text-[var(--color-primary-500)]">
                  {product.name}
                </Link>
                <StarRating rating={product.rating} size={12} />
                <p className="text-base font-800">{formatPrice(product.price)}</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    <ShoppingCart size={12} />
                    Panier
                  </button>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="btn btn-ghost btn-sm text-[var(--color-error-500)] !px-2"
                    aria-label="Retirer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfileLayout>
  )
}
