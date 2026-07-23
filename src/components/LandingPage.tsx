import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react';
import ravenSilhouette from "@/assets/raven-silhouette.png";
import chessRook from "@/assets/chess-rook.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleYesClick = () => navigate('/map');
  const handleNoClick = () => {
    window.open('https://www.google.com', '_blank', 'noopener,noreferrer');
  };


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-background text-foreground">
      {/* Layered emerald + gold ambience */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(1200px 700px at 15% 10%, hsl(156 55% 18% / 0.9), transparent 60%),' +
            'radial-gradient(1000px 600px at 90% 90%, hsl(44 55% 20% / 0.55), transparent 60%),' +
            'linear-gradient(180deg, hsl(158 60% 6%) 0%, hsl(158 55% 10%) 60%, hsl(158 60% 7%) 100%)',
        }}
      />
      {/* Subtle grain / weave */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, hsl(44 60% 70%) 0 1px, transparent 1px 24px),' +
            'repeating-linear-gradient(-45deg, hsl(44 60% 70%) 0 1px, transparent 1px 24px)',
        }}
      />

      {/* Raven — top left with filigree semi-circle */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: 'min(34vw, 320px)', height: 'min(34vw, 320px)' }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={{ color: 'hsl(44 62% 60%)' }}
        >
          <defs>
            <radialGradient id="ravenGlow" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="hsl(44 62% 55%)" stopOpacity="0.18" />
              <stop offset="70%" stopColor="hsl(44 62% 55%)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="0" cy="0" r="200" fill="url(#ravenGlow)" />
          {/* concentric arcs (semi-circle centered at top-left corner) */}
          <g fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M 170 0 A 170 170 0 0 1 0 170" strokeOpacity="0.55" strokeWidth="1.2" />
            <path d="M 150 0 A 150 150 0 0 1 0 150" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="2 6" />
            <path d="M 190 0 A 190 190 0 0 1 0 190" strokeOpacity="0.25" strokeWidth="0.6" />
          </g>
          {/* filigree flourishes along the main arc */}
          <g fill="currentColor" opacity="0.75">
            {[15, 35, 55, 75].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const r = 170;
              const cx = Math.cos(rad) * r;
              const cy = Math.sin(rad) * r;
              return (
                <g key={deg} transform={`translate(${cx} ${cy}) rotate(${deg + 90})`}>
                  <circle r="2.2" />
                  <path d="M -6 0 Q 0 -5 6 0 Q 0 5 -6 0 Z" opacity="0.6" />
                </g>
              );
            })}
          </g>
        </svg>
        <img
          src={ravenSilhouette}
          alt=""
          aria-hidden="true"
          className="absolute top-0 left-0 object-contain"
          style={{
            width: '78%',
            height: '78%',
            opacity: 0.6,
            filter: 'brightness(0) saturate(100%) invert(72%) sepia(46%) saturate(468%) hue-rotate(6deg) brightness(92%) contrast(88%)',
          }}
        />
      </div>

      {/* Rook — bottom right with filigree semi-circle */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ width: 'min(28vw, 260px)', height: 'min(28vw, 260px)' }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={{ color: 'hsl(44 62% 60%)' }}
        >
          <defs>
            <radialGradient id="rookGlow" cx="100%" cy="100%" r="100%">
              <stop offset="0%" stopColor="hsl(44 62% 55%)" stopOpacity="0.18" />
              <stop offset="70%" stopColor="hsl(44 62% 55%)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="200" fill="url(#rookGlow)" />
          <g fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M 30 200 A 170 170 0 0 0 200 30" strokeOpacity="0.55" strokeWidth="1.2" />
            <path d="M 50 200 A 150 150 0 0 0 200 50" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="2 6" />
            <path d="M 10 200 A 190 190 0 0 0 200 10" strokeOpacity="0.25" strokeWidth="0.6" />
          </g>
          <g fill="currentColor" opacity="0.75">
            {[15, 35, 55, 75].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const r = 170;
              const cx = 200 - Math.cos(rad) * r;
              const cy = 200 - Math.sin(rad) * r;
              return (
                <g key={deg} transform={`translate(${cx} ${cy}) rotate(${deg - 90})`}>
                  <circle r="2.2" />
                  <path d="M -6 0 Q 0 -5 6 0 Q 0 5 -6 0 Z" opacity="0.6" />
                </g>
              );
            })}
          </g>
        </svg>
        <img
          src={chessRook}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute bottom-0 right-0 object-contain"
          style={{
            width: '78%',
            height: '78%',
            opacity: 0.55,
            filter: 'brightness(0) saturate(100%) invert(72%) sepia(46%) saturate(468%) hue-rotate(6deg) brightness(92%) contrast(88%)',
          }}
        />
      </div>


      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-3xl mx-auto px-8 py-14 sm:px-14"
      >
        <p className="uppercase tracking-[0.45em] text-xs sm:text-sm text-primary/90 mb-6 font-medium">
          Change Initiator
        </p>

        <div
          aria-hidden="true"
          className="mx-auto mb-8 h-px w-24"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)' }}
        />

        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8 text-foreground">
          Would you like to <em className="text-primary not-italic">make a change?</em>
        </h1>

        <p className="text-lg md:text-xl leading-relaxed mb-10 text-foreground/85 max-w-2xl mx-auto">
          Our voices matter. Together, we can build a better America through
          community organization and civic planning.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleYesClick}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium tracking-wide px-8 py-6 rounded-md shadow-lg shadow-primary/20"
            >
              Yes, I'm ready <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleNoClick}
              variant="outline"
              size="lg"
              className="border-primary/40 text-foreground hover:bg-primary/10 hover:text-primary text-base font-medium tracking-wide px-8 py-6 rounded-md bg-transparent"
            >
              No, take me away
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="font-serif italic text-white text-lg tracking-wide">
          A platform for civic engagement and community action
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
