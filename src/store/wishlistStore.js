import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.find((i) => i.id === product.id)) return state
          return { items: [...state.items, product] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }))
      },

      toggle: (product) => {
        const isWished = get().items.some((i) => i.id === product.id)
        if (isWished) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      isWished: (productId) => {
        return get().items.some((i) => i.id === productId)
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

export default useWishlistStore
