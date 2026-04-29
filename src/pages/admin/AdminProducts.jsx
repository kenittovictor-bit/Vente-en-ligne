import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Package, Eye } from 'lucide-react'
import { PRODUCTS, CATEGORIES } from '../../data/mockProducts'
import { formatPrice } from '../../utils/formatters'

export default function AdminProducts() {
  const [products, setProducts] = useState(PRODUCTS)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter && p.category !== categoryFilter) return false
    return true
  })

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-800 text-[var(--color-text)]">Produits</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{filtered.length} produit{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditProduct(null); setModalOpen(true) }} className="btn btn-primary">
          <Plus size={15} />
          Ajouter un produit
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="search"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm h-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input text-sm h-9 w-auto pr-8"
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                {['Produit', 'Catégorie', 'Prix', 'Stock', 'Note', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-[var(--radius-md)] object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-600 line-clamp-1">{product.name}</p>
                        <div className="flex gap-1 mt-0.5">
                          {product.isNew && <span className="badge bg-[var(--color-primary-50)] text-[var(--color-primary-500)] text-[0.6rem]">Nouveau</span>}
                          {product.isSale && <span className="badge bg-[var(--color-accent-50)] text-[var(--color-accent-500)] text-[0.6rem]">Promo</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] capitalize">{product.category}</td>
                  <td className="px-4 py-3 font-700">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${product.stock <= 5 ? 'bg-[var(--color-error-50)] text-[var(--color-error-600)]' : product.stock <= 15 ? 'bg-[var(--color-warning-50)] text-[var(--color-warning-600)]' : 'bg-[var(--color-success-50)] text-[var(--color-success-600)]'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--color-warning-500)]">★</span>
                      <span className="font-600">{product.rating}</span>
                      <span className="text-[var(--color-text-muted)]">({product.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)]" aria-label="Voir">
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => { setEditProduct(product); setModalOpen(true) }}
                        className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)]"
                        aria-label="Modifier"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 rounded hover:bg-[var(--color-error-50)] text-[var(--color-text-muted)] hover:text-[var(--color-error-500)]"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <ProductModal
          product={editProduct}
          onClose={() => setModalOpen(false)}
          onSave={(data) => {
            if (editProduct) {
              setProducts((prev) => prev.map((p) => p.id === editProduct.id ? { ...p, ...data } : p))
            } else {
              setProducts((prev) => [...prev, { ...data, id: Date.now().toString(), images: ['https://picsum.photos/400/400'], reviewCount: 0, rating: 0, createdAt: new Date().toISOString() }])
            }
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    category: product?.category || 'electronics',
    stock: product?.stock || '',
    description: product?.description || '',
    isNew: product?.isNew || false,
    isSale: product?.isSale || false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, price: parseFloat(form.price), originalPrice: parseFloat(form.originalPrice || form.price), stock: parseInt(form.stock) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-base font-700">{product ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <button onClick={onClose} className="btn btn-ghost !px-2 !py-1">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="label">Nom *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prix (€) *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="input" required />
            </div>
            <div>
              <label className="label">Prix original (€)</label>
              <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: e.target.value }))} className="input" placeholder="Vide = pas de promo" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Catégorie</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Stock *</label>
              <input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="input resize-none" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((p) => ({ ...p, isNew: e.target.checked }))} className="accent-[var(--color-primary-500)]" />
              Nouveau
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isSale} onChange={(e) => setForm((p) => ({ ...p, isSale: e.target.checked }))} className="accent-[var(--color-primary-500)]" />
              En promotion
            </label>
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">Annuler</button>
            <button type="submit" className="btn btn-primary flex-1">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  )
}
