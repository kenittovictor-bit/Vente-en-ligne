import { Tag, X, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import useCartStore from '../../store/cartStore'

export default function PromoBanner() {
  const { promoCode, applyPromoCode, removePromoCode } = useCartStore()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleApply = () => {
    if (!code.trim()) return
    setLoading(true)
    setMessage(null)
    setError(null)
    setTimeout(() => {
      const result = applyPromoCode(code)
      if (result.success) {
        setMessage(result.message)
        setCode('')
      } else {
        setError(result.message)
      }
      setLoading(false)
    }, 400)
  }

  if (promoCode) {
    return (
      <div className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-success-50)] border border-[var(--color-success-500)]/20">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} stroke="var(--color-success-600)" />
          <div>
            <span className="text-sm font-600 text-[var(--color-success-600)]">{promoCode.id}</span>
            <span className="text-xs text-[var(--color-success-600)] ml-2">— {promoCode.description}</span>
          </div>
        </div>
        <button
          onClick={removePromoCode}
          className="text-[var(--color-success-600)] hover:text-[var(--color-success-600)]/70 p-1"
          aria-label="Retirer le code promo"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Code promo (ex: WELCOME10)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className={`input pl-9 ${error ? 'input-error' : ''}`}
            aria-label="Code promo"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="btn btn-outline shrink-0"
        >
          {loading ? '...' : 'Appliquer'}
        </button>
      </div>
      {error && <p className="text-xs text-[var(--color-error-500)]">{error}</p>}
      {message && <p className="text-xs text-[var(--color-success-600)]">{message}</p>}
    </div>
  )
}
