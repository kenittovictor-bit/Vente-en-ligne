import { useState } from 'react'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import { PROMOTIONS } from '../../data/mockProducts'

export default function AdminPromotions() {
  const [promos, setPromos] = useState(PROMOTIONS)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ id: '', discount: '', type: 'percent', description: '', minOrder: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form, discount: parseFloat(form.discount), minOrder: parseFloat(form.minOrder) }
    if (editId) {
      setPromos((prev) => prev.map((p) => p.id === editId ? data : p))
      setEditId(null)
    } else {
      setPromos((prev) => [...prev, data])
    }
    setForm({ id: '', discount: '', type: 'percent', description: '', minOrder: '' })
    setShowForm(false)
  }

  const handleEdit = (promo) => {
    setForm({ ...promo, discount: promo.discount.toString(), minOrder: promo.minOrder.toString() })
    setEditId(promo.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce code promo ?')) {
      setPromos((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-800">Promotions</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{promos.length} code{promos.length > 1 ? 's' : ''} promo</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ id: '', discount: '', type: 'percent', description: '', minOrder: '' }) }} className="btn btn-primary">
          <Plus size={15} />
          Nouveau code
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-700">{editId ? 'Modifier le code' : 'Créer un code promo'}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Code *</label>
              <input
                type="text"
                value={form.id}
                onChange={(e) => setForm((p) => ({ ...p, id: e.target.value.toUpperCase() }))}
                placeholder="EX: SUMMER20"
                className="input font-mono"
                required
                disabled={!!editId}
              />
            </div>
            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="input">
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (€)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Réduction *</label>
              <input type="number" value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} placeholder={form.type === 'percent' ? '10' : '5'} className="input" required />
            </div>
            <div>
              <label className="label">Commande min (€)</label>
              <input type="number" value={form.minOrder} onChange={(e) => setForm((p) => ({ ...p, minOrder: e.target.value }))} placeholder="30" className="input" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description affichée au client" className="input" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} className="btn btn-outline flex-1">Annuler</button>
            <button type="submit" className="btn btn-primary flex-1">Enregistrer</button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              {['Code', 'Réduction', 'Commande min', 'Description', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <tr key={promo.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-[var(--color-primary-500)]" />
                    <span className="font-mono font-700 text-[var(--color-primary-600)]">{promo.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-700 text-[var(--color-success-600)]">
                  -{promo.discount}{promo.type === 'percent' ? '%' : '€'}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">{promo.minOrder}€</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">{promo.description}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(promo)} className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)]">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(promo.id)} className="p-1.5 rounded hover:bg-[var(--color-error-50)] text-[var(--color-text-muted)] hover:text-[var(--color-error-500)]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
