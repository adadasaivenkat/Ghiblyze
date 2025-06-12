import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <div className="flex items-center">
      <motion.div
        className="w-10 h-10 mr-2.5 bg-ghibli-blue rounded-full flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className="text-white font-bold text-xl">G</span>
      </motion.div>
      <span className="text-2xl font-bold bg-gradient-to-r from-ghibli-blue to-ghibli-green bg-clip-text text-transparent">
        Ghiblyze
      </span>
    </div>
  );
};

export default Logo;