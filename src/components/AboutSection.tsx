import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NeuContainer } from './NeuContainer';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { renderIcon } from './IconRenderer';
import { AboutData } from '../utils/db';
import { Modal, NeuInput, NeuButton } from './Modal';
import { Edit2 } from 'lucide-react';

export default function AboutSection() {
  const { t } = useLang();
  const { isOwner } = useAuth();
  const { aboutData, updateAboutData } = useData();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<AboutData>({ text: '', buttonLabel: '', buttonUrl: '', buttonIcon: '' });

  const openEdit = () => {
    if (aboutData) {
      setFormData(aboutData);
      setModalOpen(true);
    }
  };

  const handleSave = () => {
    updateAboutData(formData);
    setModalOpen(false);
  };

  if (!aboutData) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={containerVariants}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 gap-8 sm:gap-12 relative"
      id="about"
    >
      <div className="w-full max-w-4xl flex flex-col items-center gap-6 sm:gap-8 relative">
        <motion.h2 variants={itemVariants} className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-color)] mb-8">
          {t('about')}
        </motion.h2>
        
        {isOwner && (
          <button 
            onClick={openEdit}
            className="absolute top-0 right-0 p-3 bg-[var(--bg-color)] text-[var(--text-color)] rounded-full shadow-lg transition-opacity hover:scale-110 z-10"
          >
            <Edit2 size={20} />
          </button>
        )}
        
        <motion.div variants={itemVariants} className="w-full">
          <NeuContainer className="p-4 w-full text-center sm:text-left flex flex-col gap-3 sm:gap-4 text-[var(--text-color)] text-sm sm:text-base leading-relaxed">
            {aboutData.text.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            
            <div className="flex justify-center mt-4">
              <a href={aboutData.buttonUrl} target="_blank" rel="noopener noreferrer">
                <NeuContainer shape="flat" className="px-4 py-2 flex items-center justify-center gap-2 text-[var(--text-color)] font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer rounded-full text-sm">
                  {renderIcon(aboutData.buttonIcon, aboutData.buttonUrl, 18)}
                </NeuContainer>
              </a>
            </div>
          </NeuContainer>
        </motion.div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit About">
        <div className="flex flex-col gap-4">
          <textarea 
            className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-4 rounded-xl resize-none h-48 focus:outline-none"
            style={{ boxShadow: 'inset 5px 5px 10px var(--shadow-dark), inset -5px -5px 10px var(--shadow-light)' }}
            value={formData.text}
            onChange={(e) => setFormData({...formData, text: e.target.value})}
            placeholder="About text..."
          />
          <NeuInput 
            placeholder="Button URL (e.g. https://discord.com)" 
            value={formData.buttonUrl} 
            onChange={e => setFormData({...formData, buttonUrl: e.target.value})} 
          />
          <div className="flex gap-4 mt-2">
            <NeuButton className="flex-1" onClick={() => setModalOpen(false)}>Cancel</NeuButton>
            <NeuButton className="flex-1" onClick={handleSave}>Save</NeuButton>
          </div>
        </div>
      </Modal>
    </motion.section>
  );
}
