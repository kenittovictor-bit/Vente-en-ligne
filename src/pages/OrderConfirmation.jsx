import { useLocation, Link, useParams } from 'react-router-dom'
import { CheckCircle, Package, MapPin, Mail, ArrowRight, Clock } from 'lucide-react'
import { formatPrice, formatDate } from '../utils/formatters'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { state } = useLocation()

  if (!state) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="section-title mb-4">Commande introuvable</h1>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    )
  }

  const { address, items, subtotal, tax, shipping, total, promoDiscount } = state

  return (
    <div className="container-page py-10 max-w-2xl">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-[var(--color-success-50)] flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-[var(--color-success-500)]" />
        </div>
        <h1 className="font-display text-3xl font-800 text-[var(--color-text)] mb-2">
          Commande confirmée !
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Merci pour votre commande. Vous recevrez une confirmation par email.
        </p>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[var(--color-bg-secondary)] text-sm font-600">
          <Package size={15} />
          Numéro de commande : <strong>{id}</strong>
        </div>
      </div>

      {/* Confirmation email notice */}
      <div className="card p-4 mb-5 flex items-center gap-3 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]">
        <Mail size={18} className="text-[var(--color-primary-500)] shrink-0" />
        <p className="text-sm text-[var(--color-primary-700)]">
          Un email de confirmation a été envoyé à <strong>{address.email}</strong>
        </p>
      </div>

      {/* Order Timeline (preview) */}
      <div className="card p-5 mb-5">
        <h2 className="text-sm font-700 mb-4">Suivi de commande</h2>
        <div className="flex items-center gap-0">
          {[
            { label: 'Reçue', active: true },
            { label: 'Payée', active: true },
            { label: 'Expédiée', active: false },
            { label: 'Livrée', active: false },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 ${step.active ? 'bg-[var(--color-success-500)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]'}`}>
                  {step.active ? '✓' : i + 1}
                </div>
                <span className="text-[0.65rem] text-[var(--color-text-muted)] text-center whitespace-nowrap">{step.label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mb-5 ${step.active && arr[i + 1].active ? 'bg-[var(--color-success-500)]' : 'bg-[var(--color-border)]'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm text-[var(--color-text-muted)]">
          <Clock size={14} />
          Livraison estimée : {formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString())} — {formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())}
        </div>
      </div>

      {/* Items */}
      <div className="card p-5 mb-5">
        <h2 className="text-sm font-700 mb-4">Articles commandés ({items?.length})</h2>
        <div className="flex flex-col gap-3">
          {items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-[var(--radius-md)] object-cover bg-[var(--color-bg-secondary)]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600 line-clamp-1">{item.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Qté : {item.quantity}</p>
              </div>
              <span className="text-sm font-700 shrink-0">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-border)] mt-4 pt-3 flex flex-col gap-1.5 text-sm">
          {promoDiscount > 0 && (
            <div className="flex justify-between text-[var(--color-success-600)]">
              <span>Réduction promo</span><span>-{formatPrice(promoDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>TVA</span><span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Livraison</span><span>{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between font-800 text-base pt-1">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="card p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-[var(--color-primary-500)]" />
          <h2 className="text-sm font-700">Adresse de livraison</h2>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {address.firstName} {address.lastName}<br />
          {address.street}<br />
          {address.zip} {address.city}, {address.country}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/profile/orders" className="btn btn-outline flex-1">
          Voir mes commandes
        </Link>
        <Link to="/products" className="btn btn-primary flex-1">
          Continuer mes achats
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
