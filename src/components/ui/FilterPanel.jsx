import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { CATEGORIES } from '../../data/mockProducts'
import StarRating from './StarRating'
import { formatPrice } from '../../utils/formatters'

export default function FilterPanel({ filters, onChange, onReset }) {
  const [openSections, setOpenSections] = useState({ categories: true, price: true, rating: true })

  const toggle = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))

  const handleCategory = (id) => {
    const current = filters.categories || []
    const updated = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id]
    onChange({ ...filters, categories: updated })
  }

  const hasActiveFilters =
    (filters.categories?.length > 0) ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000 ||
    filters.minRating > 0

  return (
    <aside className="card p-5 flex flex-col gap-0" aria-label="Filtres">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-700 text-[var(--color-text)] uppercase tracking-widest">Filtres</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] flex items-center gap-1 font-500"
          >
            <X size={12} />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--color-border)] -mx-5 mb-4" />

      {/* Categories */}
      <FilterSection title="Catégories" open={openSections.categories} onToggle={() => toggle('categories')}>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.categories || []).includes(cat.id)}
                onChange={() => handleCategory(cat.id)}
                className="w-4 h-4 rounded-xs border-[var(--color-border-strong)] text-[var(--color-primary-500)] cursor-pointer accent-[var(--color-primary-500)]"
              />
              <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] flex items-center gap-1.5">
                <span>{cat.icon}</span>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="h-px bg-[var(--color-border)] -mx-5 my-4" />

      {/* Price Range */}
      <FilterSection title="Fourchette de prix" open={openSections.price} onToggle={() => toggle('price')}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
            <span>{formatPrice(filters.minPrice || 0)}</span>
            <span>{formatPrice(filters.maxPrice || 2000)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={2000}
            step={10}
            value={filters.maxPrice || 2000}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-[var(--color-primary-500)] cursor-pointer"
            aria-label="Prix maximum"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-[var(--color-text-muted)]">Min (€)</label>
              <input
                type="number"
                min={0}
                max={filters.maxPrice || 2000}
                value={filters.minPrice || 0}
                onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) })}
                className="input text-xs py-1.5 mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[var(--color-text-muted)]">Max (€)</label>
              <input
                type="number"
                min={filters.minPrice || 0}
                max={2000}
                value={filters.maxPrice || 2000}
                onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="input text-xs py-1.5 mt-1"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      <div className="h-px bg-[var(--color-border)] -mx-5 my-4" />

      {/* Min Rating */}
      <FilterSection title="Note minimale" open={openSections.rating} onToggle={() => toggle('rating')}>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === stars}
                onChange={() => onChange({ ...filters, minRating: stars })}
                className="w-4 h-4 cursor-pointer accent-[var(--color-primary-500)]"
              />
              <span className="flex items-center gap-1.5">
                <StarRating rating={stars} size={13} />
                <span className="text-xs text-[var(--color-text-muted)]">& plus</span>
              </span>
            </label>
          ))}
          {filters.minRating > 0 && (
            <button
              onClick={() => onChange({ ...filters, minRating: 0 })}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-left mt-1"
            >
              Effacer la note
            </button>
          )}
        </div>
      </FilterSection>
    </aside>
  )
}

function FilterSection({ title, open, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-1 group"
        aria-expanded={open}
      >
        <span className="text-sm font-600 text-[var(--color-text)]">{title}</span>
        {open ? (
          <ChevronUp size={15} stroke="var(--color-text-muted)" />
        ) : (
          <ChevronDown size={15} stroke="var(--color-text-muted)" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}
