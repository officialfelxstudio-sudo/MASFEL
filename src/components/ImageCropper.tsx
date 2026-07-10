import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { Modal, NeuButton } from './Modal';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
  onCancel: () => void;
  aspect?: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Crop Image">
      <div className="relative w-full h-64 sm:h-80 bg-black/10 rounded-xl overflow-hidden mb-4">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-bold text-[var(--text-color)] text-center">Zoom</label>
        <input 
          type="range" 
          value={zoom} 
          min={1} 
          max={3} 
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full cursor-pointer accent-[var(--text-color)]"
        />
      </div>
      <div className="flex gap-4">
        <NeuButton className="flex-1" onClick={onCancel}>Cancel</NeuButton>
        <NeuButton className="flex-1" onClick={handleSave}>Apply Crop</NeuButton>
      </div>
    </Modal>
  );
};
