import { motion } from 'framer-motion'

const items = [
  'Niacinamide', '✦', 'Retinol', '✦', 'Hyaluronic Acid', '✦', 'Vitamin C', '✦',
  'Ceramides', '✦', 'Peptides', '✦', 'AHA / BHA', '✦', 'Squalane', '✦',
  'Bakuchiol', '✦', 'Snail Mucin', '✦', 'Azelaic Acid', '✦', 'Tranexamic Acid', '✦',
]

export default function Marquee({ reverse = false, accent = false }) {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden whitespace-nowrap py-3 select-none"
      style={{ borderTop: '1px solid #e8d8c8', borderBottom: '1px solid #e8d8c8', background: accent ? '#fde8df' : 'white' }}>
      <motion.div
        className="inline-flex gap-8"
        animate={{ x: reverse ? ['0%', '50%'] : ['-50%', '0%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: item === '✦' ? '#e8a598' : '#8a7870' }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
