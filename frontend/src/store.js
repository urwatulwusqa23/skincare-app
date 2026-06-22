import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // Auth / user
  user: { id: 'user-1', name: 'Aria', skinType: 'oily', concerns: ['acne', 'hyperpigmentation'] },

  // Routines
  amRoutine: [],
  pmRoutine: [],
  addToRoutine: (slot, product) => set(s => ({
    [`${slot}Routine`]: [...s[`${slot}Routine`], { ...product, addedAt: new Date().toISOString(), id: Date.now() }]
  })),
  removeFromRoutine: (slot, id) => set(s => ({
    [`${slot}Routine`]: s[`${slot}Routine`].filter(p => p.id !== id)
  })),

  // Notifications
  alerts: [],
  unreadCount: 0,
  addAlert: (alert) => set(s => ({
    alerts: [{ ...alert, id: Date.now(), timestamp: new Date(), read: false }, ...s.alerts],
    unreadCount: s.unreadCount + 1,
  })),
  markAllRead: () => set(s => ({
    alerts: s.alerts.map(a => ({ ...a, read: true })),
    unreadCount: 0,
  })),

  // Active page
  activePage: 'home',
  setPage: (page) => set({ activePage: page }),

  // Notification panel
  notifOpen: false,
  setNotifOpen: (v) => set({ notifOpen: v }),
}))
