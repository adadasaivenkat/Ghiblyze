import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiType, FiChevronRight, FiX } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ImageUploader from '../components/dashboard/ImageUploader';
import PromptInput from '../components/dashboard/PromptInput';
import ImageProcessor from '../components/dashboard/ImageProcessor';
import Gallery from '../components/dashboard/Gallery';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('prompt'); // Start with 'prompt'
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setImagePreview(preview);
    setPromptText('');
    setIsProcessing(true);
  };

  const handlePromptSubmit = (prompt) => {
    setPromptText(prompt);
    setSelectedImage(null);
    setImagePreview(null);
    setIsProcessing(true);
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
              <h1 className="text-2xl font-bold">Ghiblyze Creator Dashboard</h1>
              <p className="opacity-90">Bring your thoughts to life in the enchanting Studio Ghibli style using our AI-powered tool.</p>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Input & Controls */}
                <div>
                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`flex items-center px-4 py-2 font-medium border-b-2 ${activeTab === 'prompt'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      onClick={() => setActiveTab('prompt')}
                    >
                      <FiType className="mr-2 h-5 w-5" />
                      Text Prompt
                    </button>
                    <button
                      className={`flex items-center px-4 py-2 font-medium border-b-2 ${activeTab === 'upload'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      onClick={() => setActiveTab('upload')}
                    >
                      <FiUpload className="mr-2 h-5 w-5" />
                      Upload Image
                      <span className="ml-2 text-xs font-semibold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full shadow-sm">
                        Beta
                      </span>
                    </button>
                  </div>

                  {/* Content based on active tab */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'upload' ? (
                      <div>
                        <h2 className="text-xl font-bold mb-4">Upload an Image (Beta)</h2>
                        <p className="text-gray-600 mb-6">
                          Try our early Image-to-Art feature — upload a photo and our AI will transform it into Studio Ghibli-style artwork.
                        </p>
                        <ImageUploader onImageSelect={handleImageSelect} />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-bold mb-4">Generate from Text</h2>
                        <p className="text-gray-600 mb-6">
                          Describe what you want to see, and our AI will create a Ghibli-style image from your imagination.
                        </p>
                        <PromptInput onPromptSubmit={handlePromptSubmit} />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Right Column: Preview & Result */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6">
                  <div className="relative w-full">
                    <ImageProcessor
                      originalImage={selectedImage}
                      promptText={promptText}
                    />
                  </div>

                  {!imagePreview && !promptText && !isProcessing && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <FiChevronRight className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Transform</h3>
                      <p className="text-gray-600">
                        {activeTab === 'upload'
                          ? 'Upload an image to get started'
                          : 'Enter a text prompt to generate an image'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Section */}
              <div className="mt-16">
                <Gallery />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && imagePreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowFullImage(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="fixed top-6 right-6 text-white hover:text-gray-300 bg-black/70 hover:bg-black/90 p-2.5 rounded-full transition-colors z-50 shadow-lg"
              onClick={() => setShowFullImage(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={imagePreview}
              alt="Generated image"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
