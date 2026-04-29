import { useState } from 'react'
import { Search, UserCheck, UserX } from 'lucide-react'

const DEMO_CUSTOMERS = [
  { id: 'u1', name: 'Jean Dupont', email: 'jean.dupont@email.fr', orders: 5, total: 489.75, status: 'active', joinedAt: '2024-09-01', avatar: 'https://i.pravatar.cc/40?u=jean' },
  { id: 'u2', name: 'Sophie Martin', email: 'sophie.martin@email.fr', orders: 12, total: 1234.50, status: 'active', joinedAt: '2024-06-15', avatar: 'https://i.pravatar.cc/40?u=sophie' },
  { id: 'u3', name: 'Thomas Legrand', email: 'thomas.legrand@email.fr', orders: 2, total: 89.90, status: 'inactive', joinedAt: '2025-01-10', avatar: 'https://i.pravatar.cc/40?u=thomas' },
  { id: 'u4', name: 'Marie Dubois', email: 'marie.dubois@email.fr', orders: 8, total: 765.20, status: 'active', joinedAt: '2024-11-20', avatar: 'https://i.pravatar.cc/40?u=marie' },
  { id: 'u5', name: 'Pierre Bernard', email: 'pierre.b@email.fr', orders: 1, total: 29.99, status: 'active', joinedAt: '2025-03-05', avatar: 'https://i.pravatar.cc/40?u=pierre' },
]

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS)

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStatus = (id) => {
    setCustomers((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c)
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-800">Clients</h1>
        <p className="text-sm text-[var(--color-text-muted)]">{filtered.length} client{filtered.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="search"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9 text-sm h-9"
        />
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                {['Client', 'Email', 'Commandes', 'Total dépensé', 'Statut', 'Membre depuis', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={customer.avatar} alt={customer.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-600">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{customer.email}</td>
                  <td className="px-4 py-3 font-600">{customer.orders}</td>
                  <td className="px-4 py-3 font-700">{customer.total.toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${customer.status === 'active' ? 'bg-[var(--color-success-50)] text-[var(--color-success-600)]' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      {customer.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] whitespace-nowrap">{customer.joinedAt}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(customer.id)}
                      className={`p-1.5 rounded transition-colors ${customer.status === 'active' ? 'hover:bg-[var(--color-error-50)] text-[var(--color-text-muted)] hover:text-[var(--color-error-500)]' : 'hover:bg-[var(--color-success-50)] text-[var(--color-text-muted)] hover:text-[var(--color-success-600)]'}`}
                      title={customer.status === 'active' ? 'Désactiver' : 'Activer'}
                    >
                      {customer.status === 'active' ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
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
