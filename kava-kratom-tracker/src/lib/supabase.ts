import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Comment } from '@/types'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

export async function fetchBannedWords(): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('banned_words').select('word')
  if (error) {
    console.error('Failed to load banned words:', error)
    return []
  }
  return (data || []).map((row) => row.word as string)
}

export function containsBannedWords(text: string, bannedWords: string[]): string | null {
  const lower = text.toLowerCase()
  for (const word of bannedWords) {
    if (lower.includes(word.toLowerCase())) return word
  }
  return null
}

export async function submitComment(comment: Omit<Comment, 'id' | 'created_at' | 'status'>): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('comments').insert({
    bill_id: comment.bill_id,
    state_abbr: comment.state_abbr,
    author_name: comment.author_name,
    author_email: comment.author_email,
    body: comment.body,
    status: 'pending',
  })
  if (error) throw error
}

export async function fetchComments(billId: string): Promise<Comment[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('bill_id', billId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Failed to load comments:', error)
    return []
  }
  return (data || []) as Comment[]
}

export async function fetchPendingComments(since: string): Promise<Comment[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('status', 'pending')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Failed to load pending comments:', error)
    return []
  }
  return (data || []) as Comment[]
}

export async function moderateComment(id: string, status: 'approved' | 'denied'): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase
    .from('comments')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}
