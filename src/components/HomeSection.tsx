import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NeuContainer } from './NeuContainer';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { renderIcon } from './IconRenderer';
import { HomeLink } from '../utils/db';
import { Modal, NeuInput, NeuButton, NeuFileInput } from './Modal';
import { Plus, Edit2, Trash2, Camera, ExternalLink } from 'lucide-react';
import { getPlatformInfo } from '../utils/galleryLinkUtils';

export default function HomeSection() {
  const { t } = useLang();
  const { isOwner } = useAuth();
  const { 
    homeLinks: links, 
    heroImage, 
    homeText, 
    updateHomeLinks, 
    updateHeroImage 
  } = useData();
  
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'hero' | null>(null);
  const [currentLink, setCurrentLink] = useState<HomeLink | null>(null);
  const [formData, setFormData] = useState({ label: '', icon: '', url: '', isPrimary: false });
  const [tempHeroImage, setTempHeroImage] = useState('');

  const saveLinks = (newLinks: HomeLink[]) => {
    updateHomeLinks(newLinks);
  };

  const openAdd = (isPrimary: boolean) => {
    setFormData({ label: '', icon: isPrimary ? 'Link' : 'Instagram', url: '', isPrimary });
    setCurrentLink(null);
    setModalType('add');
  };

  const openEdit = (link: HomeLink) => {
    setCurrentLink(link);
    setFormData({ label: link.label, icon: link.icon, url: link.url, isPrimary: link.isPrimary });
    setModalType('edit');
  };

  const openDelete = (link: HomeLink) => {
    setCurrentLink(link);
    setModalType('delete');
  };

  const openHeroEdit = () => {
    setTempHeroImage(heroImage);
    setModalType('hero');
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      const newLink = { id: Date.now().toString(), ...formData };
      saveLinks([...links, newLink]);
    } else if (modalType === 'edit' && currentLink) {
      saveLinks(links.map(l => l.id === currentLink.id ? { ...l, ...formData } : l));
    } else if (modalType === 'hero') {
      updateHeroImage(tempHeroImage);
    }
    setModalType(null);
  };

  const handleDeleteSubmit = () => {
    if (currentLink) {
      saveLinks(links.filter(l => l.id !== currentLink.id));
    }
    setModalType(null);
  };

  const primaryLinks = links.filter(l => l.isPrimary);
  const socialLinks = links.filter(l => !l.isPrimary);

  // Animation variants for staggered entrance
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

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -6, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    },
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={containerVariants}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 gap-8 sm:gap-12 relative"
      id="home"
    >
      <motion.div variants={avatarVariants} className="relative group">
        <NeuContainer className="p-1 w-36 h-36 sm:w-48 sm:h-48 overflow-hidden flex items-center justify-center rounded-full">
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover rounded-full"
          />
        </NeuContainer>
        {isOwner && (
          <button 
            onClick={openHeroEdit}
            className="absolute bottom-2 right-2 p-3 bg-[var(--bg-color)] text-[var(--text-color)] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10"
          >
            <Camera size={20} />
          </button>
        )}
      </motion.div>

      <div className="flex flex-col items-center gap-6 text-center z-10 w-full max-w-md">
        <motion.h1 variants={textVariants} className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-color)]">
          {homeText.title}
        </motion.h1>
        <motion.p variants={textVariants} className="text-lg opacity-70 text-[var(--text-color)]">
          {homeText.subtitle}
        </motion.p>

        <div className="flex flex-col gap-4 mt-4 w-full items-center">
          {primaryLinks.map((link) => (
            <motion.div 
              key={link.id} 
              variants={buttonVariants}
              className="relative group flex items-center justify-center"
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <NeuContainer shape="flat" className="px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 text-[var(--text-color)] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer rounded-full text-sm">
                  {link.icon && renderIcon(link.icon, link.url, 18)}
                  {link.label}
                </NeuContainer>
              </a>
              {isOwner && (
                <div className="absolute -right-16 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(link)} className="p-2 text-[var(--text-color)] hover:scale-110"><Edit2 size={16}/></button>
                  <button onClick={() => openDelete(link)} className="p-2 text-red-500 hover:scale-110"><Trash2 size={16}/></button>
                </div>
              )}
            </motion.div>
          ))}
          {isOwner && (
            <button onClick={() => openAdd(true)} className="flex items-center gap-2 text-[var(--text-color)] opacity-50 hover:opacity-100 text-sm mt-2">
              <Plus size={16}/> Add Primary Button
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {socialLinks.map((link) => {
              const platform = getPlatformInfo(link.url);
              return (
                <motion.div
                  key={link.id}
                  variants={buttonVariants}
                  className="relative group"
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <NeuContainer shape="flat" className="px-4 py-2.5 flex items-center gap-2.5 text-[var(--text-color)] font-semibold text-sm transition-all hover:scale-105 active:scale-95 rounded-full cursor-pointer">
                      {link.icon ? (
                        link.icon.startsWith('data:') || link.icon.startsWith('http') ? (
                          <img src={link.icon} alt={platform.label} className="w-5 h-5 rounded-sm object-contain" />
                        ) : (
                          <>
                            {platform.faviconUrl && <img src={platform.faviconUrl} alt={platform.label} className="w-5 h-5 rounded-sm object-contain" />}
                            {!platform.faviconUrl && renderIcon(link.icon, link.url, 18)}
                          </>
                        )
                      ) : platform.faviconUrl ? (
                        <img src={platform.faviconUrl} alt={platform.label} className="w-5 h-5 rounded-sm object-contain" />
                      ) : (
                        <ExternalLink size={18} />
                      )}
                      {platform.label}
                    </NeuContainer>
                  </a>
                  {isOwner && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-color)] rounded-lg p-1 shadow-lg z-20">
                      <button onClick={() => openEdit(link)} className="p-1 text-[var(--text-color)] hover:scale-110"><Edit2 size={14}/></button>
                      <button onClick={() => openDelete(link)} className="p-1 text-red-500 hover:scale-110"><Trash2 size={14}/></button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          {isOwner && (
            <button onClick={() => openAdd(false)} className="flex items-center gap-2 text-[var(--text-color)] opacity-50 hover:opacity-100 text-sm">
              <Plus size={16}/> Add Social Link
            </button>
          )}
        </div>
      </div>

      <Modal isOpen={modalType === 'add' || modalType === 'edit'} onClose={() => setModalType(null)} title={modalType === 'add' ? 'Add Link' : 'Edit Link'}>
        <div className="flex flex-col gap-4">
          {formData.isPrimary && (
            <NeuInput placeholder="Label (e.g. Donate)" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
          )}
          <NeuFileInput 
            label="Upload Logo (Optional)" 
            value={formData.icon.startsWith('data:') ? formData.icon : ''} 
            aspectRatio={1}
            onFileSelect={(base64) => setFormData({...formData, icon: base64})} 
          />
          <NeuInput placeholder="Or Icon Name (e.g. TikTok)" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
          <NeuInput placeholder="URL (e.g. https://...)" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
          <div className="flex gap-4 mt-2">
            <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
            <NeuButton className="flex-1" onClick={handleSubmit}>Save</NeuButton>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalType === 'hero'} onClose={() => setModalType(null)} title="Edit Profile Picture">
        <div className="flex flex-col gap-4">
          <NeuFileInput 
            label="Upload New Profile Picture (1:1 Ratio)" 
            value={tempHeroImage} 
            aspectRatio={1}
            onFileSelect={(base64) => setTempHeroImage(base64)} 
          />
          <div className="flex gap-4 mt-2">
            <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
            <NeuButton className="flex-1" onClick={handleSubmit}>Save</NeuButton>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalType === 'delete'} onClose={() => setModalType(null)} title="Delete Link?">
        <p className="text-center text-[var(--text-color)] mb-4">Are you sure you want to delete this link?</p>
        <div className="flex gap-4">
          <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
          <NeuButton variant="danger" className="flex-1" onClick={handleDeleteSubmit}>Delete</NeuButton>
        </div>
      </Modal>

    </motion.section>
  );
}
