import { useState } from 'react';

const ExpandableImage = ({ src, alt }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mt-3 relative w-full">
      <div 
        className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
          expanded ? 'max-h-full' : 'max-h-[400px]'
        }`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain cursor-pointer"
          onClick={toggleExpanded}
        />
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-100 to-transparent h-12 flex items-end justify-center">
            <button 
              className="mb-2 px-4 py-1 bg-white bg-opacity-70 rounded-full text-sm text-gray-700 hover:bg-opacity-100 focus:outline-none shadow-sm"
              onClick={toggleExpanded}
            >
              Voir l'image complète
            </button>
          </div>
        )}
      </div>
      {expanded && (
        <button 
          className="mt-2 px-4 py-1 bg-white rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none shadow-sm"
          onClick={toggleExpanded}
        >
          Réduire l'image
        </button>
      )}
    </div>
  );
};
export default ExpandableImage;