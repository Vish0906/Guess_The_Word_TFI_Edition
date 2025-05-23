import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  
  const handleStartGame = () => {
    navigate('/game');
  };

  return (
    <div className="min-h-screen telugu-pattern-bg flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg z-10 relative"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-telugu-blue mb-4">
          TFI Banisa
        </h1>
        <div className="flex items-center justify-center my-6">
          <div className="h-1 w-16 bg-telugu-gold rounded"></div>
          <div className="h-1 w-32 bg-telugu-blue rounded mx-2"></div>
          <div className="h-1 w-16 bg-telugu-gold rounded"></div>
        </div>
        <p className="text-lg mb-8 text-gray-700">
          Challenge yourself with this Telugu cinema inspired word puzzle! Solve the questions to reveal the hidden word...(Or a Telugu Movie)
        </p>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
        >
          <Button 
            onClick={handleStartGame}
            className="bg-telugu-blue hover:bg-telugu-lightBlue text-white font-bold py-3 px-8 rounded-lg text-lg transition-all"
          >
            Start Game
          </Button>
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-4 text-sm text-white font-medium bg-black/50 px-4 py-1 rounded-full z-10">
        Inspired by Wordle • Telugu Cinema Edition
      </div>
    </div>
  );
};

export default Index;