import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBillsByState } from '@/lib/api'
import { BILL_KEYWORDS } from '@/data/keywords'
import { getStateByAbbreviation } from '@/data/states'
import { BillCard } from '@/components/BillCard'
import { Loading } from '@/components/Loading'
import type { Bill } from '@/types'

export function StatePage() {
  const { abbr } = useParams<{ abbr: string }>()
  const navigate = useNavigate()
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const state = getStateByAbbreviation(abbr || '')

  useEffect(() => {
    if (!state) return
    setLoading(true)
    getBillsByState(state.abbreviation)
      .then((all) => {
        const filtered = all.filter((bill) => {
          const hay = `${bill.title} ${bill.description} ${bill.bill_number}`.toLowerCase()
          return BILL_KEYWORDS.some((kw) => hay.includes(kw.toLowerCase()))
        })
        setBills(filtered)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [state])

  const filteredBills = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return bills
    return bills.filter((bill) => {
      const hay = `${bill.title} ${bill.description} ${bill.bill_number} ${(bill.aliases || []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [bills, search])

  if (!state) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-serif text-gold-400">State not found</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-sm text-foreground/70 hover:text-gold-400"
      >
        ← Back to all states
      </button>
      <h1 className="text-3xl font-serif text-gold-400 mb-2">{state.name}</h1>
      <p className="text-foreground/70 mb-6">
        Showing bills related to kava, kratom, and agriculture for the current session.
      </p>

      <input
        type="text"
        placeholder="Search bills by number or keyword..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 rounded bg-emerald-950 border border-emerald-800 text-foreground placeholder:text-foreground/50"
      />

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : filteredBills.length === 0 ? (
        <p className="text-foreground/60">
          No kava, kratom, or agriculture bills found for {state.name} in the current session.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredBills.map((bill) => (
            <BillCard key={bill.bill_id} bill={bill} onClick={() => navigate(`/bill/${bill.bill_id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}
