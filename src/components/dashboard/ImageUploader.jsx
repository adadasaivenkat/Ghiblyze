import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiImage, FiAlertCircle } from 'react-icons/fi';

const ImageUploader = ({ onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setError(null);

    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target.result;
      setPreview(previewUrl);
      if (onImageSelect) {
        onImageSelect(file, previewUrl);
      }
    };
    reader.readAsDataURL(file);

  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const resetUpload = () => {
    setSelectedImage(null);
    setPreview(null);
    setError(null);
    if (onImageSelect) {
      onImageSelect(null, null);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'
                }`}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  {isDragActive ? (
                    <FiImage className="w-8 h-8 text-primary-600" />
                  ) : (
                    <FiUpload className="w-8 h-8 text-primary-600" />
                  )}
                </div>

                <h3 className="text-lg font-medium mb-2">
                  {isDragActive
                    ? 'Drop your image here'
                    : 'Drag & drop your image here'
                  }
                </h3>

                <p className="text-gray-500 mb-4">
                  or click to browse your files
                </p>

                <p className="text-xs text-gray-400">
                  Supported formats: JPEG, PNG, GIF, WebP (max 10MB)
                </p>
              </div>
            </div>

            {error && (
              <motion.div
                className="mt-3 text-error-600 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiAlertCircle className="mr-2" />
                <span>{error}</span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
              <img
                src={preview}
                alt="Image preview"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={resetUpload}
              className="mt-4 text-gray-600 hover:text-error-600 transition-colors text-sm font-medium"
            >
              Remove image and upload another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;