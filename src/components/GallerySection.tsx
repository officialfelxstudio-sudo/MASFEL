import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NeuContainer } from './NeuContainer';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GalleryItem } from '../utils/db';
import { Modal, NeuButton, NeuFileInput, NeuInput } from './Modal';
import { Trash2, Plus, Edit2, ExternalLink } from 'lucide-react';
import { useTilt } from '../hooks/useTilt';
import { getPlatformInfo } from '../utils/galleryLinkUtils';

function GalleryCard({ item, variants, isOwner, onEdit, onDelete }: {
  item: GalleryItem;
  variants: any;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const tilt = useTilt(6);
  return (
    <motion.div variants={variants} className="relative w-full sm:w-64 max-w-[260px]">
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={tilt.style}
      >
        <NeuContainer overrideDistance={1} overrideBlur={1} className="flex flex-col p-1 gap-2 h-full text-[var(--text-color)] rounded-2xl">
          <NeuContainer overrideDistance={1} overrideBlur={1} shape="pressed" className="w-full aspect-video overflow-hidden rounded-xl">
            <img src={item.url} alt="Gallery item" className="w-full h-full object-cover object-center" />
          </NeuContainer>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-2xl font-bold">{item.title || '\u00A0'}</h3>
            <p className="opacity-70 text-sm flex-1">{item.desc || '\u00A0'}</p>
          </div>
        </NeuContainer>
      </div>
      {item.link && (() => {
        const platform = getPlatformInfo(item.link);
        return (
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-3 block">
            <NeuContainer shape="flat" className="py-2 px-3 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer hover:scale-[1.03] active:scale-95 transition-transform rounded-xl text-[var(--text-color)]">
              {platform.faviconUrl ? (
                <img src={platform.faviconUrl} alt={platform.label} className="w-5 h-5 rounded-sm object-contain" />
              ) : (
                <ExternalLink size={16} />
              )}
              {platform.label}
            </NeuContainer>
          </a>
        );
      })()}
      {isOwner && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button onClick={onEdit} className="transition-transform hover:scale-110">
            <NeuContainer shape="convex" className="p-3 text-[var(--text-color)] rounded-full">
              <Edit2 size={16} />
            </NeuContainer>
          </button>
          <button onClick={onDelete} className="transition-transform hover:scale-110">
            <NeuContainer shape="convex" className="p-3 text-red-500 rounded-full">
              <Trash2 size={16} />
            </NeuContainer>
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function GallerySection() {
  const { t } = useLang();
  const { isOwner } = useAuth();
  const { galleryItems: items, updateGalleryItems, homeLinks } = useData();
  const socialLinks = homeLinks.filter(l => !l.isPrimary);
  
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({ url: '', title: '', desc: '', link: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddSubmit = () => {
    if (formData.url) {
      let newItems = [...items];
      if (modalType === 'add') {
        const newItem = { id: Date.now().toString(), ...formData };
        newItems = [...items, newItem];
      } else if (modalType === 'edit' && currentItem) {
        newItems = items.map(item => item.id === currentItem.id ? { ...item, ...formData } : item);
      }
      updateGalleryItems(newItems);
      
      setModalType(null);
      setFormData({ url: '', title: '', desc: '', link: '' });
      setCurrentItem(null);
    }
  };

  const handleDeleteSubmit = () => {
    if(deleteId) {
      const newItems = items.filter(item => item.id !== deleteId);
      updateGalleryItems(newItems);
      
      setModalType(null);
      setDeleteId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    },
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={containerVariants}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 py-16 sm:py-24 gap-8 sm:gap-12"
      id="gallery"
    >
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 sm:gap-12">
        <motion.h2 variants={titleVariants} className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-color)]">
          {t('gallery')}
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 w-full max-w-5xl">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} variants={cardVariants} isOwner={isOwner}
              onEdit={() => { setCurrentItem(item); setFormData({ url: item.url, title: item.title || '', desc: item.desc || '', link: item.link || '' }); setModalType('edit'); }}
              onDelete={() => { setDeleteId(item.id); setModalType('delete'); }}
            />
          ))}

          {isOwner && (
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -5 }} 
              className="relative h-full w-full sm:w-[calc(50%-1rem)] max-w-sm min-h-[350px]"
            >
              <NeuContainer 
                onClick={() => { setFormData({ url: '', title: '', desc: '', link: '' }); setModalType('add'); }}
                className="flex flex-col items-center justify-center p-6 rounded-3xl h-full cursor-pointer opacity-60 hover:opacity-100 transition-all border-4 border-dashed border-[var(--text-color)] text-[var(--text-color)]"
                style={{ background: 'transparent', boxShadow: 'none' }}
              >
                <Plus size={48} className="mb-4" />
                <span className="font-bold">{t('uploadNewImage')}</span>
              </NeuContainer>
            </motion.div>
          )}
        </div>

        {socialLinks.length > 0 && (
          <motion.div variants={cardVariants} className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
            {socialLinks.map((link) => {
              const platform = getPlatformInfo(link.url);
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                  <NeuContainer shape="flat" className="px-4 py-2.5 flex items-center gap-2.5 text-[var(--text-color)] font-semibold text-sm cursor-pointer hover:scale-105 active:scale-95 transition-transform rounded-full">
                    {link.icon ? (
                      <img src={platform.faviconUrl || link.icon} alt={platform.label} className="w-5 h-5 rounded-sm object-contain" />
                    ) : platform.faviconUrl ? (
                      <img src={platform.faviconUrl} alt={platform.label} className="w-5 h-5 rounded-sm object-contain" />
                    ) : (
                      <ExternalLink size={18} />
                    )}
                    {platform.label}
                  </NeuContainer>
                </a>
              );
            })}
          </motion.div>
        )}
      </div>

      <Modal isOpen={modalType === 'add' || modalType === 'edit'} onClose={() => setModalType(null)} title={modalType === 'add' ? t('uploadNewImage') : t('edit')}>
        <div className="flex flex-col gap-4">
          <NeuFileInput 
            label="Upload Image (16:9)" 
            value={formData.url} 
            aspectRatio={16/9}
            onFileSelect={(base64) => setFormData({...formData, url: base64})} 
          />
          <NeuInput placeholder="Title (Optional)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <NeuInput placeholder="Description (Optional)" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
          <NeuInput placeholder="Download Link (Optional)" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
          <div className="flex gap-4 mt-2">
            <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
            <NeuButton className="flex-1" onClick={handleAddSubmit}>Save</NeuButton>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalType === 'delete'} onClose={() => setModalType(null)} title={t('delete') + '?'}>
        <p className="text-center text-[var(--text-color)] mb-4">Are you sure you want to delete this image?</p>
        <div className="flex gap-4">
          <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
          <NeuButton variant="danger" className="flex-1" onClick={handleDeleteSubmit}>Delete</NeuButton>
        </div>
      </Modal>

    </motion.section>
  );
}
