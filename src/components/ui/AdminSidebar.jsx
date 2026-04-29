import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, FolderOpen, ShoppingBag,
  Users, Tag, LogOut, ChevronRight, Store, BarChart2,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/admin/products', icon: Package, label: 'Produits' },
  { to: '/admin/categories', icon: FolderOpen, label: 'Catégories' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Commandes' },
  { to: '/admin/customers', icon: Users, label: 'Clients' },
  { to: '/admin/promotions', icon: Tag, label: 'Promotions' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytiques' },
]

export default function AdminSidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 shrink-0 bg-[var(--color-text)] text-white flex flex-col min-h-screen">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-primary-500)] flex items-center justify-center">
          <Store size={18} />
        </div>
        <div>
          <p className="font-700 text-sm leading-tight">ShopZen Admin</p>
          <p className="text-[0.65rem] text-white/50 leading-tight">Tableau de bord</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5" aria-label="Navigation admin">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-500 transition-all duration-150 group',
                isActive
                  ? 'bg-[var(--color-primary-500)] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/8',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </span>
                {isActive && <ChevronRight size={14} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] bg-white/5 mb-2">
          <img
            src={`https://i.pravatar.cc/32?u=${user?.email}`}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-600 truncate">{user?.name || 'Admin'}</p>
            <p className="text-[0.65rem] text-white/50 truncate">{user?.email || 'admin@shop.fr'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors w-full"
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
