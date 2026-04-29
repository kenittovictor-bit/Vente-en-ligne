import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'

export default function CartIcon() {
  const count = useCartStore((s) => s.getItemCount())

  return (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-secondary)] transition-colors"
      aria-label={`Panier — ${count} article${count !== 1 ? 's' : ''}`}
    >
      <ShoppingCart size={20} stroke="var(--color-text)" />
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-[var(--color-accent-500)] text-white text-[0.625rem] font-700 flex items-center justify-center leading-none"
          aria-hidden="true"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
