import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, User, Heart, Menu, X, Store, ChevronDown } from 'lucide-react'
import CartIcon from '../ui/CartIcon'
import useAuthStore from '../../store/authStore'
import useWishlistStore from '../../store/wishlistStore'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated, user, logout } = useAuthStore()
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { to: '/products', label: 'Catalogue' },
    { to: '/products?category=electronics', label: 'Électronique' },
    { to: '/products?category=clothing', label: 'Vêtements' },
    { to: '/products?category=home', label: 'Maison' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--color-border)]" role="banner">
      <div className="container-page">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-2">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-primary-500)] flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <span className="font-display font-800 text-lg text-[var(--color-text)] tracking-tight">
              Shop<span className="text-[var(--color-primary-500)]">Zen</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-500 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm ml-auto relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="search"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-2 text-sm h-9 bg-[var(--color-bg-secondary)] border-transparent focus:bg-white"
              aria-label="Rechercher"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-2">
            {/* Wishlist */}
            <Link
              to="/profile/wishlist"
              className="relative flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              aria-label={`Favoris — ${wishlistCount} produit${wishlistCount !== 1 ? 's' : ''}`}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-[var(--color-accent-500)] text-white text-[0.625rem] font-700 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <CartIcon />

            {/* User */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                  <img
                    src={`https://i.pravatar.cc/28?u=${user?.email}`}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <ChevronDown size={13} className="text-[var(--color-text-muted)]" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 card shadow-[var(--shadow-dropdown)] py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <p className="px-3 py-1.5 text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border)] mb-1">
                    {user?.name}
                  </p>
                  {[
                    { to: '/profile', label: 'Mon profil' },
                    { to: '/profile/orders', label: 'Mes commandes' },
                    { to: '/profile/wishlist', label: 'Mes favoris' },
                    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Administration' }] : []),
                  ].map((item) => (
                    <Link key={item.to} to={item.to} className="block px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]">
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-[var(--color-border)] mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-3 py-1.5 text-sm text-[var(--color-error-500)] hover:bg-[var(--color-error-50)]"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm hidden sm:inline-flex">
                <User size={14} />
                Connexion
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-secondary)]"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white px-4 py-4 flex flex-col gap-2">
          <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 text-sm"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">OK</button>
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-500 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-primary mt-2">
              Connexion / Inscription
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
