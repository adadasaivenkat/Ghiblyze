import { useState } from 'react';
import { motion } from 'framer-motion';

const PromptInput = ({ onPromptSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (prompt.length < 5) {
      setError('Prompt is too short. Please be more descriptive.');
      return;
    }

    setError('');
    onPromptSubmit(prompt);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Describe your image
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate in Studio Ghibli style (e.g., A peaceful lake surrounded by mountains with a small cottage nearby)"
            className="input min-h-[120px]"
            rows="4"
          />
          {error && (
            <motion.p
              className="mt-2 text-sm text-error-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Generate Image
          </button>
        </div>
      </form>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Prompt suggestions:
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            'A forest spirit under a giant tree',
            'A flying castle in the clouds',
            'A cozy bakery in a small village',
            'A cat sitting by a window in the rain'
          ].map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;