import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBillById } from '@/lib/api'
import { getStateByAbbreviation } from '@/data/states'
import { Discussion } from '@/components/Discussion'
import { Loading } from '@/components/Loading'
import type { Bill } from '@/types'

export function BillPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getBillById(id)
      .then(setBill)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (error || !bill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-serif text-gold-400">Bill not found</h2>
        <p className="text-foreground/60 mt-2">{error || 'Unable to load this bill.'}</p>
      </div>
    )
  }

  const state = getStateByAbbreviation(bill.state)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/state/${bill.state.toLowerCase()}`)}
        className="mb-4 text-sm text-foreground/70 hover:text-gold-400"
      >
        ← Back to {state?.name || bill.state} bills
      </button>

      <h1 className="text-3xl font-serif text-gold-400 mb-2">{bill.bill_number}</h1>
      <p className="text-lg text-foreground/90 mb-6">{bill.title}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-emerald-800 bg-emerald-900/30">
          <h2 className="font-serif text-gold-400 mb-2">Status</h2>
          <p className="text-sm">{bill.status}</p>
          <p className="text-sm text-foreground/70 mt-1">
            Last action: {bill.last_action_date || 'Unknown'}
          </p>
          {bill.last_action && <p className="text-sm text-foreground/70">{bill.last_action}</p>}
        </div>

        <div className="p-4 rounded-lg border border-emerald-800 bg-emerald-900/30">
          <h2 className="font-serif text-gold-400 mb-2">Official Links</h2>
          {bill.url && (
            <a href={bill.url} target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">
              LegiScan Bill Page →
            </a>
          )}
          {bill.text_url && (
            <a href={bill.text_url} target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline mt-1">
              Full Text Document →
            </a>
          )}
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-serif text-gold-400 mb-2">Summary</h2>
        <p className="whitespace-pre-line text-foreground/80">{bill.description || 'No summary available.'}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-serif text-gold-400 mb-2">Sponsors</h2>
        {bill.sponsors.length === 0 ? (
          <p className="text-foreground/60">No sponsor information available.</p>
        ) : (
          <ul className="space-y-2">
            {bill.sponsors.map((s) => (
              <li key={s.sponsor_id} className="text-sm">
                <span className="font-medium">{s.sponsor_name}</span>
                {s.sponsor_type && <span className="text-foreground/70"> — {s.sponsor_type}</span>}
                {s.party && <span className="text-foreground/70"> ({s.party})</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {bill.history && bill.history.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gold-400 mb-2">History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-emerald-800 text-left text-foreground/70">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Chamber</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {bill.history.map((h, idx) => (
                  <tr key={idx} className="border-b border-emerald-900/50">
                    <td className="py-2 pr-4">{h.date}</td>
                    <td className="py-2 pr-4">{h.chamber}</td>
                    <td className="py-2">{h.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {bill.media?.documents && bill.media.documents.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-serif text-gold-400 mb-2">Documents</h2>
          <ul className="list-disc list-inside text-sm">
            {bill.media.documents.map((url, idx) => (
              <li key={idx}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Document {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Discussion billId={bill.bill_id} stateAbbr={bill.state} />
    </div>
  )
}
