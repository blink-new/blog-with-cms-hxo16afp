import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// For v1, we'll use placeholder images from Unsplash
const sampleImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
    title: 'Laptop on desk',
    dimensions: '5472 × 3648',
    size: '2.3 MB',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    title: 'Person writing',
    dimensions: '4000 × 6000',
    size: '3.1 MB',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f',
    title: 'Coffee and laptop',
    dimensions: '5184 × 3456',
    size: '2.8 MB',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
    title: 'Notebook and coffee',
    dimensions: '3992 × 2992',
    size: '2.5 MB',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e',
    title: 'Magazine pages',
    dimensions: '4016 × 6016',
    size: '3.4 MB',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc',
    title: 'Books on shelf',
    dimensions: '4480 × 6720',
    size: '4.1 MB',
  },
];

const Media = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    toast.success('URL copied to clipboard');
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <Button>
          <Upload className="h-5 w-5 mr-2" />
          Upload Image
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">All Images</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            In v1, we're using placeholder images from Unsplash. Future versions will support image uploads.
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-gray-50 rounded-lg overflow-hidden border-2 transition-all duration-200 dark:bg-gray-700 ${
                  selectedImage === image.id ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(image.id)}
              >
                <div className="relative aspect-video">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{image.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{image.dimensions}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(image.url);
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      {copied === image.url ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;