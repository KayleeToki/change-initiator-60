import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const USMap = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 bg-background text-foreground relative overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(900px 600px at 20% 0%, hsl(156 55% 18% / 0.9), transparent 60%),' +
            'radial-gradient(900px 600px at 100% 100%, hsl(44 55% 18% / 0.5), transparent 60%),' +
            'linear-gradient(180deg, hsl(158 60% 7%), hsl(158 55% 10%))',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <Button
          variant="outline"
          className="mb-6 bg-transparent border-primary/40 hover:bg-primary/10 hover:text-primary"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <div className="text-center mb-8">
          <p className="uppercase tracking-[0.4em] text-xs text-primary/90 mb-3">The Docket</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">
            Select Your State
          </h1>
          <p className="text-foreground/75 max-w-2xl mx-auto">
            Click any state to browse legislation currently on its docket.
          </p>
          <div className="mt-4 h-6">
            {hovered && (
              <span className="inline-block px-4 py-1 rounded-full border border-primary/40 text-primary text-sm font-medium tracking-wide">
                {hovered}
              </span>
            )}
          </div>
        </div>

        <Card className="w-full bg-card/60 backdrop-blur border-border shadow-2xl">
          <CardContent className="p-4 sm:p-8">
            <div className="w-full rounded-lg overflow-hidden">
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
                      const name = geo.properties.name as string;
                      const isHovered = hovered === name;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHovered(name)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => navigate(`/bills/${name}`)}
                          style={{
                            default: {
                              fill: isHovered ? 'hsl(44 68% 58%)' : 'hsl(156 45% 24%)',
                              stroke: 'hsl(158 60% 8%)',
                              strokeWidth: 0.6,
                              outline: 'none',
                              transition: 'fill 0.2s ease',
                            },
                            hover: {
                              fill: 'hsl(44 68% 58%)',
                              stroke: 'hsl(158 60% 8%)',
                              strokeWidth: 0.8,
                              outline: 'none',
                              cursor: 'pointer',
                            },
                            pressed: {
                              fill: 'hsl(44 60% 50%)',
                              outline: 'none',
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default USMap;
