import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Create with Prompt or Image',
    description: "Start by describing your vision with a text prompt or uploading a photo to transform. (Image-to-Art feature is currently in Beta.)",
  },
  {
    number: '02',
    title: 'AI-Powered Ghibli Transformation',
    description: "Our AI works its magic to convert your prompt or image into beautiful Studio Ghibli-style art.",
  },
  {
    number: '03',
    title: 'Review & Refine',
    description: "See your transformed artwork, make any adjustments, and download your unique creation.",
  },
  {
    number: '04',
    title: 'Save & Build Your Gallery',
    description: "All your creations are saved in your personal gallery, ready for you to revisit anytime.",
  },
];


const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How Ghiblyze Works
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Bring your thoughts to life with the magic of Studio Ghibli art in a few simple steps
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block"></div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-20 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`md:flex items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3,
                  ease: "easeOut"
                }}
              >
                {/* Step Number */}
                <div className="md:w-1/2 flex md:justify-center">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-md opacity-50"></div>
                    <motion.div
                      className="relative w-20 h-20 bg-white rounded-full border-2 border-primary-500 flex items-center justify-center text-2xl font-bold text-primary-600 z-10"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {step.number}
                    </motion.div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <motion.h3
                    className="text-2xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index * 0.3) + 0.2 }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-700 text-lg leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index * 0.3) + 0.3 }}
                  >
                    {step.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;