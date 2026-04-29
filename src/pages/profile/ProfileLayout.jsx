import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { User, ShoppingBag, Heart, Star, Settings } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const NAV_ITEMS = [
  { to: '/profile', icon: User, label: 'Mon profil', end: true },
  { to: '/profile/orders', icon: ShoppingBag, label: 'Mes commandes' },
  { to: '/profile/wishlist', icon: Heart, label: 'Ma wishlist' },
  { to: '/profile/reviews', icon: Star, label: 'Mes avis' },
]

export default function ProfileLayout() {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login?redirect=/profile" replace />

  return (
    <div className="container-page py-8">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <aside className="sm:w-52 shrink-0">
          <nav className="card p-2 flex flex-col gap-0.5" aria-label="Navigation du profil">
            {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-500 transition-colors',
                    isActive
                      ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-600'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]',
                  ].join(' ')
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
