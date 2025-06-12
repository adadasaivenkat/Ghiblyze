import { motion } from 'framer-motion';
import { useClerk } from '@clerk/clerk-react';
const Cta = () => {
  const { openSignUp } = useClerk();

  const handleSignUp = () => {
    openSignUp({
      appearance: {
        elements: {
          footer: {
            display: 'flex'
          }
        },
      },
      redirectUrl: '/dashboard'
    });
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Create Ghibli-Style Magic?
          </motion.h2>
          <motion.p
            className="text-lg mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Turn your words or photos into enchanting Ghibli-inspired art with our AI-powered Prompt-to-Art and Image-to-Art features. Explore your creativity and build your own magical gallery — start now!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={handleSignUp}
              className="inline-block bg-white text-primary-600 hover:bg-gray-100 transition-colors py-3 px-8 rounded-lg font-medium shadow-lg"
            >
              Get Started for Free
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Cta;