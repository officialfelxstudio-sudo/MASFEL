import React, { useState, useEffect } from 'react';
import { useNeu, NeuShape } from '../contexts/NeuContext';
import { useAuth } from '../contexts/AuthContext';
import { NeuContainer } from './NeuContainer';
import { 
  Settings, 
  X, 
  LogOut, 
  Sun, 
  Moon, 
  Save, 
  Check, 
  Paintbrush, 
  FileText, 
  Home, 
  Info, 
  Image, 
  ShoppingBag, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { 
  db, 
  HomeText, 
  AboutData, 
  GalleryItem, 
  StoreItem, 
  SponsorItem,
  CustomTexts
} from '../utils/db';
import { 
  saveNeuConfig,
  subscribeToHomeText,
  saveHomeText,
  subscribeToAbout,
  saveAbout,
  subscribeToGallery,
  saveGallery,
  subscribeToStore,
  saveStore,
  subscribeToSponsors,
  saveSponsors,
  subscribeToCustomTexts,
  saveCustomTexts
} from '../utils/firebase';

export default function AdminPanel() {
  const { config, updateConfig } = useNeu();
  const { isOwner, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'content'>('design');
  const [activeSection, setActiveSection] = useState<'titles' | 'home' | 'about' | 'gallery' | 'store' | 'sponsors' | null>('titles');

  // Content States
  const [homeText, setHomeText] = useState<HomeText>(db.getHomeText());
  const [customTexts, setCustomTexts] = useState<CustomTexts>(db.getCustomTexts());
  const [aboutData, setAboutData] = useState<AboutData>(db.getAbout());
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(db.getGallery());
  const [storeItems, setStoreItems] = useState<StoreItem[]>(db.getStore());
  const [sponsorItems, setSponsorItems] = useState<SponsorItem[]>(db.getSponsors());

  // Real-time synchronization
  useEffect(() => {
    if (!isOwner) return;

    const unsubHomeText = subscribeToHomeText((data) => {
      if (data) setHomeText(data);
    });
    const unsubCustomTexts = subscribeToCustomTexts((data) => {
      if (data) setCustomTexts(data);
    });
    const unsubAbout = subscribeToAbout((data) => {
      if (data) setAboutData(data);
    });
    const unsubGallery = subscribeToGallery((data) => {
      if (data) setGalleryItems(data);
    });
    const unsubStore = subscribeToStore((data) => {
      if (data) setStoreItems(data);
    });
    const unsubSponsors = subscribeToSponsors((data) => {
      if (data) setSponsorItems(data);
    });

    return () => {
      unsubHomeText();
      unsubCustomTexts();
      unsubAbout();
      unsubGallery();
      unsubStore();
      unsubSponsors();
    };
  }, [isOwner]);

  if (!isOwner) return null;

  // Save Handlers
  const handleSaveHomeText = async (updated: HomeText) => {
    setHomeText(updated);
    db.setHomeText(updated);
    await saveHomeText(updated);
  };

  const handleSaveCustomTexts = async (updated: CustomTexts) => {
    setCustomTexts(updated);
    db.setCustomTexts(updated);
    await saveCustomTexts(updated);
  };

  const handleSaveAbout = async (updated: AboutData) => {
    setAboutData(updated);
    db.setAbout(updated);
    await saveAbout(updated);
  };

  const handleSaveGallery = async (updated: GalleryItem[]) => {
    setGalleryItems(updated);
    db.setGallery(updated);
    await saveGallery(updated);
  };

  const handleSaveStore = async (updated: StoreItem[]) => {
    setStoreItems(updated);
    db.setStore(updated);
    await saveStore(updated);
  };

  const handleSaveSponsors = async (updated: SponsorItem[]) => {
    setSponsorItems(updated);
    db.setSponsors(updated);
    await saveSponsors(updated);
  };

  const handleSaveConfig = async () => {
    try {
      await saveNeuConfig(config);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full text-[var(--text-color)] transition-transform hover:scale-105"
        style={{
          background: 'var(--bg-color)',
          boxShadow: `5px 5px 10px var(--neu-shadow-dark), -5px -5px 10px var(--neu-shadow-light)`
        }}
      >
        <Settings size={24} />
      </button>
    );
  }

  const shapes: NeuShape[] = ['flat', 'concave', 'convex', 'pressed'];

  return (
    <div className="fixed top-0 right-0 h-screen w-80 sm:w-96 z-[100] p-2 sm:p-4 flex flex-col transition-all">
      <NeuContainer shape="flat" className="flex-1 flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between text-[var(--text-color)]">
          <h2 className="font-black text-lg flex items-center gap-2 tracking-tight">
            <Settings size={20} /> Admin Dashboard
          </h2>
          <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('design')}
            className={`flex-1 p-2 flex items-center justify-center gap-2 rounded-lg transition-all text-xs font-bold ${activeTab === 'design' ? 'opacity-100' : 'opacity-50'}`}
            style={{
              boxShadow: activeTab === 'design' ? `inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light)` : `3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)`
            }}
          >
            <Paintbrush size={14} /> Design
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 p-2 flex items-center justify-center gap-2 rounded-lg transition-all text-xs font-bold ${activeTab === 'content' ? 'opacity-100' : 'opacity-50'}`}
            style={{
              boxShadow: activeTab === 'content' ? `inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light)` : `3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)`
            }}
          >
            <FileText size={14} /> Content
          </button>
        </div>

        {/* Tab 1: Design Editor */}
        {activeTab === 'design' && (
          <div className="flex flex-col gap-5 text-sm text-[var(--text-color)] overflow-y-auto flex-1 pr-1 pb-4">
            <div className="flex flex-col gap-2">
              <label className="flex justify-between font-bold text-xs opacity-80">Theme <span>{config.isDark ? 'Dark' : 'Bright'}</span></label>
              <div className="flex gap-2">
                <button 
                  onClick={() => updateConfig({ isDark: false })}
                  className={`flex-1 p-2 flex items-center justify-center gap-2 rounded-lg transition-all ${!config.isDark ? 'opacity-100 font-bold' : 'opacity-50'}`}
                  style={{
                    boxShadow: !config.isDark ? `inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light)` : `3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)`
                  }}
                >
                  <Sun size={14} /> Bright
                </button>
                <button 
                  onClick={() => updateConfig({ isDark: true })}
                  className={`flex-1 p-2 flex items-center justify-center gap-2 rounded-lg transition-all ${config.isDark ? 'opacity-100 font-bold' : 'opacity-50'}`}
                  style={{
                    boxShadow: config.isDark ? `inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light)` : `3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)`
                  }}
                >
                  <Moon size={14} /> Dark
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex justify-between font-bold text-xs opacity-80">Radius <span>{config.radius}px</span></label>
              <input 
                type="range" min="0" max="100" value={config.radius} 
                onChange={(e) => updateConfig({ radius: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex justify-between font-bold text-xs opacity-80">Distance <span>{config.distance}px</span></label>
              <input 
                type="range" min="1" max="50" value={config.distance} 
                onChange={(e) => updateConfig({ distance: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex justify-between font-bold text-xs opacity-80">Blur <span>{config.blur}px</span></label>
              <input 
                type="range" min="0" max="100" value={config.blur} 
                onChange={(e) => updateConfig({ blur: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="flex justify-between font-bold text-xs opacity-80">Intensity <span>{(config.intensity * 100).toFixed(0)}%</span></label>
              <input 
                type="range" min="0.01" max="0.5" step="0.01" value={config.intensity} 
                onChange={(e) => updateConfig({ intensity: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-xs opacity-80">Shape</label>
              <div className="grid grid-cols-2 gap-2">
                {shapes.map(s => (
                  <button
                    key={s}
                    onClick={() => updateConfig({ shape: s })}
                    className={`p-2 rounded-lg capitalize transition-all text-xs ${config.shape === s ? 'font-bold' : 'opacity-70'}`}
                    style={{
                      boxShadow: config.shape === s ? `inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)` : `2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)`
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSaveConfig}
              className={`mt-4 p-3 flex items-center justify-center gap-2 rounded-xl transition-all font-bold text-xs hover:scale-[1.02] ${isSaved ? "text-green-500" : "text-[var(--text-color)]"}`}
              style={{
                boxShadow: `3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)`
              }}
            >
              {isSaved ? <Check size={14} /> : <Save size={14} />} 
              {isSaved ? "Saved" : "Save Config Changes"}
            </button>
          </div>
        )}

        {/* Tab 2: Content Editor */}
        {activeTab === 'content' && (
          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1 pb-4">
            
            {/* 2.0 GLOBAL TITLES & LABELS */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'titles' ? null : 'titles')}
                className="w-full p-2.5 flex items-center justify-between rounded-lg font-bold text-xs text-[var(--text-color)]"
                style={{
                  boxShadow: `2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)`
                }}
              >
                <span className="flex items-center gap-2"><FileText size={14} /> Section Titles & Labels</span>
                {activeSection === 'titles' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {activeSection === 'titles' && (
                <div className="p-3 flex flex-col gap-3 rounded-lg text-xs"
                  style={{ boxShadow: 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)' }}
                >
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">About Section Title</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={customTexts.aboutTitle}
                      onChange={(e) => handleSaveCustomTexts({ ...customTexts, aboutTitle: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Gallery Section Title</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={customTexts.galleryTitle}
                      onChange={(e) => handleSaveCustomTexts({ ...customTexts, galleryTitle: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Store Section Title</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={customTexts.storeTitle}
                      onChange={(e) => handleSaveCustomTexts({ ...customTexts, storeTitle: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Store Purchase Button Text</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={customTexts.buyNowLabel}
                      onChange={(e) => handleSaveCustomTexts({ ...customTexts, buyNowLabel: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Sponsor Section Title</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={customTexts.sponsorTitle}
                      onChange={(e) => handleSaveCustomTexts({ ...customTexts, sponsorTitle: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2.1 HOME SECTION */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'home' ? null : 'home')}
                className="w-full p-2.5 flex items-center justify-between rounded-lg font-bold text-xs text-[var(--text-color)]"
                style={{
                  boxShadow: `2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)`
                }}
              >
                <span className="flex items-center gap-2"><Home size={14} /> Home Section</span>
                {activeSection === 'home' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {activeSection === 'home' && (
                <div className="p-3 flex flex-col gap-3 rounded-lg text-xs"
                  style={{ boxShadow: 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)' }}
                >
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Title / Name</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={homeText.title}
                      onChange={(e) => handleSaveHomeText({ ...homeText, title: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Subtitle / Bio</label>
                    <textarea 
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none h-20 resize-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={homeText.subtitle}
                      onChange={(e) => handleSaveHomeText({ ...homeText, subtitle: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2.2 ABOUT SECTION */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'about' ? null : 'about')}
                className="w-full p-2.5 flex items-center justify-between rounded-lg font-bold text-xs text-[var(--text-color)]"
                style={{
                  boxShadow: `2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)`
                }}
              >
                <span className="flex items-center gap-2"><Info size={14} /> About Section</span>
                {activeSection === 'about' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {activeSection === 'about' && (
                <div className="p-3 flex flex-col gap-3 rounded-lg text-xs"
                  style={{ boxShadow: 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)' }}
                >
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">About Narrative Text</label>
                    <textarea 
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none h-28 resize-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={aboutData.text}
                      onChange={(e) => handleSaveAbout({ ...aboutData, text: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Button Label</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={aboutData.buttonLabel}
                      onChange={(e) => handleSaveAbout({ ...aboutData, buttonLabel: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Button URL</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={aboutData.buttonUrl}
                      onChange={(e) => handleSaveAbout({ ...aboutData, buttonUrl: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold opacity-70">Button Icon</label>
                    <input 
                      type="text"
                      className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-2 rounded-md focus:outline-none"
                      style={{ boxShadow: 'inset 1px 1px 3px var(--neu-shadow-dark), inset -1px -1px 3px var(--neu-shadow-light)' }}
                      value={aboutData.buttonIcon}
                      onChange={(e) => handleSaveAbout({ ...aboutData, buttonIcon: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2.3 GALLERY SECTION */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'gallery' ? null : 'gallery')}
                className="w-full p-2.5 flex items-center justify-between rounded-lg font-bold text-xs text-[var(--text-color)]"
                style={{
                  boxShadow: `2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)`
                }}
              >
                <span className="flex items-center gap-2"><Image size={14} /> Gallery Items</span>
                {activeSection === 'gallery' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {activeSection === 'gallery' && (
                <div className="p-3 flex flex-col gap-4 rounded-lg text-xs"
                  style={{ boxShadow: 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)' }}
                >
                  {galleryItems.map((item, idx) => (
                    <div key={item.id} className="p-2.5 flex flex-col gap-2 rounded-md text-[var(--text-color)]"
                      style={{ boxShadow: '1px 1px 3px var(--neu-shadow-dark), -1px -1px 3px var(--neu-shadow-light)' }}
                    >
                      <div className="flex items-center justify-between font-bold opacity-80 border-b border-dashed border-[var(--text-color)] pb-1 mb-1">
                        <span>Image #{idx + 1}</span>
                        <button 
                          onClick={() => {
                            const updated = galleryItems.filter(i => i.id !== item.id);
                            handleSaveGallery(updated);
                          }}
                          className="text-red-500 hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Title</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.title || ''}
                          onChange={(e) => {
                            const updated = galleryItems.map(i => i.id === item.id ? { ...i, title: e.target.value } : i);
                            handleSaveGallery(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Description</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.desc || ''}
                          onChange={(e) => {
                            const updated = galleryItems.map(i => i.id === item.id ? { ...i, desc: e.target.value } : i);
                            handleSaveGallery(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Image URL / Base64</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none truncate"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.url}
                          onChange={(e) => {
                            const updated = galleryItems.map(i => i.id === item.id ? { ...i, url: e.target.value } : i);
                            handleSaveGallery(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newItem: GalleryItem = {
                        id: Date.now().toString(),
                        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
                        title: 'New Gallery Item',
                        desc: 'Add a description'
                      };
                      handleSaveGallery([...galleryItems, newItem]);
                    }}
                    className="w-full p-2 flex items-center justify-center gap-1.5 rounded-md font-bold text-[11px] text-[var(--text-color)]"
                    style={{ boxShadow: '2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)' }}
                  >
                    <Plus size={12} /> Add Gallery Item
                  </button>
                </div>
              )}
            </div>

            {/* 2.4 STORE SECTION */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'store' ? null : 'store')}
                className="w-full p-2.5 flex items-center justify-between rounded-lg font-bold text-xs text-[var(--text-color)]"
                style={{
                  boxShadow: `2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)`
                }}
              >
                <span className="flex items-center gap-2"><ShoppingBag size={14} /> Store Products</span>
                {activeSection === 'store' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {activeSection === 'store' && (
                <div className="p-3 flex flex-col gap-4 rounded-lg text-xs"
                  style={{ boxShadow: 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)' }}
                >
                  {storeItems.map((item, idx) => (
                    <div key={item.id} className="p-2.5 flex flex-col gap-2 rounded-md text-[var(--text-color)]"
                      style={{ boxShadow: '1px 1px 3px var(--neu-shadow-dark), -1px -1px 3px var(--neu-shadow-light)' }}
                    >
                      <div className="flex items-center justify-between font-bold opacity-80 border-b border-dashed border-[var(--text-color)] pb-1 mb-1">
                        <span>Product #{idx + 1}</span>
                        <button 
                          onClick={() => {
                            const updated = storeItems.filter(i => i.id !== item.id);
                            handleSaveStore(updated);
                          }}
                          className="text-red-500 hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Title</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.title}
                          onChange={(e) => {
                            const updated = storeItems.map(i => i.id === item.id ? { ...i, title: e.target.value } : i);
                            handleSaveStore(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Description</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.desc}
                          onChange={(e) => {
                            const updated = storeItems.map(i => i.id === item.id ? { ...i, desc: e.target.value } : i);
                            handleSaveStore(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Button Link (URL)</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.link}
                          onChange={(e) => {
                            const updated = storeItems.map(i => i.id === item.id ? { ...i, link: e.target.value } : i);
                            handleSaveStore(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Image URL / Base64</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none truncate"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.image}
                          onChange={(e) => {
                            const updated = storeItems.map(i => i.id === item.id ? { ...i, image: e.target.value } : i);
                            handleSaveStore(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newItem: StoreItem = {
                        id: Date.now().toString(),
                        title: 'New Product',
                        desc: 'Product description',
                        link: 'https://example.com',
                        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
                      };
                      handleSaveStore([...storeItems, newItem]);
                    }}
                    className="w-full p-2 flex items-center justify-center gap-1.5 rounded-md font-bold text-[11px] text-[var(--text-color)]"
                    style={{ boxShadow: '2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)' }}
                  >
                    <Plus size={12} /> Add Product
                  </button>
                </div>
              )}
            </div>

            {/* 2.5 SPONSORS SECTION */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'sponsors' ? null : 'sponsors')}
                className="w-full p-2.5 flex items-center justify-between rounded-lg font-bold text-xs text-[var(--text-color)]"
                style={{
                  boxShadow: `2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)`
                }}
              >
                <span className="flex items-center gap-2"><Award size={14} /> Sponsors</span>
                {activeSection === 'sponsors' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {activeSection === 'sponsors' && (
                <div className="p-3 flex flex-col gap-4 rounded-lg text-xs"
                  style={{ boxShadow: 'inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light)' }}
                >
                  {sponsorItems.map((item, idx) => (
                    <div key={item.id} className="p-2.5 flex flex-col gap-2 rounded-md text-[var(--text-color)]"
                      style={{ boxShadow: '1px 1px 3px var(--neu-shadow-dark), -1px -1px 3px var(--neu-shadow-light)' }}
                    >
                      <div className="flex items-center justify-between font-bold opacity-80 border-b border-dashed border-[var(--text-color)] pb-1 mb-1">
                        <span>Sponsor #{idx + 1}</span>
                        <button 
                          onClick={() => {
                            const updated = sponsorItems.filter(i => i.id !== item.id);
                            handleSaveSponsors(updated);
                          }}
                          className="text-red-500 hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Name</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.name}
                          onChange={(e) => {
                            const updated = sponsorItems.map(i => i.id === item.id ? { ...i, name: e.target.value } : i);
                            handleSaveSponsors(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="opacity-70 text-[10px]">Logo URL / Base64</label>
                        <input 
                          type="text"
                          className="w-full bg-[var(--bg-color)] text-[var(--text-color)] p-1.5 rounded focus:outline-none truncate"
                          style={{ boxShadow: 'inset 1px 1px 2px var(--neu-shadow-dark), inset -1px -1px 2px var(--neu-shadow-light)' }}
                          value={item.url}
                          onChange={(e) => {
                            const updated = sponsorItems.map(i => i.id === item.id ? { ...i, url: e.target.value } : i);
                            handleSaveSponsors(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newItem: SponsorItem = {
                        id: Date.now().toString(),
                        name: 'New Sponsor',
                        url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop'
                      };
                      handleSaveSponsors([...sponsorItems, newItem]);
                    }}
                    className="w-full p-2 flex items-center justify-center gap-1.5 rounded-md font-bold text-[11px] text-[var(--text-color)]"
                    style={{ boxShadow: '2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)' }}
                  >
                    <Plus size={12} /> Add Sponsor
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer actions */}
        <button 
          onClick={logout}
          className="p-3 flex items-center justify-center gap-2 rounded-xl text-red-500 transition-all font-bold text-xs hover:scale-[1.02] mt-auto"
          style={{
            boxShadow: `3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light)`
          }}
        >
          <LogOut size={14} /> Logout
        </button>
      </NeuContainer>
    </div>
  );
}
