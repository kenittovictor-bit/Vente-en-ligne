import { TrendingUp, ShoppingBag, Package, Users, ArrowUp, ArrowDown, DollarSign } from 'lucide-react'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { MOCK_ORDERS } from '../../data/mockOrders'
import { PRODUCTS } from '../../data/mockProducts'
import { formatPrice, formatDate } from '../../utils/formatters'

const STATS = [
  {
    label: "Chiffre d'affaires",
    value: '12 480,50€',
    change: '+18.2%',
    trend: 'up',
    Icon: DollarSign,
    bg: 'bg-[var(--color-primary-50)]',
    color: 'text-[var(--color-primary-500)]',
  },
  {
    label: 'Commandes ce mois',
    value: '84',
    change: '+6.4%',
    trend: 'up',
    Icon: ShoppingBag,
    bg: 'bg-[var(--color-success-50)]',
    color: 'text-[var(--color-success-600)]',
  },
  {
    label: 'Produits actifs',
    value: PRODUCTS.length.toString(),
    change: '+3',
    trend: 'up',
    Icon: Package,
    bg: 'bg-[var(--color-warning-50)]',
    color: 'text-[var(--color-warning-600)]',
  },
  {
    label: 'Clients inscrits',
    value: '1 247',
    change: '+12.1%',
    trend: 'up',
    Icon: Users,
    bg: 'bg-[var(--color-accent-50)]',
    color: 'text-[var(--color-accent-500)]',
  },
]

const TOP_PRODUCTS = PRODUCTS.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5)

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-800 text-[var(--color-text)]">Tableau de bord</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Bienvenue — voici un aperçu de votre boutique</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, trend, Icon, bg, color }) => (
          <div key={label} className="card p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-[var(--radius-lg)] ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">{label}</p>
              <p className="text-2xl font-800 text-[var(--color-text)] leading-tight">{value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-600 ${trend === 'up' ? 'text-[var(--color-success-600)]' : 'text-[var(--color-error-500)]'}`}>
                {trend === 'up' ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                {change} vs mois dernier
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-700 uppercase tracking-wide text-[var(--color-text)]">Commandes récentes</h2>
            <a href="/admin/orders" className="text-xs text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-500">Voir tout</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  {['N° commande', 'Client', 'Montant', 'Statut', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                    <td className="px-4 py-3 font-600 text-[var(--color-primary-500)] whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{order.address.name}</td>
                    <td className="px-4 py-3 font-700">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)] whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-700 uppercase tracking-wide">Produits populaires</h2>
          </div>
          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-secondary)] transition-colors">
                <span className="w-5 text-xs font-700 text-[var(--color-text-muted)]">{i + 1}</span>
                <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-[var(--radius-md)] object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-600 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{product.reviewCount} ventes</p>
                </div>
                <span className="text-sm font-700 shrink-0">{formatPrice(product.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
