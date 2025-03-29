
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const USMap = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real implementation, we would use a library like MapBox or Leaflet
    // For this demo, we'll use a placeholder
    console.log("Map component mounted");
    
    // Simulate map initialization and click events
    const simulateMapInit = () => {
      console.log("Map initialized");
      
      // Add event listener to container to simulate state selection
      if (mapContainerRef.current) {
        mapContainerRef.current.addEventListener('click', (e) => {
          // In a real map, we'd get the state from the map feature
          // For now, just show a dialog to select a state
          const state = prompt("Enter a state name (e.g. California, New York, Texas):");
          if (state) {
            setSelectedState(state);
            navigate(`/bills/${state}`);
          }
        });
      }
    };
    
    setTimeout(simulateMapInit, 500);
    
    return () => {
      // Cleanup event listeners
      if (mapContainerRef.current) {
        mapContainerRef.current.replaceWith(mapContainerRef.current.cloneNode(true));
      }
    };
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      
      <Card className="w-full mx-auto max-w-6xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Select Your State</h1>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Click on your state to see pending legislation. You can zoom in to see county-level information.
          </p>
          
          <div 
            ref={mapContainerRef}
            className="relative w-full aspect-[4/3] bg-blue-100 rounded-lg overflow-hidden cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-colors"
          >
            {/* This would be replaced with an actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Map_of_USA_with_state_names.svg" 
                  alt="Map of the United States" 
                  className="max-w-full max-h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                    <p className="font-medium text-lg">Click anywhere on the map to select a state</p>
                    <p className="text-sm text-gray-500">(This is a placeholder for an interactive map)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => navigate('/bills/California')}>California</Button>
            <Button onClick={() => navigate('/bills/New York')}>New York</Button>
            <Button onClick={() => navigate('/bills/Texas')}>Texas</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default USMap;
