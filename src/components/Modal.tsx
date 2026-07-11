import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NeuContainer } from './NeuContainer';
import { X } from 'lucide-react';
import { ImageCropper } from './ImageCropper';
import { fileToBase64 } from '../utils/cropImage';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <NeuContainer shape="flat" className="p-4 sm:p-6 w-full relative flex flex-col gap-4 sm:gap-6 rounded-3xl">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-[var(--text-color)] opacity-70 hover:opacity-100"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-center text-[var(--text-color)]">{title}</h2>
              {children}
            </NeuContainer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const NeuInput: React.FC<NeuInputProps> = (props) => {
  return (
    <NeuContainer shape="pressed" className="p-1 rounded-xl">
      <input 
        className="w-full bg-transparent border-none outline-none p-3 text-[var(--text-color)]"
        {...props}
      />
    </NeuContainer>
  );
};

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'danger' | 'normal';
}

export const NeuButton: React.FC<NeuButtonProps> = ({ children, className = '', variant = 'normal', ...props }) => {
  return (
    <button 
      className={`focus:outline-none transition-transform hover:scale-105 active:scale-95 ${className} ${variant === 'danger' ? 'text-red-500' : 'text-[var(--text-color)]'}`} 
      {...props}
    >
      <NeuContainer shape="flat" className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-bold flex justify-center items-center gap-2">
        {children}
      </NeuContainer>
    </button>
  );
};

interface NeuFileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onFileSelect: (base64: string) => void;
  label?: string;
  value?: string;
  aspectRatio?: number;
}

export const NeuFileInput: React.FC<NeuFileInputProps> = ({ onFileSelect, label = "Upload Image", value, aspectRatio, className = '', ...props }) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setTempImage(base64);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCropComplete = async (croppedBase64: string) => {
    // Optionally resize the cropped image to save storage space
    try {
      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], "cropped.png", { type: "image/png" });
      const { resizeImage } = await import('../utils/image');
      const finalBase64 = await resizeImage(file, 800, 800);
      
      setPreview(finalBase64);
      onFileSelect(finalBase64);
      setTempImage(null);
    } catch(e) {
      console.error(e);
      setPreview(croppedBase64);
      onFileSelect(croppedBase64);
      setTempImage(null);
    }
  };

  return (
    <>
      <div className={`flex flex-col gap-2 ${className}`}>
        <label className="text-sm font-bold text-[var(--text-color)]">{label}</label>
        <NeuContainer shape="pressed" className="p-1 rounded-xl flex flex-col items-center justify-center min-h-[100px] relative overflow-hidden">
          {preview && (
            <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          )}
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
            value=""
            {...props}
          />
          <div className="z-20 text-[var(--text-color)] font-bold opacity-70 flex flex-col items-center pointer-events-none">
             <span>Click to select file</span>
          </div>
        </NeuContainer>
      </div>

      {tempImage && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center">
          <ImageCropper 
            imageSrc={tempImage} 
            aspect={aspectRatio || 1} 
            onCropComplete={handleCropComplete} 
            onCancel={() => setTempImage(null)} 
          />
        </div>
      )}
    </>
  );
};
