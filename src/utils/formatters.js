/**
 * Format a price to a localized currency string
 */
export const formatPrice = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date to a readable French string
 */
export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Format a date with time
 */
export const formatDateTime = (dateString) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

/**
 * Calculate discount percentage
 */
export const calcDiscountPercent = (original, current) => {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

/**
 * Truncate text to max length
 */
export const truncate = (text, maxLength = 120) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

/**
 * Generate a random order number for demo
 */
export const generateOrderId = () => {
  const date = new Date()
  const year = date.getFullYear()
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `CMD-${year}-${rand}`
}
