import { motion } from 'framer-motion';
import { FiImage, FiUpload, FiClock } from 'react-icons/fi';
import { FiShield } from 'react-icons/fi';
const featureItems = [
  {
    icon: <FiImage className="w-6 h-6" />,
    title: 'Prompt-to-Ghibli Art',
    description: 'Describe your imagination in words, and let our AI generate stunning Ghibli-inspired visuals from your text.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: <FiUpload className="w-6 h-6" />,
    title: (
      <span className="flex items-center gap-2">
        Image-to-Art
        <span className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full shadow-sm">
          Beta
        </span>
      </span>
    ),
    description: 'Upload your photos to try our early Image-to-Ghibli conversion. This feature is live but still improving its magic!',
    color: 'bg-yellow-50 text-yellow-700',
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: 'Your Personal Gallery',
    description: 'All your generated images are saved to your gallery.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: <FiClock className="w-6 h-6" />,
    title: (
      <span className="flex items-center gap-2">
        Journey Tracker
        <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full shadow-sm">
          Coming Soon
        </span>
      </span>
    ),
    description: "Soon you'll be able to revisit and relive all your past creations — a timeline of your artistic evolution.",
    color: 'bg-gray-100 text-gray-500',
  }
];


const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-16 md:py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Bring Your Creativity to Life with Ghibli Magic
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore powerful AI tools that turn your words and photos into enchanting Studio Ghibli-inspired art.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              className="card hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;