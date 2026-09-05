import { StateGrid } from '@/components/StateGrid'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-serif text-gold-400 mb-4">
        Kava & Kratom Legislative Tracker
      </h1>
      <p className="text-lg text-foreground/80 mb-10">
        Click your state to learn more about kava and kratom laws in your area.
      </p>
      <StateGrid onSelect={(abbr) => navigate(`/state/${abbr.toLowerCase()}`)} />
    </div>
  )
}
