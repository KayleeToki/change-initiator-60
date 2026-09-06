import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { statesList } from '@/data/states'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

const NAME_TO_ABBR: Record<string, string> = statesList.reduce(
  (acc, state) => {
    acc[state.name] = state.abbreviation
    return acc
  },
  {} as Record<string, string>,
)

interface USMapProps {
  onSelect: (abbr: string) => void
}

export function USMap({ onSelect }: USMapProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="w-full">
      <div className="h-8 mb-2">
        {hovered && (
          <span className="inline-block px-4 py-1 rounded-full border border-gold-400/40 text-gold-400 text-sm font-medium tracking-wide">
            {hovered}
          </span>
        )}
      </div>

      <div className="rounded-xl overflow-hidden border border-emerald-800 bg-emerald-900/40 p-2 sm:p-6">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
          width={980}
          height={560}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name as string
                const abbr = NAME_TO_ABBR[name]
                const isHovered = hovered === name
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => abbr && onSelect(abbr)}
                    style={{
                      default: {
                        fill: isHovered ? '#facc15' : '#0f5c46',
                        stroke: '#022c22',
                        strokeWidth: 0.6,
                        outline: 'none',
                        transition: 'fill 0.2s ease',
                      },
                      hover: {
                        fill: '#facc15',
                        stroke: '#022c22',
                        strokeWidth: 0.8,
                        outline: 'none',
                        cursor: abbr ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: '#eab308',
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <p className="mt-4 text-sm text-foreground/60">
        Not seeing your state on the map? Use the list below.
      </p>
    </div>
  )
}
