import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiCalendar, FiDownload, FiTrash2, FiEye, FiAlertCircle, FiX } from 'react-icons/fi';
import { useUser } from '@clerk/clerk-react';
import { getGallery, deleteFromGallery, GALLERY_UPDATE_EVENT } from '../../services/galleryService';

const ImageCard = ({ image, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ghibli-image-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleView = () => {
    setShowFullImage(true);
  };

  return (
    <>
      <motion.div
        className="relative rounded-xl overflow-hidden bg-white shadow-md"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="aspect-square">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-white font-medium truncate">{image.title}</h3>
          <div className="flex items-center text-white/80 text-sm mt-1">
            <FiCalendar className="w-3 h-3 mr-1" />
            <span>{formatDate(image.created_at)}</span>
          </div>

          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleView}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full active:bg-white/40"
            >
              <FiEye className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full active:bg-white/40"
            >
              <FiDownload className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => onDelete(image.id)}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full active:bg-white/40"
            >
              <FiTrash2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Mobile Action Buttons - Always visible on mobile */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex space-x-2">
            <button
              onClick={handleView}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full active:bg-white/40"
            >
              <FiEye className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full active:bg-white/40"
            >
              <FiDownload className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => onDelete(image.id)}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full active:bg-white/40"
            >
              <FiTrash2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowFullImage(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="fixed top-6 right-6 text-white hover:text-gray-300 bg-black/70 hover:bg-black/90 p-2.5 rounded-full transition-colors z-50 shadow-lg"
              onClick={() => setShowFullImage(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const { user } = useUser();

  const loadGallery = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getGallery(user.id);
      setImages(data);
      setError(null);
    } catch (err) {
      console.error('Error loading gallery:', err);
      setError('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadGallery();
    }

    // Listen for gallery updates
    window.addEventListener(GALLERY_UPDATE_EVENT, loadGallery);

    return () => {
      window.removeEventListener(GALLERY_UPDATE_EVENT, loadGallery);
    };
  }, [user]);

  const handleDelete = async (imageId) => {
    if (!user) return;

    try {
      await deleteFromGallery(imageId, user.id);
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  // Get preview images (first 4)
  const previewImages = images.slice(0, 4);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Gallery</h2>
        {images.length > 4 && (
          <button
            className="btn-outline py-2 px-4"
            onClick={() => setShowFullGallery(true)}
          >
            View Gallery
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
            <FiEye className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Gallery...</h3>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-error-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-error-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Gallery</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadGallery}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
            <FiEye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Yet</h3>
          <p className="text-gray-600 mb-4">
            Your generated images will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(showFullGallery ? images : previewImages).map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Full Gallery Modal */}
      {showFullGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowFullGallery(false)}>
          <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              className="fixed top-6 right-6 text-white hover:text-gray-300 bg-black/70 hover:bg-black/90 p-2.5 rounded-full transition-colors z-50 shadow-lg"
              onClick={() => setShowFullGallery(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;