import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ravenSilhouette from "@/assets/raven-silhouette.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleYesClick = () => navigate('/map');
  const handleNoClick = () => { window.location.href = 'https://www.google.com'; };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(45deg, #d4d4d4 25%, transparent 25%), linear-gradient(-45deg, #d4d4d4 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d4d4 75%), linear-gradient(-45deg, transparent 75%, #d4d4d4 75%)',
        backgroundSize: '160px 160px',
        backgroundPosition: '0 0, 0 80px, 80px -80px, -80px 0px',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Raven silhouette - top left */}
      <img
        src={ravenSilhouette}
        alt=""
        aria-hidden="true"
        width={1024}
        height={1024}
        className="absolute top-4 left-4 pointer-events-none object-contain mix-blend-multiply"
        style={{ width: 'min(32vw, 300px)', height: 'min(32vw, 300px)', opacity: 0.92 }}
      />

      {/* Chess rook piece - bottom right */}
      <svg
        aria-hidden="true"
        className="absolute bottom-8 right-8 pointer-events-none"
        style={{ width: 'min(28vw, 260px)', height: 'min(28vw, 260px)', opacity: 0.85 }}
        viewBox="0 0 200 200"
        fill="#0a0a0a"
      >
        <path d="M50 170 h100 v15 H50z M55 158 h90 v10 H55z M65 75 h70 v82 H65z M60 55 h12 v22 H60z M82 55 h12 v22 H82z M104 55 h12 v22 H104z M126 55 h12 v22 H126z M55 50 h90 v10 H55z" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-3xl mx-auto bg-black/70 backdrop-blur-sm rounded-2xl p-10 border border-white/10 shadow-2xl"
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10 bg-black/50 px-5 py-2.5 rounded">
        <p className="text-white text-lg font-medium">A platform for civic engagement and community action</p>
      </div>
    </div>
  );
};

export default LandingPage;
