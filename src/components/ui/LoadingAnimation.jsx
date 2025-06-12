import { motion } from 'framer-motion';

const LoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="relative w-20 h-20">
      <motion.div
        className="absolute top-0 left-0 right-0 bottom-0 border-4 border-primary-200 rounded-full"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-primary-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
    <p className="mt-4 text-gray-600">Processing your image...</p>
    <motion.p
      className="text-sm text-gray-500 mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      Applying Studio Ghibli magic...
    </motion.p>
  </div>
);

export default LoadingAnimation; 