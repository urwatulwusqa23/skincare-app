import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import NotificationPanel from './components/NotificationPanel'
import Home from './pages/Home'
import Routine from './pages/Routine'
import Drops from './pages/Drops'
import Tracker from './pages/Tracker'
import Community from './pages/Community'
import { useStore } from './store'

const PAGES = { home: Home, routine: Routine, drops: Drops, tracker: Tracker, community: Community }

export default function App() {
  const activePage = useStore(s => s.activePage)
  const Page = PAGES[activePage] || Home

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <NotificationPanel />

      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Page />
        </motion.div>
      </AnimatePresence>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2a1f1a',
            color: '#fdf8f4',
            border: '1px solid rgba(212,131,106,0.3)',
            borderRadius: '16px',
            fontSize: '13px',
          }
        }}
      />
    </div>
  )
}
