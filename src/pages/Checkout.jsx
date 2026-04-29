import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight, CreditCard, Smartphone, Lock, Check } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import { formatPrice, generateOrderId } from '../utils/formatters'

const STEPS = ['Adresse', 'Paiement', 'Confirmation']

const INITIAL_ADDRESS = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', zip: '', country: 'France',
}

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState(INITIAL_ADDRESS)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { items, getSubtotal, getTax, getShipping, getTotal, promoDiscount, clearCart } = useCartStore()
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  const subtotal = getSubtotal()
  const tax = getTax()
  const shipping = getShipping()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="section-title mb-4">Panier vide</h1>
        <Link to="/products" className="btn btn-primary">Découvrir le catalogue</Link>
      </div>
    )
  }

  const validateAddress = () => {
    const errs = {}
    if (!address.firstName.trim()) errs.firstName = 'Prénom requis'
    if (!address.lastName.trim()) errs.lastName = 'Nom requis'
    if (!address.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errs.email = 'Email valide requis'
    if (!address.street.trim()) errs.street = 'Adresse requise'
    if (!address.city.trim()) errs.city = 'Ville requise'
    if (!address.zip.trim() || !/^\d{5}$/.test(address.zip)) errs.zip = 'Code postal à 5 chiffres'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    if (validateAddress()) setStep(1)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const orderId = generateOrderId()
    setTimeout(() => {
      clearCart()
      navigate(`/order-confirmation/${orderId}`, {
        state: { address, items, subtotal, tax, shipping, total, promoDiscount },
      })
      setLoading(false)
    }, 1500)
  }

  const Field = ({ name, label, type = 'text', placeholder, ...rest }) => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={address[name] || ''}
        onChange={(e) => setAddress((prev) => ({ ...prev, [name]: e.target.value }))}
        className={`input ${errors[name] ? 'input-error' : ''}`}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...rest}
      />
      {errors[name] && <p id={`${name}-error`} className="text-xs text-[var(--color-error-500)] mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="container-page py-8 max-w-5xl">
      <h1 className="section-title mb-6">Commande</h1>

      {/* Stepper */}
      <nav className="flex items-center gap-0 mb-8" aria-label="Étapes de commande">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-0 flex-1">
            <div className="flex items-center gap-2">
              <div className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-700 transition-all',
                i < step ? 'bg-[var(--color-success-500)] text-white'
                  : i === step ? 'bg-[var(--color-primary-500)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]',
              ].join(' ')}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-600 hidden sm:block ${i === step ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-[var(--color-success-500)]' : 'bg-[var(--color-border)]'}`} />
            )}
          </div>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 0 — Address */}
          {step === 0 && (
            <form onSubmit={handleAddressSubmit} className="card p-6 flex flex-col gap-4" noValidate>
              <h2 className="text-base font-700 text-[var(--color-text)]">Adresse de livraison</h2>

              {!isAuthenticated && (
                <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-sm">
                  <span className="text-[var(--color-primary-600)]">Vous pouvez aussi vous connecter pour un paiement plus rapide.</span>
                  <Link to="/login?redirect=/checkout" className="btn btn-primary btn-sm">Connexion</Link>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field name="firstName" label="Prénom *" placeholder="Jean" />
                <Field name="lastName" label="Nom *" placeholder="Dupont" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field name="email" label="Email *" type="email" placeholder="jean.dupont@email.fr" />
                <Field name="phone" label="Téléphone" type="tel" placeholder="+33 6 12 34 56 78" />
              </div>
              <Field name="street" label="Adresse *" placeholder="12 Rue de la Paix" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field name="zip" label="Code postal *" placeholder="75001" />
                <div className="sm:col-span-2">
                  <Field name="city" label="Ville *" placeholder="Paris" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="country">Pays</label>
                <select
                  id="country"
                  value={address.country}
                  onChange={(e) => setAddress((p) => ({ ...p, country: e.target.value }))}
                  className="input"
                >
                  {['France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-lg mt-2">
                Continuer vers le paiement
                <ChevronRight size={16} />
              </button>
            </form>
          )}

          {/* Step 1 — Payment */}
          {step === 1 && (
            <form onSubmit={handlePaymentSubmit} className="card p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-700">Mode de paiement</h2>
                <div className="flex items-center gap-1 text-xs text-[var(--color-success-600)]">
                  <Lock size={12} />
                  Paiement sécurisé SSL
                </div>
              </div>

              {/* Payment methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'card', label: 'Carte bancaire', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: Smartphone },
                ].map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className={[
                      'flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border-2 cursor-pointer transition-all',
                      paymentMethod === id
                        ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      className="sr-only"
                    />
                    <Icon size={20} className={paymentMethod === id ? 'text-[var(--color-primary-500)]' : 'text-[var(--color-text-muted)]'} />
                    <span className="text-sm font-600">{label}</span>
                    {paymentMethod === id && <Check size={14} className="ml-auto text-[var(--color-primary-500)]" />}
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="label">Numéro de carte</label>
                    <input type="text" placeholder="•••• •••• •••• ••••" className="input" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Date d'expiration</label>
                      <input type="text" placeholder="MM/AA" className="input" maxLength={5} />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input type="text" placeholder="•••" className="input" maxLength={4} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Nom sur la carte</label>
                    <input type="text" placeholder="Jean Dupont" className="input" />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    🔒 Les données de votre carte sont traitées de manière sécurisée via Stripe. Elles ne sont jamais stockées sur nos serveurs.
                  </p>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="text-center py-6">
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">
                    Vous serez redirigé vers PayPal pour finaliser le paiement.
                  </p>
                  <div className="inline-block bg-[#003087] text-white px-6 py-3 rounded-[var(--radius-md)] font-700 text-sm">
                    Pay<span className="text-[#009cde]">Pal</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setStep(0)} className="btn btn-outline">
                  Retour
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg flex-1">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Traitement...
                    </span>
                  ) : (
                    <>
                      <Lock size={15} />
                      Payer {formatPrice(total)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="card p-5 h-fit flex flex-col gap-3">
          <h3 className="text-sm font-700 uppercase tracking-widest">Votre commande</h3>
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto scrollbar-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative">
                  <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-[var(--radius-md)] object-cover bg-[var(--color-bg-secondary)]" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--color-text)] text-white rounded-full text-[0.625rem] font-700 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-600 line-clamp-2">{item.name}</p>
                </div>
                <span className="text-sm font-700 shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-[var(--color-border)]" />
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>Sous-total</span><span>{formatPrice(subtotal)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[var(--color-success-600)]">
                <span>Réduction</span><span>-{formatPrice(promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>TVA</span><span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>Livraison</span>
              <span className={shipping === 0 ? 'text-[var(--color-success-600)]' : ''}>{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="h-px bg-[var(--color-border)]" />
          <div className="flex justify-between font-800 text-base">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
