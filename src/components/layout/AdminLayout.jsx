import { Outlet, Navigate } from 'react-router-dom'
import AdminSidebar from '../ui/AdminSidebar'
import useAuthStore from '../../store/authStore'

export default function AdminLayout() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login?redirect=/admin" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)]">
        <main className="flex-1 p-6 lg:p-8 overflow-auto" id="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
