import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { USMap } from '@/components/USMap'
import { StateGrid } from '@/components/StateGrid'

export function HomePage() {
  const navigate = useNavigate()
  const [showList, setShowList] = useState(false)

  const go = (abbr: string) => navigate(`/state/${abbr.toLowerCase()}`)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-serif text-gold-400 mb-4">
        Kava &amp; Kratom Legislative Tracker
      </h1>
      <p className="text-lg text-foreground/80 mb-8">
        Click your state to learn more about kava and kratom laws in your area.
      </p>

      <USMap onSelect={go} />

      <button
        onClick={() => setShowList((v) => !v)}
        className="mt-2 mb-6 text-sm text-gold-400 underline underline-offset-4"
      >
        {showList ? 'Hide state list' : 'Show state list'}
      </button>

      {showList && <StateGrid onSelect={go} />}
    </div>
  )
}
