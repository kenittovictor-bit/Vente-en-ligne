import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Store } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const validate = () => {
    const errs = {}
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email valide requis'
    if (!form.password || form.password.length < 6) errs.password = 'Mot de passe requis (min 6 caractères)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return
    setLoading(true)
    // Simulate API call — demo login
    setTimeout(() => {
      const isAdmin = form.email.includes('admin')
      login(
        { name: isAdmin ? 'Admin ShopZen' : 'Jean Dupont', email: form.email, role: isAdmin ? 'admin' : 'customer' },
        'demo-jwt-token-' + Date.now()
      )
      navigate(redirect)
      setLoading(false)
    }, 800)
  }

  const handleDemoLogin = (role) => {
    const email = role === 'admin' ? 'admin@shopzen.fr' : 'jean.dupont@email.fr'
    setForm({ email, password: 'demo123' })
    setTimeout(() => {
      login(
        { name: role === 'admin' ? 'Admin ShopZen' : 'Jean Dupont', email, role },
        'demo-jwt-token-' + Date.now()
      )
      navigate(redirect)
    }, 300)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-[var(--color-primary-500)] flex items-center justify-center mx-auto mb-4">
            <Store size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-800 text-[var(--color-text)]">Connexion</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-[var(--color-primary-500)] font-500 hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>

        {/* Demo Login Buttons */}
        <div className="flex gap-2 mb-5">
          <button onClick={() => handleDemoLogin('customer')} className="btn btn-outline btn-sm flex-1 text-xs">
            Demo client
          </button>
          <button onClick={() => handleDemoLogin('admin')} className="btn btn-outline btn-sm flex-1 text-xs">
            Demo admin
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-muted)]">ou</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {apiError && (
          <div className="mb-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-error-50)] text-sm text-[var(--color-error-600)]">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4" noValidate>
          {/* Email */}
          <div>
            <label className="label" htmlFor="email">Adresse email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                id="email"
                type="email"
                placeholder="jean.dupont@email.fr"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-xs text-[var(--color-error-500)] mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0" htmlFor="password">Mot de passe</label>
              <Link to="/forgot-password" className="text-xs text-[var(--color-primary-500)] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                aria-label={showPwd ? 'Masquer' : 'Afficher'}
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[var(--color-error-500)] mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg mt-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion...
              </span>
            ) : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
