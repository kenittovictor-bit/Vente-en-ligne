import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User, Store } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', acceptTerms: false })
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Nom complet requis (min 2 caractères)'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email valide requis'
    if (!form.password || form.password.length < 8) errs.password = 'Mot de passe min 8 caractères'
    if (form.password !== form.confirm) errs.confirm = 'Les mots de passe ne correspondent pas'
    if (!form.acceptTerms) errs.acceptTerms = 'Vous devez accepter les CGV'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      login(
        { name: form.name, email: form.email, role: 'customer' },
        'demo-jwt-token-' + Date.now()
      )
      navigate('/')
      setLoading(false)
    }, 900)
  }

  const Field = ({ id, label, type = 'text', placeholder, autoComplete }) => (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={form[id] || ''}
        onChange={(e) => setForm((p) => ({ ...p, [id]: e.target.value }))}
        className={`input ${errors[id] ? 'input-error' : ''}`}
        autoComplete={autoComplete}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      {errors[id] && <p id={`${id}-error`} className="text-xs text-[var(--color-error-500)] mt-1">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-[var(--color-primary-500)] flex items-center justify-center mx-auto mb-4">
            <Store size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-800">Créer un compte</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-[var(--color-primary-500)] font-500 hover:underline">Se connecter</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4" noValidate>
          <Field id="name" label="Nom complet *" placeholder="Jean Dupont" autoComplete="name" />
          <Field id="email" label="Adresse email *" type="email" placeholder="jean.dupont@email.fr" autoComplete="email" />

          <div>
            <label className="label" htmlFor="password">Mot de passe *</label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Min. 8 caractères"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[var(--color-error-500)] mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="label" htmlFor="confirm">Confirmer le mot de passe *</label>
            <input
              id="confirm"
              type={showPwd ? 'text' : 'password'}
              placeholder="Répétez votre mot de passe"
              value={form.confirm}
              onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
              className={`input ${errors.confirm ? 'input-error' : ''}`}
              autoComplete="new-password"
            />
            {errors.confirm && <p className="text-xs text-[var(--color-error-500)] mt-1">{errors.confirm}</p>}
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => setForm((p) => ({ ...p, acceptTerms: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-[var(--color-primary-500)]"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">
              J'accepte les{' '}
              <Link to="/legal" className="text-[var(--color-primary-500)] hover:underline">Conditions Générales de Vente</Link>
              {' '}et la{' '}
              <Link to="/legal" className="text-[var(--color-primary-500)] hover:underline">Politique de confidentialité</Link>
            </span>
          </label>
          {errors.acceptTerms && <p className="text-xs text-[var(--color-error-500)] -mt-2">{errors.acceptTerms}</p>}

          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-primary-50)] text-xs text-[var(--color-primary-700)]">
            🎁 En vous inscrivant, bénéficiez de <strong>10% de réduction</strong> sur votre première commande avec le code <strong>WELCOME10</strong>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg mt-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création...
              </span>
            ) : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  )
}
