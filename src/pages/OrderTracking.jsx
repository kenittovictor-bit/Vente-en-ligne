import { useParams, Link } from 'react-router-dom'
import { Package, MapPin, Check, Clock, Truck, Home, X } from 'lucide-react'
import OrderStatusBadge from '../components/ui/OrderStatusBadge'
import { MOCK_ORDERS } from '../data/mockOrders'
import { formatPrice, formatDateTime } from '../utils/formatters'

const STATUS_ICONS = {
  pending: Clock,
  paid: Check,
  shipped: Truck,
  delivered: Home,
  cancelled: X,
}

export default function OrderTracking() {
  const { id } = useParams()
  const order = MOCK_ORDERS.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h1 className="section-title mb-3">Commande introuvable</h1>
        <p className="text-[var(--color-text-muted)] mb-6">La commande {id} n'existe pas ou n'est plus accessible.</p>
        <Link to="/profile/orders" className="btn btn-primary">Voir mes commandes</Link>
      </div>
    )
  }

  const completedStatuses = order.timeline.map((t) => t.status)

  return (
    <div className="container-page py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="section-title mb-1">Suivi de commande</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Commande #{order.id}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Timeline */}
      <div className="card p-6 mb-6">
        <h2 className="text-sm font-700 mb-5">Historique</h2>
        <div className="flex flex-col gap-0">
          {order.timeline.map((event, i) => {
            const Icon = STATUS_ICONS[event.status] || Clock
            const isLast = i === order.timeline.length - 1
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${i === order.timeline.length - 1 ? 'bg-[var(--color-primary-500)] text-white' : 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'}`}>
                    <Icon size={16} />
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 bg-[var(--color-border)] my-1 min-h-[2rem]" />}
                </div>
                <div className={`${isLast ? 'pb-0' : 'pb-5'}`}>
                  <p className="text-sm font-600 text-[var(--color-text)]">{event.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatDateTime(event.date)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Items */}
      <div className="card p-5 mb-5">
        <h2 className="text-sm font-700 mb-4">Articles</h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-[var(--radius-md)] object-cover bg-[var(--color-bg-secondary)]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600">{item.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Qté : {item.quantity}</p>
              </div>
              <span className="text-sm font-700">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-border)] mt-4 pt-3 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-[var(--color-text-secondary)]"><span>TVA</span><span>{formatPrice(order.tax)}</span></div>
          <div className="flex justify-between text-[var(--color-text-secondary)]"><span>Livraison</span><span>{order.shipping === 0 ? 'Offerte' : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between font-800 text-base pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      {/* Address */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={15} className="text-[var(--color-primary-500)]" />
          <h2 className="text-sm font-700">Adresse de livraison</h2>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {order.address.name}<br />
          {order.address.street}<br />
          {order.address.zip} {order.address.city}, {order.address.country}
        </p>
      </div>

      <div className="flex gap-3">
        <Link to="/profile/orders" className="btn btn-outline flex-1">Toutes mes commandes</Link>
        <Link to="/products" className="btn btn-primary flex-1">Continuer mes achats</Link>
      </div>
    </div>
  )
}
