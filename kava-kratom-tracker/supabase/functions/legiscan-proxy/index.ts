import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const LEGISCAN_API_URL = 'https://api.legiscan.com/'

interface LegiScanRequest {
  op: 'getMasterList' | 'getBill'
  state?: string;
  id?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('LEGISCAN_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body: LegiScanRequest = await req.json().catch(() => ({} as LegiScanRequest))
    if (!body.op) {
      return new Response(JSON.stringify({ error: 'Missing op parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let url = `${LEGISCAN_API_URL}/?key=${apiKey}&op=${body.op}`
    if (body.op === 'getMasterList' && body.state) {
      url += `&state=${body.state}`
    } else if (body.op === 'getBill' && body.id) {
      url += `&id=${body.id}`
    } else {
      return new Response(JSON.stringify({ error: 'Invalid parameters for op' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const upstream = await fetch(url)
    const data = await upstream.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
