import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Camera, Check } from 'lucide-react'
import ProfileLayout from './ProfileLayout'
import useAuthStore from '../../store/authStore'

export default function Profile() {
  const { isAuthenticated, user, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.street || '',
    city: user?.city || '',
    zip: user?.zip || '',
  })
  const [saved, setSaved] = useState(false)

  if (!isAuthenticated) return <Navigate to="/login?redirect=/profile" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUser(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ProfileLayout>
      <div className="max-w-xl">
        <h1 className="section-title mb-6">Mon profil</h1>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={`https://i.pravatar.cc/80?u=${user?.email}`}
              alt={user?.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[var(--color-primary-100)]"
            />
            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--color-primary-500)] text-white flex items-center justify-center"
              aria-label="Changer la photo"
            >
              <Camera size={13} />
            </button>
          </div>
          <div>
            <p className="font-700 text-[var(--color-text)]">{user?.name}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{user?.email}</p>
            <span className="badge bg-[var(--color-primary-50)] text-[var(--color-primary-500)] mt-1">
              {user?.role === 'admin' ? '🛡️ Administrateur' : '👤 Client'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="name">Nom complet</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input id="name" type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="phone">Téléphone</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+33 6 12 34 56 78" className="input pl-9" />
              </div>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input id="email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="input pl-9" />
            </div>
          </div>
          <div className="h-px bg-[var(--color-border)]" />
          <h3 className="text-sm font-700 text-[var(--color-text)]">Adresse par défaut</h3>
          <div>
            <label className="label" htmlFor="street">Rue</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input id="street" type="text" value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} placeholder="12 Rue de la Paix" className="input pl-9" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="zip">Code postal</label>
              <input id="zip" type="text" value={form.zip} onChange={(e) => setForm((p) => ({ ...p, zip: e.target.value }))} placeholder="75001" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="city">Ville</label>
              <input id="city" type="text" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="Paris" className="input" />
            </div>
          </div>
          <button type="submit" className={`btn flex items-center justify-center gap-2 ${saved ? 'bg-[var(--color-success-500)] border-[var(--color-success-500)] text-white' : 'btn-primary'}`}>
            {saved ? <><Check size={15} /> Sauvegardé !</> : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </ProfileLayout>
  )
}
