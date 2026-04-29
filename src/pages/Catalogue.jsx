import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import FilterPanel from '../components/ui/FilterPanel'
import { PRODUCTS } from '../data/mockProducts'

const ITEMS_PER_PAGE = 12
const SORT_OPTIONS = [
  { value: 'popular', label: 'Popularité' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'rating', label: 'Meilleures notes' },
]

const DEFAULT_FILTERS = {
  categories: [],
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
}

export default function Catalogue() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
  })
  const [sortBy, setSortBy] = useState('popular')
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSearchQuery('')
    setPage(1)
  }, [])

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      const q = searchQuery.toLowerCase()
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false
      if (filters.minRating > 0 && p.rating < filters.minRating) return false
      if (searchParams.get('isSale') === 'true' && !p.isSale) return false
      if (searchParams.get('isNew') === 'true' && !p.isNew) return false
      return true
    })

    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      default: result.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    return result
  }, [filters, sortBy, searchQuery, searchParams])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000 ||
    filters.minRating > 0 ||
    searchQuery.length > 0

  return (
    <div className="container-page py-8">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="section-title">Catalogue</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {filtered.length} produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden btn btn-outline btn-sm"
        >
          <SlidersHorizontal size={14} />
          Filtres
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-[var(--color-primary-500)] text-white text-[0.625rem] font-700 flex items-center justify-center">
              {(filters.categories.length + (filters.minRating > 0 ? 1 : 0) + (filters.minPrice > 0 || filters.maxPrice < 2000 ? 1 : 0))}
            </span>
          )}
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="search"
            placeholder="Rechercher dans le catalogue..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            className="input pl-9 text-sm h-9"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown size={14} className="text-[var(--color-text-muted)]" />
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
            className="input text-sm h-9 w-auto pr-8 cursor-pointer"
            aria-label="Trier par"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button onClick={handleReset} className="btn btn-ghost btn-sm text-[var(--color-error-500)]">
            <X size={14} />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop always visible, mobile overlay */}
        <div className={[
          'w-64 shrink-0',
          'lg:block',
          sidebarOpen ? 'block' : 'hidden',
        ].join(' ')}>
          {/* Mobile overlay backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className={[
            'lg:static lg:z-auto',
            sidebarOpen ? 'fixed left-0 top-0 bottom-0 w-72 z-30 overflow-y-auto bg-white shadow-[var(--shadow-modal)] p-4 lg:p-0' : '',
          ].join(' ')}>
            {sidebarOpen && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <span className="font-700 text-sm">Filtres</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={18} />
                </button>
              </div>
            )}
            <FilterPanel filters={filters} onChange={handleFiltersChange} onReset={handleReset} />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-lg font-700 text-[var(--color-text)] mb-2">Aucun résultat trouvé</h3>
              <p className="text-[var(--color-text-muted)] mb-6">
                Essayez de modifier vos filtres ou votre recherche.
              </p>
              <button onClick={handleReset} className="btn btn-primary">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10" role="navigation" aria-label="Pagination">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-ghost btn-sm"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      aria-current={p === page ? 'page' : undefined}
                      className={[
                        'w-9 h-9 rounded-[var(--radius-md)] text-sm font-500 transition-colors',
                        p === page
                          ? 'bg-[var(--color-primary-500)] text-white'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]',
                      ].join(' ')}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn btn-ghost btn-sm"
                    aria-label="Page suivante"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
