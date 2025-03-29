
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Home, Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/d0ba1885-e1d7-4ee4-945e-ac6a53d751ef.png" 
                alt="Change Initiator Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">Change Initiator</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/">
                <Button variant="ghost" className="text-gray-700">
                  <Home className="h-4 w-4 mr-2" /> Home
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="ghost" className="text-gray-700">
                  <MapPin className="h-4 w-4 mr-2" /> Legislation Map
                </Button>
              </Link>
              <Link to="/forum">
                <Button variant="ghost" className="text-gray-700">
                  <MessageSquare className="h-4 w-4 mr-2" /> Community Forum
                </Button>
              </Link>
              <Link to="/mutual-aid">
                <Button variant="ghost" className="text-gray-700">
                  <Heart className="h-4 w-4 mr-2" /> Mutual Aid
                </Button>
              </Link>
            </div>
            
            <div className="ml-6">
              <Button>Sign In</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
