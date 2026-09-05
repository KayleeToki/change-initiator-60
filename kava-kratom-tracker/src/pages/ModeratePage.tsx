import { useEffect, useState } from 'react'
import { fetchPendingComments, moderateComment, supabase } from '@/lib/supabase'
import type { Comment } from '@/types'

export function ModeratePage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [since, setSince] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString()
  })

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchPendingComments(since)
      setComments(data)
    } catch (err) {
      setError('Failed to load pending comments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured.')
      setLoading(false)
      return
    }
    load()
  }, [since])

  const handleModerate = async (id: string, status: 'approved' | 'denied') => {
    try {
      await moderateComment(id, status)
      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(`Failed to ${status} comment.`)
    }
  }

  if (!supabase) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-serif text-gold-400">Moderation not configured</h2>
        <p className="text-foreground/60 mt-2">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable moderation.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-gold-400 mb-4">Moderation Queue</h1>
      <p className="text-foreground/70 mb-6">
        Review pending comments. Approved comments appear on bill pages. Denied comments are hidden.
      </p>

      <div className="mb-4">
        <label className="block text-sm text-foreground/70 mb-1">Show pending since</label>
        <input
          type="datetime-local"
          value={since.slice(0, 16)}
          onChange={(e) => setSince(new Date(e.target.value).toISOString())}
          className="px-3 py-2 rounded bg-emerald-950 border border-emerald-800 text-foreground"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-foreground/60">No pending comments in the selected window.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-lg border border-emerald-800 bg-emerald-900/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-foreground/70">
                  {comment.author_name} · {comment.state_abbr} · {new Date(comment.created_at).toLocaleString()}
                </p>
                <a
                  href={`/bill/${comment.bill_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline"
                >
                  View bill
                </a>
              </div>
              <p className="whitespace-pre-line mb-4">{comment.body}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleModerate(comment.id, 'approved')}
                  className="px-4 py-2 rounded bg-green-700 text-white text-sm font-medium hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleModerate(comment.id, 'denied')}
                  className="px-4 py-2 rounded bg-red-800 text-white text-sm font-medium hover:bg-red-700"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
