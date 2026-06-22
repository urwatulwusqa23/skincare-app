import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Trash2, Sun, Moon, AlertTriangle, GripVertical, Search } from 'lucide-react'
import { useStore } from '../store'

const PRODUCTS = [
  { name: 'CeraVe Foaming Cleanser',      category: 'Cleanser',     skinTypes: ['oily','combo'],              image: '🧴', color: '#7a9e80', ingredients: ['ceramides','niacinamide'] },
  { name: "Paula's Choice BHA",            category: 'Exfoliant',    skinTypes: ['oily','acne'],               image: '💧', color: '#d4836a', ingredients: ['salicylic acid'] },
  { name: 'The Ordinary Niacinamide 10%', category: 'Serum',        skinTypes: ['oily','sensitive','combo'],  image: '✨', color: '#c8a8d0', ingredients: ['niacinamide','zinc'] },
  { name: 'Neutrogena Hydro Boost',       category: 'Moisturiser',  skinTypes: ['dry','normal','combo'],      image: '💎', color: '#88b8c0', ingredients: ['hyaluronic acid'] },
  { name: 'La Roche-Posay SPF 50',        category: 'Sunscreen',    skinTypes: ['all'],                       image: '☀️', color: '#d4a870', ingredients: ['zinc oxide'] },
  { name: 'Tretinoin 0.025%',             category: 'Retinoid',     skinTypes: ['all'],                       image: '🔬', color: '#c47070', ingredients: ['tretinoin'] },
  { name: 'Vitamin C 15% Serum',          category: 'Serum',        skinTypes: ['dull','normal'],             image: '🍊', color: '#d4946a', ingredients: ['ascorbic acid'] },
  { name: 'AHA 30% Peel',                 category: 'Exfoliant',    skinTypes: ['all'],                       image: '⚗️', color: '#b878c8', ingredients: ['glycolic acid','lactic acid'] },
  { name: 'Snail Mucin Essence',          category: 'Essence',      skinTypes: ['dry','sensitive'],           image: '🌙', color: '#7ab8a0', ingredients: ['snail secretion filtrate'] },
  { name: 'Benzoyl Peroxide 5%',          category: 'Treatment',    skinTypes: ['acne','oily'],               image: '🎯', color: '#c47888', ingredients: ['benzoyl peroxide'] },
]

const CONFLICTS = [
  { a: 'tretinoin',      b: 'glycolic acid', msg: 'Retinoids + AHAs — too much exfoliation at once' },
  { a: 'ascorbic acid',  b: 'tretinoin',     msg: 'Vitamin C + Retinoids can cause irritation' },
  { a: 'benzoyl peroxide', b: 'tretinoin',   msg: 'BP deactivates retinoids — use them on different nights' },
]

function checkConflicts(routine) {
  const ings = routine.flatMap(p => p.ingredients ?? []).join(' ').toLowerCase()
  return CONFLICTS.filter(c => ings.includes(c.a) && ings.includes(c.b))
}

