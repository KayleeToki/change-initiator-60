import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleYesClick = () => navigate('/map');
  const handleNoClick = () => { window.location.href = 'https://www.google.com'; };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
        backgroundSize: '80px 80px',
        backgroundPosition: '0 0, 0 40px, 40px -40px, -40px 0px',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Rook silhouette backdrop - inline SVG combining chess rook + bird */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 m-auto opacity-20 pointer-events-none"
        style={{ width: 'min(70vw, 600px)', height: 'min(70vw, 600px)' }}
        viewBox="0 0 200 200"
        fill="black"
      >
        {/* Chess rook piece */}
        <path d="M55 160 h90 v15 H55z M60 150 h80 v10 H60z M70 70 h60 v80 H70z M65 50 h10 v20 H65z M85 50 h10 v20 H85z M105 50 h10 v20 H105z M125 50 h10 v20 H125z M60 45 h80 v10 H60z" />
        {/* Bird (rook) silhouette perched on top */}
        <path d="M100 45 c-8 -10 -20 -15 -30 -12 c5 -8 18 -12 28 -8 c-2 -6 2 -12 8 -14 c4 6 4 12 2 16 c10 -2 22 4 24 12 c-12 -2 -22 2 -32 6 z M128 35 l8 -2 l-6 4 z" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl mx-auto bg-black/60 backdrop-blur-sm rounded-2xl p-10 border border-white/10 shadow-2xl"
      >
        <h1 className="text-5xl font-bold mb-8 text-white md:text-6xl drop-shadow-lg">
          Would you like to make a change?
        </h1>
        <p className="text-xl mb-10 font-medium" style={{ color: '#5ef38c' }}>
          Our voices matter. Together, we can build a better America through community organization and civic planning.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleYesClick}
              className="bg-green-500 hover:bg-green-600 text-white text-xl py-6 px-10 rounded-lg shadow-lg"
            >
              Yes, I'm ready
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleNoClick}
              className="bg-red-500 hover:bg-red-600 text-white text-xl py-6 px-10 rounded-lg shadow-lg"
            >
              No, take me away
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-center text-white/80 z-10 bg-black/40 px-4 py-2 rounded">
        <p>A platform for civic engagement and community action</p>
      </div>
    </div>
  );
};

export default LandingPage;
