import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/clerk-react';

const Hero = () => {
  const [showImage, setShowImage] = useState(false);
  const { openSignUp } = useClerk();

  const prompt = 'A magical forest with glowing fireflies and ancient trees...';
  const image = '/hero_image.png';

  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = () => {
    openSignUp({
      appearance: {
        elements: {
          // footer: 'hidden',   
          // ⚠️ Hiding (Clerk branding) the footer symbol violates Clerk's Terms of Service.
          footer: {
            display: 'flex'
          }
        },
      },
      redirectUrl: '/dashboard'
    });
  };
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section id="home" className="min-h-[90vh] pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Hero Text */}
          <motion.div variants={itemVariants} className="max-w-2xl">
            <motion.span
              variants={itemVariants}
              className="inline-block px-4 py-1.5 text-sm font-semibold bg-primary-100 text-primary-800 rounded-full mb-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              ✨ Transform Your Imagination
            </motion.span>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-ghibli-blue via-primary-600 to-ghibli-green bg-clip-text text-transparent leading-tight"
            >
              Where Dreams Become Art
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
            >
              Experience the magic of AI-powered image generation. Turn your wildest ideas into stunning visuals, inspired by Studio Ghibli's enchanting style.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <button
                onClick={handleSignUp}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:scale-105"
              >
                Start Creating Now
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="px-8 py-3 bg-white hover:bg-gray-50 text-ghibli-night border-2 border-gray-200 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-center transform hover:scale-105"
              >
                See How It Works
              </button>
            </motion.div>
          </motion.div>

          {/* Animated Prompt + Image Result */}
          <motion.div
            variants={itemVariants}
            className="relative max-w-md mx-auto"
          >
            <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              {/* Typing Animation */}
              <div className="text-lg font-medium text-gray-700 min-h-[60px] bg-gray-50 p-3 rounded-lg">
                <Typewriter
                  words={[prompt]}
                  loop={1}
                  cursor
                  cursorStyle="|"
                  typeSpeed={40}
                  deleteSpeed={30}
                  delaySpeed={2000}
                />
              </div>

              {/* Image Appears after typing */}
              {showImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mt-6 rounded-xl overflow-hidden aspect-[4/3] border border-gray-100 shadow-md"
                >
                  <img
                    src={image}
                    alt={`AI-generated scene: ${prompt}`}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
