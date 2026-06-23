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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: '#0e0c0a', borderBottom: '1px solid rgba(245,240,234,0.07)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <motion.button
          onClick={() => setPage('home')}
          className="flex items-center gap-2.5"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#f53d1c' }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white">GlowOS</span>
        </motion.button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => (
            <motion.button
              key={item.page}
              onClick={() => setPage(item.page)}
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: activePage === item.page ? '#f53d1c' : 'rgba(245,240,234,0.5)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {activePage === item.page && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: 'rgba(245,61,28,0.1)', border: '1px solid rgba(245,61,28,0.2)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <motion.button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(245,240,234,0.07)', border: '1px solid rgba(245,240,234,0.1)' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <Bell size={15} style={{ color: 'rgba(245,240,234,0.65)' }} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                  style={{ background: '#f53d1c' }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white cursor-pointer"
            style={{ background: '#f53d1c' }}
            whileHover={{ scale: 1.08, rotate: 5 }}
          >
            A
          </motion.div>

          <button
            className="md:hidden"
            style={{ color: 'rgba(245,240,234,0.65)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: '#0e0c0a', borderTop: '1px solid rgba(245,240,234,0.07)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => { setPage(item.page); setMenuOpen(false) }}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: activePage === item.page ? '#f53d1c' : 'rgba(245,240,234,0.5)',
                    background: activePage === item.page ? 'rgba(245,61,28,0.1)' : 'transparent',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
