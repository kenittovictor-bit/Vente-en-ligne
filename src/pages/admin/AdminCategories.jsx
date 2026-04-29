import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { CATEGORIES } from '../../data/mockProducts'

export default function AdminCategories() {
  const [categories, setCategories] = useState(CATEGORIES)
  const [form, setForm] = useState({ name: '', icon: '' })
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editId) {
      setCategories((prev) => prev.map((c) => c.id === editId ? { ...c, ...form } : c))
      setEditId(null)
    } else {
      setCategories((prev) => [...prev, { id: form.name.toLowerCase().replace(/\s+/g, '-'), ...form }])
    }
    setForm({ name: '', icon: '' })
    setShowForm(false)
  }

  const handleEdit = (cat) => {
    setForm({ name: cat.name, icon: cat.icon })
    setEditId(cat.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette catégorie ?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-800">Catégories</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', icon: '' }) }} className="btn btn-primary">
          <Plus size={15} />
          Nouvelle catégorie
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4">
          <h2 className="text-sm font-700">{editId ? 'Modifier' : 'Nouvelle catégorie'}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nom *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Électronique" className="input" required />
            </div>
            <div>
              <label className="label">Icône (emoji)</label>
              <input type="text" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="Ex: 💻" className="input" />
            </div>
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
              <th className="px-4 py-3 text-left text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide">ID</th>
              <th className="px-4 py-3 text-right text-xs font-600 text-[var(--color-text-muted)] uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5 font-600">
                    <span className="text-xl">{cat.icon}</span>
                    {cat.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs">{cat.id}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(cat)} className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)]">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded hover:bg-[var(--color-error-50)] text-[var(--color-text-muted)] hover:text-[var(--color-error-500)]">
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
  )
}
