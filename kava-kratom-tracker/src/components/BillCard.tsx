import type { Bill } from '@/types'

interface BillCardProps {
  bill: Bill
  onClick: () => void
}

export function BillCard({ bill, onClick }: BillCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg border border-emerald-800 bg-emerald-900/40 hover:bg-emerald-800/60 transition"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-serif text-gold-400">{bill.bill_number}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            bill.urgency === 'high'
              ? 'bg-red-900/60 text-red-200'
              : bill.urgency === 'medium'
              ? 'bg-yellow-900/60 text-yellow-200'
              : 'bg-emerald-950 text-emerald-200'
          }`}
        >
          {bill.urgency} urgency
        </span>
      </div>
      <p className="mt-2 text-sm line-clamp-2">{bill.title}</p>
      <p className="mt-1 text-xs text-foreground/60">
        Last action: {bill.last_action_date || 'Unknown'} — {bill.status}
      </p>
    </button>
  )
}