function ProductCard({ product, onAdd, slot }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -3, scale: 1.01 }}
      className="bg-white rounded-2xl p-3.5 flex items-center gap-3 group cursor-pointer shadow-card hover:shadow-soft transition-shadow"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `${product.color}18`, border: `1px solid ${product.color}40` }}>
        {product.image}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-dark truncate">{product.name}</p>
        <p className="text-[11px] text-stone mt-0.5">{product.category}</p>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {product.skinTypes.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${product.color}15`, color: product.color }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <motion.button
        onClick={() => onAdd(slot, product)}
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `${product.color}20`, color: product.color }}
      >
        <Plus size={14} />
      </motion.button>
    </motion.div>
  )
}

function RoutineSlot({ slot, label, icon, items, onRemove }) {
  const conflicts = checkConflicts(items)
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${slot === 'am' ? 'bg-peach-light' : 'bg-blush-light'}`}>
          {icon}
        </div>
        <h3 className="font-display font-bold text-stone-dark">{label}</h3>
        <span className="text-[11px] text-stone ml-auto">{items.length} steps</span>
      </div>

      <AnimatePresence>
        {conflicts.map(c => (
          <motion.div key={c.msg}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 rounded-xl flex gap-2 items-start"
            style={{ background: '#fff8e0', border: '1px solid #e8d090' }}
          >
            <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">{c.msg}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="space-y-2 min-h-32">
        <AnimatePresence>
          {items.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-sand-dark"
            >
              <p className="text-stone text-xs">Add products from the list →</p>
            </motion.div>
          )}
          {items.map((product, i) => (
            <motion.div key={product.id}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl p-3 flex items-center gap-3 group shadow-card"
            >
              <div className="text-stone-light cursor-grab"><GripVertical size={12} /></div>
              <span className="text-base">{product.image}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-dark truncate">{product.name}</p>
                <p className="text-[11px] text-stone">{product.category}</p>
              </div>
              <motion.button onClick={() => onRemove(slot, product.id)}
                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-blush-dark hover:text-rose-dark"
              >
                <Trash2 size={13} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Routine() {
  const { amRoutine, pmRoutine, addToRoutine, removeFromRoutine } = useStore()
  const [search, setSearch] = useState('')
  const [activeSlot, setActiveSlot] = useState('am')

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-6 bg-cream">
      <div className="orb w-72 h-72 bg-blush-light top-20  right-0 opacity-50" style={{ '--dur': '9s' }} />
      <div className="orb w-64 h-64 bg-sage-light  bottom-20 left-0  opacity-40" style={{ '--dur': '11s', '--del': '3s' }} />

      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-5xl font-bold text-stone-dark mb-2">My Routine</h1>
          <p className="text-stone">Build your AM & PM skincare routine. We'll flag ingredient conflicts automatically.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Library */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-cream-300">
              <h2 className="font-display font-bold text-stone-dark mb-4">Product Library</h2>

              <div className="relative mb-4">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                  className="w-full bg-cream rounded-xl pl-9 pr-4 py-2.5 text-sm text-stone-dark placeholder-stone focus:outline-none border border-cream-300 focus:border-blush-dark transition-colors" />
              </div>

              <div className="flex gap-2 mb-4">
                {[['am','AM Routine'],['pm','PM Routine']].map(([s, l]) => (
                  <button key={s} onClick={() => setActiveSlot(s)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: activeSlot === s ? (s === 'am' ? '#fde8df' : '#fde8df') : '#f5ede4',
                      color:      activeSlot === s ? '#b85c42' : '#8a7870',
                      border:     `1px solid ${activeSlot === s ? '#f2c4b0' : 'transparent'}`,
                    }}
                  >{l}</button>
                ))}
              </div>

              <div className="space-y-2 max-h-[52vh] overflow-y-auto pr-1">
                {filtered.map((p, i) => (
                  <motion.div key={p.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <ProductCard product={p} onAdd={addToRoutine} slot={activeSlot} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Builder */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-cream-300">
              <div className="flex gap-8">
                <RoutineSlot slot="am" label="Morning"
                  icon={<Sun  size={15} className="text-peach-dark" />}
                  items={amRoutine} onRemove={removeFromRoutine} />
                <div className="w-px bg-cream-300" />
                <RoutineSlot slot="pm" label="Evening"
                  icon={<Moon size={15} className="text-stone"      />}
                  items={pmRoutine} onRemove={removeFromRoutine} />
              </div>

              {(amRoutine.length > 0 || pmRoutine.length > 0) && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-2xl"
                  style={{ background: '#f5ede4', border: '1px solid #e8d0b8' }}
                >
                  <p className="text-sm text-stone">
                    <span className="text-stone-dark font-semibold">{amRoutine.length + pmRoutine.length} products</span> in your routine.{' '}
                    {checkConflicts([...amRoutine, ...pmRoutine]).length === 0
                      ? <span className="text-sage-dark">No conflicts detected ✓</span>
                      : <span className="text-amber-600">⚠ Conflicts detected above</span>
                    }
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
