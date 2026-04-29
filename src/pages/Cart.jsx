import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react'
import PromoBanner from '../components/ui/PromoBanner'
import useCartStore from '../store/cartStore'
import { formatPrice } from '../utils/formatters'

export default function Cart() {
  const {
    items, updateQuantity, removeItem,
    getSubtotal, getTax, getShipping, getTotal,
    promoDiscount, shippingThreshold,
  } = useCartStore()

  const subtotal = getSubtotal()
  const tax = getTax()
  const shipping = getShipping()
  const total = getTotal()
  const remaining = Math.max(0, shippingThreshold - subtotal)

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <div className="max-w-sm mx-auto">
          <ShoppingBag size={64} className="mx-auto text-[var(--color-text-muted)] mb-4 opacity-30" />
          <h1 className="section-title mb-3">Votre panier est vide</h1>
          <p className="text-[var(--color-text-muted)] mb-6">
            Découvrez nos produits et ajoutez-les à votre panier !
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <ShoppingBag size={18} />
            Découvrir le catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <h1 className="section-title mb-6">
        Mon panier
        <span className="text-lg font-400 text-[var(--color-text-muted)] ml-3">
          ({items.reduce((s, i) => s + i.quantity, 0)} article{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''})
        </span>
      </h1>

      {/* Free shipping progress */}
      {remaining > 0 && (
        <div className="card p-4 mb-6 flex items-center gap-3">
          <Truck size={18} className="text-[var(--color-primary-500)] shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-500 text-[var(--color-text)]">
              Plus que <strong>{formatPrice(remaining)}</strong> pour la livraison gratuite !
            </p>
            <div className="mt-1.5 h-1.5 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-primary-500)] transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex items-start gap-4">
              <Link to={`/products/${item.id}`} className="shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-20 h-20 rounded-[var(--radius-lg)] object-cover bg-[var(--color-bg-secondary)]"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`} className="text-sm font-600 text-[var(--color-text)] hover:text-[var(--color-primary-500)] line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 capitalize">{item.category}</p>
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-bg-secondary)] transition-colors"
                      aria-label="Diminuer"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-10 text-center text-sm font-600">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-bg-secondary)] transition-colors"
                      aria-label="Augmenter"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-700 text-[var(--color-text)]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-error-500)] transition-colors p-1"
                      aria-label={`Supprimer ${item.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card p-5 h-fit flex flex-col gap-4">
          <h2 className="text-sm font-700 uppercase tracking-widest text-[var(--color-text)]">Récapitulatif</h2>

          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Sous-total</span>
              <span className="font-500">{formatPrice(subtotal)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[var(--color-success-600)]">
                <span>Réduction promo</span>
                <span className="font-600">-{formatPrice(promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">TVA (20%)</span>
              <span className="font-500">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Livraison</span>
              <span className={`font-500 ${shipping === 0 ? 'text-[var(--color-success-600)]' : ''}`}>
                {shipping === 0 ? 'Offerte 🎉' : formatPrice(shipping)}
              </span>
            </div>
          </div>

          <div className="h-px bg-[var(--color-border)]" />
          <div className="flex justify-between text-base font-800">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          {/* Promo Code */}
          <div>
            <p className="text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Code promo</p>
            <PromoBanner />
          </div>

          <Link to="/checkout" className="btn btn-primary w-full btn-lg">
            Commander
            <ArrowRight size={16} />
          </Link>

          <Link to="/products" className="btn btn-ghost w-full text-sm">
            Continuer mes achats
          </Link>

          <div className="text-center text-xs text-[var(--color-text-muted)]">
            Paiement sécurisé — Stripe & PayPal
          </div>
        </div>
      </div>
    </div>
  )
}
