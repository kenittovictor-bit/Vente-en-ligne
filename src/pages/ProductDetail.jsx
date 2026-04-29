import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingCart, Heart, ChevronLeft, Star,
  Minus, Plus, Check, Truck, Shield, RefreshCw, Share2,
} from 'lucide-react'
import StarRating from '../components/ui/StarRating'
import ProductCard from '../components/ui/ProductCard'
import { PRODUCTS, REVIEWS } from '../data/mockProducts'
import { formatPrice, calcDiscountPercent, formatDate } from '../utils/formatters'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'

export default function ProductDetail() {
  const { id } = useParams()
  const product = PRODUCTS.find((p) => p.id === id)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const addItem = useCartStore((s) => s.addItem)
  const { toggle, isWished } = useWishlistStore()
  const wished = product ? isWished(product.id) : false

  const productReviews = REVIEWS.filter((r) => r.productId === id)

  const handleAddToCart = useCallback(() => {
    if (!product) return
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }, [product, quantity, addItem])

  const related = PRODUCTS.filter((p) => p.category === product?.category && p.id !== id).slice(0, 4)

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h1 className="section-title mb-2">Produit introuvable</h1>
        <Link to="/products" className="btn btn-primary mt-4">Retour au catalogue</Link>
      </div>
    )
  }

  const discount = calcDiscountPercent(product.originalPrice, product.price)

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6" aria-label="Fil d'Ariane">
        <Link to="/" className="hover:text-[var(--color-primary-500)]">Accueil</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[var(--color-primary-500)]">Catalogue</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-[var(--color-primary-500)] capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text)] truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Images */}
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-bg-secondary)] aspect-square">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 badge bg-[var(--color-accent-500)] text-white">-{discount}%</span>
            )}
            {product.isNew && (
              <span className="absolute top-4 left-4 badge bg-[var(--color-primary-500)] text-white">Nouveau</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={[
                    'w-20 h-20 rounded-[var(--radius-lg)] overflow-hidden border-2 transition-all',
                    i === activeImage ? 'border-[var(--color-primary-500)]' : 'border-transparent opacity-60 hover:opacity-100',
                  ].join(' ')}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-600 text-[var(--color-primary-500)] uppercase tracking-widest mb-1">
              {product.category}
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-800 text-[var(--color-text)] leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} size={18} />
            <span className="text-sm font-600 text-[var(--color-text)]">{product.rating}</span>
            <span className="text-sm text-[var(--color-text-muted)]">
              ({product.reviewCount} avis)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-800 text-[var(--color-text)]">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-[var(--color-text-muted)] line-through">{formatPrice(product.originalPrice)}</span>
                <span className="badge bg-[var(--color-accent-50)] text-[var(--color-accent-500)]">
                  Économisez {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-[var(--color-success-500)]' : product.stock > 0 ? 'bg-[var(--color-warning-500)]' : 'bg-[var(--color-error-500)]'}`} />
            <span className="text-sm font-500 text-[var(--color-text-secondary)]">
              {product.stock > 5
                ? 'En stock'
                : product.stock > 0
                ? `Plus que ${product.stock} disponible${product.stock > 1 ? 's' : ''} !`
                : 'Rupture de stock'}
            </span>
          </div>

          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{product.description}</p>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-[var(--color-border-strong)] rounded-[var(--radius-md)] overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 flex items-center justify-center hover:bg-[var(--color-bg-secondary)] transition-colors"
                  aria-label="Diminuer la quantité"
                >
                  <Minus size={15} />
                </button>
                <span className="w-12 text-center text-sm font-600" aria-live="polite" aria-atomic="true">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-11 flex items-center justify-center hover:bg-[var(--color-bg-secondary)] transition-colors"
                  aria-label="Augmenter la quantité"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={['btn btn-primary flex-1', addedToCart ? 'bg-[var(--color-success-500)] border-[var(--color-success-500)]' : ''].join(' ')}
              >
                {addedToCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                {addedToCart ? 'Ajouté au panier !' : 'Ajouter au panier'}
              </button>

              <button
                onClick={() => toggle(product)}
                className="btn btn-outline w-11 !px-0"
                aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart size={18} fill={wished ? 'var(--color-accent-500)' : 'none'} stroke={wished ? 'var(--color-accent-500)' : 'currentColor'} />
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--color-border)]">
            {[
              { Icon: Truck, text: 'Livraison offerte dès 60€' },
              { Icon: RefreshCw, text: 'Retour 30 jours gratuit' },
              { Icon: Shield, text: 'Paiement sécurisé' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                <Icon size={18} className="text-[var(--color-primary-500)]" />
                <span className="text-[0.7rem] text-[var(--color-text-muted)]">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-10">
        <div className="border-b border-[var(--color-border)] flex gap-1 mb-6">
          {[
            { id: 'description', label: 'Description' },
            { id: 'specs', label: 'Spécifications' },
            { id: 'reviews', label: `Avis (${productReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={[
                'px-5 py-3 text-sm font-600 border-b-2 transition-colors -mb-px',
                activeTab === tab.id
                  ? 'border-[var(--color-primary-500)] text-[var(--color-primary-500)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="card overflow-hidden max-w-lg">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-[var(--color-bg-secondary)]' : 'bg-white'}>
                    <td className="px-4 py-3 font-600 text-[var(--color-text)] w-40">{key}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-4">
            {productReviews.length === 0 ? (
              <p className="text-[var(--color-text-muted)]">Aucun avis pour ce produit. Soyez le premier !</p>
            ) : (
              productReviews.map((review) => (
                <div key={review.id} className="card p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={review.avatar} alt={review.userName} className="w-9 h-9 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-700">{review.userName}</span>
                        <StarRating rating={review.rating} size={13} />
                        <span className="text-xs text-[var(--color-text-muted)]">{formatDate(review.date)}</span>
                      </div>
                      <p className="text-sm font-600 text-[var(--color-text)] mt-1">{review.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{review.comment}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-3">
                    {review.helpful} personnes ont trouvé cet avis utile
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="section-title mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
