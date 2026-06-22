import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Package, Star, Clock } from 'lucide-react'
import { useStore } from '../store'

const mockAlerts = [
  { id: 1, type: 'drop',   title: 'New Drop!',      body: 'La Mer Regenerating Serum is back — perfect for sensitive skin ✨', time: '2m ago',  read: false },
  { id: 2, type: 'review', title: 'Time to Review',  body: 'You\'ve used CeraVe Moisturiser for 30 days. How\'s your skin?',   time: '1h ago',  read: false },
  { id: 3, type: 'match',  title: 'Matched for You', body: 'Paula\'s Choice BHA is trending for oily + acne skin like yours',  time: '3h ago',  read: true  },
  { id: 4, type: 'drop',   title: 'Flash Sale',      body: 'The Ordinary Niacinamide 10% — 30% off for 2 hours!',              time: '5h ago',  read: true  },
]

const iconMap = {
  drop:   <Package size={14} className="text-blush-dark" />,
  review: <Star    size={14} className="text-peach-dark" />,
  match:  <Bell    size={14} className="text-sage-dark"  />,
}

const typeBg = {
  drop:   'bg-blush-light',
  review: 'bg-peach-light',
  match:  'bg-sage-light',
}

export default function NotificationPanel() {
  const { notifOpen, setNotifOpen, alerts, markAllRead } = useStore()
  const display = alerts.length > 0 ? alerts : mockAlerts

  return (
    <AnimatePresence>
      {notifOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setNotifOpen(false)}
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="fixed top-20 right-4 z-50 w-80 bg-white rounded-2xl overflow-hidden shadow-blush border border-sand"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cream-300">
              <div>
                <h3 className="font-display font-semibold text-stone-dark text-sm">Notifications</h3>
                <p className="text-[11px] text-stone-light mt-0.5">{display.filter(a => !a.read).length} unread</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={markAllRead} className="text-[11px] text-blush-dark hover:text-rose-dark transition-colors font-medium">
                  Mark all read
                </button>
                <button onClick={() => setNotifOpen(false)}>
                  <X size={15} className="text-stone-light hover:text-stone-dark transition-colors" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {display.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 border-b border-cream-200 hover:bg-cream-100 transition-colors cursor-pointer ${!alert.read ? 'bg-blush-light/30' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${typeBg[alert.type] ?? 'bg-cream-200'}`}>
                      {iconMap[alert.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-stone-dark truncate">{alert.title}</p>
                        {!alert.read && <div className="w-1.5 h-1.5 rounded-full bg-blush-dark shrink-0" />}
                      </div>
                      <p className="text-[11px] text-stone mt-0.5 leading-relaxed">{alert.body}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock size={9} className="text-stone-light" />
                        <span className="text-[10px] text-stone-light">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-3 border-t border-cream-200 text-center bg-cream-50">
              <button className="text-[11px] text-blush-dark hover:text-rose-dark transition-colors font-medium">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
