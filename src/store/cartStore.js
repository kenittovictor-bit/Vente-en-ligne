import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PROMOTIONS } from '../data/mockProducts'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: 0,
      shippingThreshold: 60,
      shippingCost: 4.90,
      taxRate: 0.20,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { ...product, quantity: Math.min(quantity, product.stock) }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

      applyPromoCode: (code) => {
        const promo = PROMOTIONS.find(
          (p) => p.id.toLowerCase() === code.trim().toUpperCase()
        )
        if (!promo) return { success: false, message: 'Code promo invalide ou expiré.' }

        const subtotal = get().getSubtotal()
        if (subtotal < promo.minOrder) {
          return {
            success: false,
            message: `Ce code nécessite une commande minimum de ${promo.minOrder}€.`,
          }
        }

        const discount =
          promo.type === 'percent'
            ? (subtotal * promo.discount) / 100
            : promo.discount

        set({ promoCode: promo, promoDiscount: parseFloat(discount.toFixed(2)) })
        return { success: true, message: promo.description }
      },

      removePromoCode: () => set({ promoCode: null, promoDiscount: 0 }),

      getSubtotal: () => {
        const { items } = get()
        return parseFloat(
          items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
        )
      },

      getTax: () => {
        const { taxRate } = get()
        const subtotal = get().getSubtotal()
        const discount = get().promoDiscount
        return parseFloat(((subtotal - discount) * taxRate).toFixed(2))
      },

      getShipping: () => {
        const { shippingThreshold, shippingCost, items } = get()
        if (items.length === 0) return 0
        return get().getSubtotal() >= shippingThreshold ? 0 : shippingCost
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().promoDiscount
        const tax = get().getTax()
        const shipping = get().getShipping()
        return parseFloat((subtotal - discount + tax + shipping).toFixed(2))
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode, promoDiscount: state.promoDiscount }),
    }
  )
)

export default useCartStore
