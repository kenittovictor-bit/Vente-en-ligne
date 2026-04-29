import { STATUS_LABELS, STATUS_COLORS } from '../../data/mockOrders'

export default function OrderStatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status
  const colors = STATUS_COLORS[status] || { bg: 'bg-gray-100', text: 'text-gray-600' }

  return (
    <span className={`badge ${colors.bg} ${colors.text}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 inline-block" />
      {label}
    </span>
  )
}
