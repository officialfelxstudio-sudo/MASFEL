import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NeuContainer } from './NeuContainer';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { SponsorItem } from '../utils/db';
import { Modal, NeuInput, NeuButton, NeuFileInput } from './Modal';
import { Trash2, Plus } from 'lucide-react';

export default function SponsorSection() {
  const { t } = useLang();
  const { isOwner } = useAuth();
  const { sponsorItems: items, updateSponsorItems } = useData();
  
  const [modalType, setModalType] = useState<'add' | 'delete' | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddSubmit = () => {
    if (formData.name && formData.url) {
      const newItem = { id: Date.now().toString(), ...formData };
      const newItems = [...items, newItem];
      updateSponsorItems(newItems);
      setModalType(null);
      setFormData({ name: '', url: '' });
    }
  };

  const handleDeleteSubmit = () => {
    if (deleteId) {
      const newItems = items.filter(item => item.id !== deleteId);
      updateSponsorItems(newItems);
      setModalType(null);
      setDeleteId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={containerVariants}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 py-16 sm:py-24 gap-8 sm:gap-12"
      id="sponsor"
    >
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 sm:gap-12">
        <motion.h2 variants={titleVariants} className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-color)]">
          {t('sponsor')}
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-12 w-full max-w-4xl">
          {items.map((item) => (
            <motion.div 
              key={item.id} 
              variants={logoVariants}
              className="relative group"
            >
              <NeuContainer className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center overflow-hidden p-1 sm:p-2 hover:scale-105 transition-transform cursor-pointer">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover rounded-full filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 object-center" />
              </NeuContainer>
              
              {isOwner && (
                <button 
                  onClick={() => { setDeleteId(item.id); setModalType('delete'); }}
                  className="absolute top-0 right-0 z-10 transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
                >
                  <NeuContainer shape="convex" className="p-2 text-red-500 rounded-full">
                    <Trash2 size={12} />
                  </NeuContainer>
                </button>
              )}
            </motion.div>
          ))}

          {isOwner && (
            <motion.div 
              variants={logoVariants}
              className="relative group"
            >
              <NeuContainer 
                onClick={() => { setFormData({ name: '', url: '' }); setModalType('add'); }}
                className="w-32 h-32 rounded-full flex flex-col items-center justify-center overflow-hidden p-2 hover:scale-105 transition-transform cursor-pointer opacity-60 hover:opacity-100 border-4 border-dashed border-[var(--text-color)] text-[var(--text-color)]"
                style={{ background: 'transparent', boxShadow: 'none' }}
              >
                <Plus size={32} className="mb-2" />
                <span className="text-xs font-bold text-center">{t('uploadLogo')}</span>
              </NeuContainer>
            </motion.div>
          )}
        </div>
      </div>

      <Modal isOpen={modalType === 'add'} onClose={() => setModalType(null)} title={t('uploadLogo')}>
        <div className="flex flex-col gap-4">
          <NeuFileInput 
            label="Upload Logo (1:1 Ratio)" 
            value={formData.url} 
            aspectRatio={1}
            onFileSelect={(base64) => setFormData({...formData, url: base64})} 
          />
          <NeuInput placeholder="Sponsor Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <div className="flex gap-4 mt-2">
            <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
            <NeuButton className="flex-1" onClick={handleAddSubmit}>Save</NeuButton>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalType === 'delete'} onClose={() => setModalType(null)} title={t('delete') + '?'}>
        <p className="text-center text-[var(--text-color)] mb-4">Are you sure you want to delete this sponsor?</p>
        <div className="flex gap-4">
          <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
          <NeuButton variant="danger" className="flex-1" onClick={handleDeleteSubmit}>Delete</NeuButton>
        </div>
      </Modal>
      
    </motion.section>
  );
}
