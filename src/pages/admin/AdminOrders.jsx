import { useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { MOCK_ORDERS, ORDER_STATUSES, STATUS_LABELS } from '../../data/mockOrders'
import { formatPrice, formatDate } from '../../utils/formatters'

export default function AdminOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = orders.filter((o) => {
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.address.name.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter && o.status !== statusFilter) return false
    return true
  })

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-[var(--color-text)]">Commandes</h1>
        <p className="text-sm text-[var(--color-text-muted)]">{filtered.length} commande{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="search"
            placeholder="Numéro ou client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm h-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input text-sm h-9 w-auto pr-8"
        >
          <option value="">Tous statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                {['N° commande', 'Client', 'Articles', 'Montant', 'Statut', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3">
                    <Link to={`/orders/${order.id}`} className="font-600 text-[var(--color-primary-500)] hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{order.address.name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} article{order.items.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 font-700">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="input text-xs h-8 py-0 pr-7 w-auto"
                      aria-label="Changer le statut"
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
