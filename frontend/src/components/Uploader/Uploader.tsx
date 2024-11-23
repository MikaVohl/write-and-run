import React, { useRef, useState } from 'react';
import { Upload, Camera } from 'lucide-react'; // Ensure you have lucide-react installed
import { Button } from '@/components/ui/button';
 // Replace with your button component import

const Uploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 border border-gray-300 rounded-lg p-4 w-full h-96">
      {uploadedImage ? (
        <div className="w-full h-full">
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="w-full h-full object-cover rounded-lg" 
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p>No image uploaded. Please upload or capture an image.</p>
        </div>
      )}

      <div className="flex space-x-2">
        {/* File Upload Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2" /> Upload Image
        </Button>

        {/* Camera Capture Input */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCameraCapture}
        />
        <Button
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="mr-2" /> Take Photo
        </Button>
      </div>
    </div>
  );
};

export default Uploader;
