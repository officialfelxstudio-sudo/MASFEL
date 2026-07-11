import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NeuContainer } from './NeuContainer';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { StoreItem } from '../utils/db';
import { Modal, NeuInput, NeuButton, NeuFileInput } from './Modal';
import { Trash2, Plus, Edit2, ShoppingCart } from 'lucide-react';
import { useTilt } from '../hooks/useTilt';

function StoreCard({ item, variants, isOwner, onEdit, onDelete }: {
  item: StoreItem;
  variants: any;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useLang();
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
            <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center" />
          </NeuContainer>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-2xl font-bold">{item.title}</h3>
            <p className="opacity-70 text-sm flex-1">{item.desc}</p>
          </div>
          <div className="flex gap-4">
            <a href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="flex-1">
              <NeuContainer shape="flat" className="w-full py-3 flex items-center justify-center gap-2 font-bold cursor-pointer hover:scale-105 active:scale-95 transition-transform rounded-xl">
                <ShoppingCart size={18} /> {t('buyNow')}
              </NeuContainer>
            </a>
            {isOwner && (
              <div className="flex gap-2">
                <NeuContainer shape="flat" onClick={onEdit} className="p-3 cursor-pointer hover:scale-105 rounded-xl">
                  <Edit2 size={18} />
                </NeuContainer>
                <NeuContainer shape="flat" onClick={onDelete} className="p-3 cursor-pointer hover:scale-105 text-red-500 rounded-xl">
                  <Trash2 size={18} />
                </NeuContainer>
              </div>
            )}
          </div>
        </NeuContainer>
      </div>
    </motion.div>
  );
}

export default function StoreSection() {
  const { t } = useLang();
  const { isOwner } = useAuth();
  const { storeItems: items, updateStoreItems } = useData();
  
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [currentItem, setCurrentItem] = useState<StoreItem | null>(null);
  const [formData, setFormData] = useState({ title: '', desc: '', image: '', link: '' });

  const openAdd = () => {
    setFormData({ title: '', desc: '', image: '', link: '' });
    setCurrentItem(null);
    setModalType('add');
  };

  const openEdit = (item: StoreItem) => {
    setCurrentItem(item);
    setFormData({ title: item.title, desc: item.desc, image: item.image, link: item.link });
    setModalType('edit');
  };

  const openDelete = (item: StoreItem) => {
    setCurrentItem(item);
    setModalType('delete');
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.image) return;
    
    let newItems = [...items];
    if (modalType === 'add') {
      const newItem = { id: Date.now().toString(), ...formData };
      newItems = [...items, newItem];
    } else if (modalType === 'edit' && currentItem) {
      newItems = items.map(i => i.id === currentItem.id ? { ...i, ...formData } : i);
    }
    updateStoreItems(newItems);
    setModalType(null);
  };

  const handleDeleteSubmit = () => {
    if (currentItem) {
      const newItems = items.filter(item => item.id !== currentItem.id);
      updateStoreItems(newItems);
    }
    setModalType(null);
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
      id="store"
    >
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 sm:gap-12">
        <motion.h2 variants={titleVariants} className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-color)]">
          {t('store')}
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12 w-full max-w-5xl">
          {items.map((item) => (
            <StoreCard key={item.id} item={item} variants={cardVariants} isOwner={isOwner}
              onEdit={() => openEdit(item)}
              onDelete={() => openDelete(item)}
            />
          ))}

          {isOwner && (
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -5 }} 
              className="relative w-full sm:w-[calc(50%-1rem)] max-w-sm h-full min-h-[350px]"
            >
              <NeuContainer 
                onClick={openAdd} 
                className="flex flex-col items-center justify-center p-6 rounded-3xl h-full cursor-pointer opacity-60 hover:opacity-100 transition-all border-4 border-dashed border-[var(--text-color)] text-[var(--text-color)]"
                style={{ background: 'transparent', boxShadow: 'none' }}
              >
                <Plus size={48} className="mb-4" />
                <span className="font-bold">{t('addProduct')}</span>
              </NeuContainer>
            </motion.div>
          )}
        </div>
      </div>

      <Modal isOpen={modalType === 'add' || modalType === 'edit'} onClose={() => setModalType(null)} title={modalType === 'add' ? t('addProduct') : t('edit')}>
        <div className="flex flex-col gap-4">
          <NeuFileInput 
            label="Product Image (16:9)" 
            value={formData.image} 
            aspectRatio={16/9}
            onFileSelect={(base64) => setFormData({...formData, image: base64})} 
          />
          <NeuInput placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <NeuInput placeholder="Description" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
          <NeuInput placeholder="Product Link (URL)" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
          <div className="flex gap-4 mt-2">
            <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
            <NeuButton className="flex-1" onClick={handleSubmit}>Save</NeuButton>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalType === 'delete'} onClose={() => setModalType(null)} title={t('delete') + '?'}>
        <p className="text-center text-[var(--text-color)] mb-4">Are you sure you want to delete this product?</p>
        <div className="flex gap-4">
          <NeuButton className="flex-1" onClick={() => setModalType(null)}>Cancel</NeuButton>
          <NeuButton variant="danger" className="flex-1" onClick={handleDeleteSubmit}>Delete</NeuButton>
        </div>
      </Modal>

    </motion.section>
  );
}
