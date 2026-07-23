
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Home, Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-background/80 backdrop-blur border-b border-border/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img
                src="/lovable-uploads/d0ba1885-e1d7-4ee4-945e-ac6a53d751ef.png"
                alt="Change Initiator Logo"
                className="h-8 w-auto"
              />
              <span className="font-serif text-xl text-foreground tracking-tight">
                Change <span className="text-primary">Initiator</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              <Link to="/"><Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/10"><Home className="h-4 w-4 mr-2" /> Home</Button></Link>
              <Link to="/map"><Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/10"><MapPin className="h-4 w-4 mr-2" /> Legislation</Button></Link>
              <Link to="/forum"><Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/10"><MessageSquare className="h-4 w-4 mr-2" /> Forum</Button></Link>
              <Link to="/mutual-aid"><Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/10"><Heart className="h-4 w-4 mr-2" /> Mutual Aid</Button></Link>
            </div>

            <div className="ml-6">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign In</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
