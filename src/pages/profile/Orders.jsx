import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import ProfileLayout from './ProfileLayout'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { MOCK_ORDERS } from '../../data/mockOrders'
import { formatPrice, formatDate } from '../../utils/formatters'

export default function Orders() {
  return (
    <ProfileLayout>
      <h1 className="section-title mb-6">Mes commandes</h1>
      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-16 card">
          <Package size={48} className="mx-auto text-[var(--color-text-muted)] opacity-30 mb-3" />
          <p className="text-[var(--color-text-muted)]">Aucune commande pour le moment.</p>
          <Link to="/products" className="btn btn-primary mt-4">Commencer mes achats</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <p className="text-sm font-700 text-[var(--color-text)]">#{order.id}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Commandé le {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-1 text-xs text-[var(--color-primary-500)] font-500 hover:text-[var(--color-primary-600)]"
                  >
                    Suivre <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hidden pb-1">
                {order.items.map((item) => (
                  <div key={item.productId} className="shrink-0 flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-[var(--radius-md)] object-cover bg-[var(--color-bg-secondary)]" />
                    <div className="min-w-0 hidden sm:block">
                      <p className="text-xs font-600 line-clamp-1 max-w-[150px]">{item.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-border)]">
                <span className="text-xs text-[var(--color-text-muted)]">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} article{order.items.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''}
                </span>
                <span className="text-sm font-800">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfileLayout>
  )
}
