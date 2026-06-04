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
    <div
      className="min-h-screen p-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(20,40,25,0.85), rgba(10,25,15,0.9)), url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Button
        variant="outline"
        className="mb-6 bg-white/90 hover:bg-white"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <Card className="w-full mx-auto max-w-6xl bg-white/95 backdrop-blur shadow-2xl border-emerald-200">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold mb-3 text-center text-emerald-900">
            Select Your State
          </h1>
          <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            Click on any state to see pending legislation.
            {hovered && (
              <span className="block mt-2 text-emerald-700 font-semibold text-lg">
                {hovered}
              </span>
            )}
          </p>

          <div className="w-full rounded-xl overflow-hidden border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-green-100">
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
                            fill: isHovered ? '#059669' : '#34d399',
                            stroke: '#064e3b',
                            strokeWidth: 0.75,
                            outline: 'none',
                            transition: 'fill 0.2s',
                          },
                          hover: {
                            fill: '#059669',
                            stroke: '#064e3b',
                            strokeWidth: 1,
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          pressed: {
                            fill: '#047857',
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
  );
};

export default USMap;
