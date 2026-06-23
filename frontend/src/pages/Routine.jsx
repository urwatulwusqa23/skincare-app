import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Trash2, Sun, Moon, AlertTriangle, GripVertical, Search } from 'lucide-react'
import { useStore } from '../store'

const BG     = '#0e0c0a'
const CARD   = '#1e1a16'
const BORDER = 'rgba(245,240,234,0.08)'
const TEXT   = '#f5f0ea'
const DIM    = 'rgba(245,240,234,0.45)'
const MUTED  = 'rgba(245,240,234,0.28)'
const TRACK  = 'rgba(245,240,234,0.08)'

const PRODUCTS = [
  { name:'Saeed Ghani Neem Face Wash',    category:'Cleanser',    skinTypes:['oily','acne','combo'],       image:'🌿', color:'#00a877', ingredients:['neem extract','salicylic acid'] },
  { name:'Rivaj UK Micellar Rose Water',  category:'Cleanser',    skinTypes:['all','sensitive'],           image:'🌹', color:'#f53d1c', ingredients:['rose water','micellar solution'] },
  { name:'Hemani Turmeric Scrub',         category:'Exfoliant',   skinTypes:['normal','dull','hyperpig'],  image:'✨', color:'#f59e0b', ingredients:['turmeric','walnut powder'] },
  { name:'Iba Halal AHA Toner',           category:'Toner',       skinTypes:['oily','combo','acne'],       image:'💊', color:'#7c3aed', ingredients:['glycolic acid','lactic acid'] },
  { name:'Derma Shine Niacinamide 10%',   category:'Serum',       skinTypes:['oily','sensitive','combo'],  image:'💎', color:'#0ea5e9', ingredients:['niacinamide','zinc'] },
  { name:'Saeed Ghani Aloe Vera Gel',     category:'Moisturiser', skinTypes:['all','sensitive','oily'],    image:'🌵', color:'#00a877', ingredients:['aloe vera'] },
  { name:'Hemani Black Seed Cream',       category:'Moisturiser', skinTypes:['dry','normal','mature'],     image:'🌑', color:'#7c3aed', ingredients:['black seed oil','collagen'] },
  { name:'Iba Halal SPF 40 Sunscreen',    category:'Sunscreen',   skinTypes:['all'],                      image:'☀️', color:'#f59e0b', ingredients:['zinc oxide','titanium dioxide'] },
  { name:'Rivaj UK Retinol Night Cream',  category:'Retinoid',    skinTypes:['all','mature'],              image:'🔬', color:'#7c3aed', ingredients:['retinol','peptides'] },
  { name:'Derma Shine Kojic Acid Serum',  category:'Serum',       skinTypes:['dull','hyperpig','combo'],   image:'⚗️', color:'#f53d1c', ingredients:['kojic acid','vitamin C'] },
]

const CONFLICTS = [
  { a:'retinol',    b:'glycolic acid', msg:'Retinol + AHA — too much exfoliation at once. Use on alternate nights.' },
  { a:'kojic acid', b:'glycolic acid', msg:'Kojic Acid + AHA together can cause irritation and redness.' },
  { a:'niacinamide',b:'vitamin C',     msg:'High-dose Niacinamide + Vitamin C may reduce efficacy. Layer with a gap.' },
]

function checkConflicts(routine) {
  const ings = routine.flatMap(p => p.ingredients ?? []).join(' ').toLowerCase()
  return CONFLICTS.filter(c => ings.includes(c.a) && ings.includes(c.b))
}

function ProductCard({ product, onAdd, slot }) {
  return (
    <motion.div layout whileHover={{ y:-2 }}
      className="rounded-xl p-3.5 flex items-center gap-3 group cursor-pointer"
      style={{ background:'rgba(245,240,234,0.04)', border:`1px solid ${BORDER}` }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
        style={{ background:`${product.color}18`, border:`1px solid ${product.color}30` }}>
        {product.image}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: TEXT }}>{product.name}</p>
        <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>{product.category}</p>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {product.skinTypes.slice(0,3).map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background:`${product.color}15`, color: product.color }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <motion.button onClick={() => onAdd(slot, product)}
        whileHover={{ scale:1.2, rotate:90 }} whileTap={{ scale:0.9 }}
        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: product.color, color:'white' }}>
        <Plus size={13} />
      </motion.button>
    </motion.div>
  )
}

