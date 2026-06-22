import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store'

const navItems = [
  { label: 'Home',          page: 'home' },
  { label: 'My Routine',    page: 'routine' },
  { label: 'Product Drops', page: 'drops' },
  { label: 'Glow Tracker',  page: 'tracker' },
  { label: 'Community',     page: 'community' },
]

export default function Navbar() {
  const { activePage, setPage, unreadCount, setNotifOpen, notifOpen } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-soft">
        {/* Logo */}
        <motion.button
          onClick={() => setPage('home')}
          className="flex items-center gap-2.5 group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blush-dark to-rose-dark flex items-center justify-center shadow-blush">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-gradient-warm">GlowOS</span>
        </motion.button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <motion.button
              key={item.page}
              onClick={() => setPage(item.page)}
              className="relative px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ color: activePage === item.page ? '#b85c42' : '#8a7870' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {activePage === item.page && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(232,165,152,0.18)', border: '1px solid rgba(212,131,106,0.22)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-xl glass flex items-center justify-center shadow-soft"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <Bell size={16} className="text-stone" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blush-dark text-white text-[9px] font-bold flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blush to-sage flex items-center justify-center text-sm font-bold text-white cursor-pointer shadow-soft"
            whileHover={{ scale: 1.08, rotate: 4 }}
          >
            A
          </motion.div>

          <button className="md:hidden text-stone" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 glass rounded-2xl px-4 py-3 flex flex-col gap-1 shadow-soft"
          >
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => { setPage(item.page); setMenuOpen(false) }}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  color: activePage === item.page ? '#b85c42' : '#8a7870',
                  background: activePage === item.page ? 'rgba(232,165,152,0.15)' : 'transparent',
                }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
