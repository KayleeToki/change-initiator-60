import type { Bill } from '@/types'

const LEGISCAN_API_URL = 'https://api.legiscan.com/'
// Default LegiScan key so the app works out of the box.
// Replace with your own LegiScan key (or move it server-side via the edge proxy).
const DEFAULT_LEGISCAN_API_KEY = 'e9117f10376dda025b85705917ec997e'
const API_KEY = import.meta.env.VITE_LEGISCAN_API_KEY || DEFAULT_LEGISCAN_API_KEY
const USE_PROXY = import.meta.env.VITE_USE_EDGE_PROXY === 'true'

const STATUS_LABELS: Record<number, string> = {
  1: 'Introduced',
  2: 'Engrossed',
  3: 'Enrolled',
  4: 'Passed',
  5: 'Vetoed',
  6: 'Failed / Died',
}

function decodeEntities(value: string): string {
  const el = document.createElement('textarea')
  el.innerHTML = value
  return el.value
}

function buildNumberAliases(number: string): string[] {
  const match = number.match(/^([A-Z]+)0*(\d+)$/i)
  if (!match) return [number]
  const [, prefix, digits] = match
  const aliases = new Set<string>([number, `${prefix}${digits}`])
  if (/^[HS]$/i.test(prefix)) {
    aliases.add(`${prefix}B${digits}`)
    aliases.add(`${prefix}B${digits.padStart(4, '0')}`)
  }
  return [...aliases]
}

function calculateUrgency(lastActionDate: string): 'high' | 'medium' | 'low' {
  const today = new Date()
  const actionDate = new Date(lastActionDate)
  const diffDays = Math.ceil(Math.abs(today.getTime() - actionDate.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 14) return 'high'
  if (diffDays <= 30) return 'medium'
  return 'low'
}

async function legiscanRequest(op: string, params: Record<string, string> = {}): Promise<any> {
  if (USE_PROXY) {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legiscan-proxy`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ op, ...params }),
    })
    if (!response.ok) throw new Error(`Proxy error: ${response.statusText}`)
    return response.json()
  }

  const query = new URLSearchParams({ key: API_KEY, op, ...params })
  const response = await fetch(`${LEGISCAN_API_URL}/?${query.toString()}`)
  if (!response.ok) throw new Error(`LegiScan error: ${response.statusText}`)
  return response.json()
}

export async function getBillsByState(stateAbbr: string): Promise<Bill[]> {
  const data = await legiscanRequest('getMasterList', { state: stateAbbr.toUpperCase() })
  if (data.status !== 'OK') throw new Error(`API Error: ${data.status}`)

  const masterList = data.masterlist || {}
  const entries = Object.keys(masterList)
    .filter((key) => key !== 'session' && masterList[key]?.bill_id)
    .map((key) => masterList[key])
    .sort((a: any, b: any) => {
      const dateA = new Date(a.last_action_date || 0).getTime()
      const dateB = new Date(b.last_action_date || 0).getTime()
      if (dateB !== dateA) return dateB - dateA
      return (b.bill_id || 0) - (a.bill_id || 0)
    })

  return entries.map((item: any) => {
    const number: string = item.number || ''
    return {
      bill_id: item.bill_id.toString(),
      bill_number: number,
      title: decodeEntities(item.title || ''),
      description: decodeEntities(item.description || item.title || ''),
      state: stateAbbr.toUpperCase(),
      state_id: 0,
      urgency: calculateUrgency(item.last_action_date),
      last_action_date: item.last_action_date || '',
      last_action: item.last_action || '',
      status: STATUS_LABELS[item.status] || 'Pending',
      sponsors: [],
      url: item.url,
      aliases: buildNumberAliases(number),
      history: [],
    }
  })
}

export async function getBillById(id: string): Promise<Bill | null> {
  const data = await legiscanRequest('getBill', { id })
  if (data.status !== 'OK') throw new Error(`API Error: ${data.status}`)

  const billData = data.bill
  return {
    bill_id: billData.bill_id.toString(),
    bill_number: billData.bill_number,
    title: decodeEntities(billData.title || ''),
    description: decodeEntities(billData.description || billData.title || ''),
    state: billData.state,
    state_id: billData.state_id,
    urgency: calculateUrgency(billData.last_action_date),
    last_action_date: billData.last_action_date,
    last_action: billData.last_action,
    status: STATUS_LABELS[billData.status_id] || billData.status || 'Pending',
    sponsors: Array.isArray(billData.sponsors)
      ? billData.sponsors.map((s: any) => {
          const fullName =
            s.name ||
            [s.first_name, s.middle_name, s.last_name, s.suffix]
              .filter(Boolean)
              .join(' ')
              .trim() ||
            'Unknown sponsor'
          return {
            sponsor_id: s.people_id ?? s.sponsor_id ?? 0,
            sponsor_name: fullName,
            sponsor_type: s.sponsor_type_desc || 'Sponsor',
            party: s.party || undefined,
            district: s.district || undefined,
            role: s.role || s.role_abbr || undefined,
          }
        })
      : [],
    url: billData.url,
    text_url: billData.texts?.[0]?.url,
    history: billData.history || [],
    media: {
      documents: billData.texts ? billData.texts.map((text: any) => text.url) : [],
    },
  }
}
