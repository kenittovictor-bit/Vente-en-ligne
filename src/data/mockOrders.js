export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const STATUS_LABELS = {
  pending: 'En attente',
  paid: 'Payée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export const STATUS_COLORS = {
  pending: { bg: 'bg-[var(--color-warning-50)]', text: 'text-[var(--color-warning-600)]' },
  paid: { bg: 'bg-[var(--color-info-50)]', text: 'text-blue-700' },
  shipped: { bg: 'bg-[var(--color-primary-50)]', text: 'text-[var(--color-primary-600)]' },
  delivered: { bg: 'bg-[var(--color-success-50)]', text: 'text-[var(--color-success-600)]' },
  cancelled: { bg: 'bg-[var(--color-error-50)]', text: 'text-[var(--color-error-600)]' },
}

export const MOCK_ORDERS = [
  {
    id: 'CMD-2025-001',
    status: 'delivered',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-08',
    items: [
      { productId: '1', name: 'Écouteurs Bluetooth Premium', price: 89.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
      { productId: '3', name: 'T-Shirt Coton Bio Premium', price: 29.99, quantity: 2, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=100&q=80' },
    ],
    subtotal: 149.97,
    shipping: 0,
    tax: 29.99,
    total: 179.96,
    address: { name: 'Jean Dupont', street: '12 Rue de la Paix', city: 'Paris', zip: '75001', country: 'France' },
    timeline: [
      { status: 'pending', date: '2025-04-01T10:30:00', label: 'Commande reçue' },
      { status: 'paid', date: '2025-04-01T10:35:00', label: 'Paiement confirmé' },
      { status: 'shipped', date: '2025-04-03T14:00:00', label: 'Expédiée — Colissimo FR829302' },
      { status: 'delivered', date: '2025-04-08T11:15:00', label: 'Livrée avec succès' },
    ],
  },
  {
    id: 'CMD-2025-002',
    status: 'shipped',
    createdAt: '2025-04-20',
    updatedAt: '2025-04-22',
    items: [
      { productId: '2', name: 'Montre Connectée Sport', price: 149.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80' },
    ],
    subtotal: 149.99,
    shipping: 4.90,
    tax: 30.00,
    total: 184.89,
    address: { name: 'Jean Dupont', street: '12 Rue de la Paix', city: 'Paris', zip: '75001', country: 'France' },
    timeline: [
      { status: 'pending', date: '2025-04-20T09:00:00', label: 'Commande reçue' },
      { status: 'paid', date: '2025-04-20T09:05:00', label: 'Paiement confirmé' },
      { status: 'shipped', date: '2025-04-22T16:00:00', label: 'Expédiée — Colissimo FR941201' },
    ],
  },
]
