import { statesList } from '@/data/states'

interface StateGridProps {
  onSelect: (abbr: string) => void
}

export function StateGrid({ onSelect }: StateGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {statesList.map((state) => (
        <button
          key={state.abbreviation}
          onClick={() => onSelect(state.abbreviation)}
          className="text-left px-4 py-3 rounded-lg border border-emerald-800 bg-emerald-900/50 hover:bg-emerald-800 transition"
        >
          <span className="block text-gold-400 font-bold">{state.abbreviation}</span>
          <span className="block text-sm text-foreground/90">{state.name}</span>
        </button>
      ))}
    </div>
  )
}
