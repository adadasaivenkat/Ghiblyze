import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateImage, transformImage } from '../../services/imageService';
import { saveToGallery, GALLERY_UPDATE_EVENT } from '../../services/galleryService';
import { FiDownload, FiSave, FiAlertCircle, FiEye, FiX } from 'react-icons/fi';
import { useUser } from '@clerk/clerk-react';
import LoadingAnimation from '../ui/LoadingAnimation';

const ImageProcessor = ({ originalImage, promptText }) => {
  const [status, setStatus] = useState('idle'); // idle, processing, complete, error
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!originalImage && !promptText) {
      setStatus('idle');
      return;
    }

    const processImage = async () => {
      setStatus('processing');
      setGeneratedImage(null);
      setError(null);

      try {
        let result;
        if (promptText) {
          result = await generateImage(promptText);
        } else if (originalImage) {
          result = await transformImage(originalImage, 'Transform into Studio Ghibli style');
        }

        setGeneratedImage(result);
        setStatus('complete');
      } catch (err) {
        console.error('Error processing image:', err);
        setError(err.message || 'Failed to process image. Please try again.');
        setStatus('error');
      }
    };

    processImage();
  }, [originalImage, promptText]);

  const handleDownload = async () => {
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ghibli-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleSaveToGallery = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      await saveToGallery(generatedImage, promptText || 'Generated Ghibli Image', user.id);
      setIsSaving(false);

      // Dispatch custom event to notify gallery
      window.dispatchEvent(new Event(GALLERY_UPDATE_EVENT));
    } catch (error) {
      console.error('Error saving to gallery:', error);
      setIsSaving(false);
    }
  };

  const handleView = () => {
    setShowFullImage(true);
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {status === 'processing' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12"
          >
            <LoadingAnimation />
          </motion.div>
        )}

        {status === 'complete' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-4"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={generatedImage}
                  alt="Generated Ghibli style image"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleView}
                  className="absolute top-4 right-4 p-2.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <FiEye className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm font-medium text-gray-600">
                  Generated with Ghiblyze
                </p>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm flex items-center"
                  >
                    <FiDownload className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={handleSaveToGallery}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save to Gallery'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 text-center"
          >
            <div className="text-error-600 mb-4">
              <FiAlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Failed</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              className="btn-primary"
              onClick={() => setStatus('idle')}
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Image Modal */}
      {showFullImage && generatedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowFullImage(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="fixed top-6 right-6 text-white hover:text-gray-300 bg-black/70 hover:bg-black/90 p-2.5 rounded-full transition-colors z-50 shadow-lg"
              onClick={() => setShowFullImage(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={generatedImage}
              alt="Generated Ghibli style image"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;