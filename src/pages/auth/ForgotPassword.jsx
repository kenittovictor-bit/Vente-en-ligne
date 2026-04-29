import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, Store } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez entrer une adresse email valide.')
      return
    }
    setLoading(true)
    setError('')
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 900)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-[var(--color-primary-500)] flex items-center justify-center mx-auto mb-4">
            <Store size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-800">Mot de passe oublié</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {sent ? (
          <div className="card p-8 text-center">
            <CheckCircle size={48} className="mx-auto text-[var(--color-success-500)] mb-4" />
            <h2 className="font-700 text-lg mb-2">Email envoyé !</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Un email de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception.
            </p>
            <Link to="/login" className="btn btn-primary w-full">Retour à la connexion</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4" noValidate>
            <div>
              <label className="label" htmlFor="email">Adresse email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@email.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input pl-9 ${error ? 'input-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {error && <p className="text-xs text-[var(--color-error-500)] mt-1">{error}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi...
                </span>
              ) : 'Envoyer le lien'}
            </button>
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              <ArrowLeft size={14} />
              Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
