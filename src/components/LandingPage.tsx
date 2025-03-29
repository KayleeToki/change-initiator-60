
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    navigate('/map');
  };

  const handleNoClick = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-bold mb-8 text-gray-900 md:text-6xl">Would you like to make a change?</h1>
        <p className="text-xl mb-10 text-gray-700">
          Your voice matters. Together, we can build a better, more equitable society through civic engagement.
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

      <div className="absolute bottom-8 text-center text-gray-600">
        <p>A platform for civic engagement and community action</p>
      </div>
    </div>
  );
};

export default LandingPage;
