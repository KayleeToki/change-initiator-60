import { useEffect, useState } from 'react'
import { fetchBannedWords, fetchComments, submitComment, containsBannedWords } from '@/lib/supabase'
import type { Comment } from '@/types'

interface DiscussionProps {
  billId: string
  stateAbbr: string
}

export function Discussion({ billId, stateAbbr }: DiscussionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [bannedWords, setBannedWords] = useState<string[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments(billId).then(setComments)
    fetchBannedWords().then(setBannedWords)
  }, [billId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!body.trim()) {
      setError('Please write a message.')
      return
    }

    const found = containsBannedWords(body, bannedWords)
    if (found) {
      setError(`Your message contains a restricted word or phrase (${found}). Please revise and try again.`)
      return
    }

    setLoading(true)
    try {
      await submitComment({
        bill_id: billId,
        state_abbr: stateAbbr,
        author_name: name.trim() || 'Anonymous',
        author_email: email.trim() || undefined,
        body: body.trim(),
      })
      setSuccess(true)
      setBody('')
      setName('')
      setEmail('')
      setComments(await fetchComments(billId))
    } catch (err) {
      setError('Failed to submit comment. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-serif text-gold-400 mb-4">Take Action & Discussion</h2>

      <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-lg border border-emerald-800 bg-emerald-900/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 rounded bg-emerald-950 border border-emerald-800 text-foreground placeholder:text-foreground/50"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded bg-emerald-950 border border-emerald-800 text-foreground placeholder:text-foreground/50"
          />
        </div>
        <textarea
          placeholder="Share your thoughts, testimony, or questions about this bill..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded bg-emerald-950 border border-emerald-800 text-foreground placeholder:text-foreground/50"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">Your comment has been submitted for review.</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-gold-500 text-emerald-950 font-semibold hover:bg-gold-400 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <p className="text-foreground/60">No approved comments yet. Be the first to share your perspective.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-lg border border-emerald-800 bg-emerald-900/20">
              <p className="text-sm text-foreground/70 mb-1">
                {comment.author_name} · {new Date(comment.created_at).toLocaleDateString()}
              </p>
              <p className="whitespace-pre-line">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