function RoutineSlot({ slot, label, icon, items, onRemove }) {
  const conflicts = checkConflicts(items)
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: slot==='am' ? 'rgba(245,158,11,0.12)' : 'rgba(124,58,237,0.12)' }}>
          {icon}
        </div>
        <h3 className="font-display font-bold" style={{ color: TEXT }}>{label}</h3>
        <span className="text-[11px] ml-auto" style={{ color: MUTED }}>{items.length} steps</span>
      </div>

      <AnimatePresence>
        {conflicts.map(c => (
          <motion.div key={c.msg}
            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="mb-3 p-3 rounded-xl flex gap-2 items-start"
            style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)' }}>
            <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color:'#f59e0b' }} />
            <p className="text-xs" style={{ color:'rgba(245,158,11,0.85)' }}>{c.msg}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="space-y-2 min-h-32">
        <AnimatePresence>
          {items.length === 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed"
              style={{ borderColor: BORDER }}>
              <p className="text-xs" style={{ color: MUTED }}>Add products from the list →</p>
            </motion.div>
          )}
          {items.map((product, i) => (
            <motion.div key={product.id}
              initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:12, height:0 }}
              transition={{ delay:i*0.03 }}
              className="rounded-xl p-3 flex items-center gap-3 group"
              style={{ background:'rgba(245,240,234,0.04)', border:`1px solid ${BORDER}` }}>
              <div style={{ color: MUTED }} className="cursor-grab"><GripVertical size={12} /></div>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background:`${product.color}15` }}>
                {product.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: TEXT }}>{product.name}</p>
                <p className="text-[11px]" style={{ color: MUTED }}>{product.category}</p>
              </div>
              <motion.button onClick={() => onRemove(slot, product.id)}
                whileHover={{ scale:1.2 }} whileTap={{ scale:0.9 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color:'#f53d1c' }}>
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
    <div className="min-h-screen pt-24 pb-20 px-6" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 rounded-full" style={{ background:'#f53d1c' }} />
            <h1 className="font-display text-5xl font-bold" style={{ color: TEXT }}>My Routine</h1>
          </div>
          <p className="text-base ml-4" style={{ color: DIM }}>
            Build your AM &amp; PM skincare routine. We'll flag ingredient conflicts automatically.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.08, duration:0.35 }}
            className="lg:col-span-2">
            <div className="rounded-2xl p-6" style={{ background: CARD, border:`1px solid ${BORDER}` }}>
              <h2 className="font-display font-bold mb-4" style={{ color: TEXT }}>Product Library</h2>

              <div className="relative mb-4">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                  className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ background: TRACK, border:`1px solid ${BORDER}`, color: TEXT }}
                  onFocus={e => e.target.style.borderColor = '#f53d1c'}
                  onBlur={e => e.target.style.borderColor = BORDER} />
              </div>

              <div className="flex gap-2 mb-4">
                {[['am','AM Routine'],['pm','PM Routine']].map(([s,l]) => (
                  <button key={s} onClick={() => setActiveSlot(s)}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: activeSlot===s ? '#f53d1c' : TRACK,
                      color:      activeSlot===s ? 'white'   : DIM,
                      border:     `1px solid ${activeSlot===s ? '#f53d1c' : BORDER}`,
                    }}>{l}</button>
                ))}
              </div>

              <div className="space-y-2 max-h-[52vh] overflow-y-auto pr-1">
                {filtered.map((p,i) => (
                  <motion.div key={p.name} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.03 }}>
                    <ProductCard product={p} onAdd={addToRoutine} slot={activeSlot} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.12, duration:0.35 }}
            className="lg:col-span-3">
            <div className="rounded-2xl p-6" style={{ background: CARD, border:`1px solid ${BORDER}` }}>
              <div className="flex gap-8">
                <RoutineSlot slot="am" label="Morning"
                  icon={<Sun  size={15} style={{ color:'#f59e0b' }} />}
                  items={amRoutine} onRemove={removeFromRoutine} />
                <div className="w-px" style={{ background: BORDER }} />
                <RoutineSlot slot="pm" label="Evening"
                  icon={<Moon size={15} style={{ color:'#7c3aed' }} />}
                  items={pmRoutine} onRemove={removeFromRoutine} />
              </div>

              {(amRoutine.length > 0 || pmRoutine.length > 0) && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  className="mt-6 p-4 rounded-xl"
                  style={{ background: TRACK, border:`1px solid ${BORDER}` }}>
                  <p className="text-sm" style={{ color: DIM }}>
                    <span className="font-bold" style={{ color: TEXT }}>{amRoutine.length + pmRoutine.length} products</span> in your routine.{' '}
                    {checkConflicts([...amRoutine,...pmRoutine]).length === 0
                      ? <span style={{ color:'#00a877' }}>No conflicts detected ✓</span>
                      : <span style={{ color:'#f59e0b' }}>⚠ Conflicts detected above</span>
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
