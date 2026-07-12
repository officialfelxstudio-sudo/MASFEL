import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { db } from '../utils/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

export default function SyncStatus() {
  const { lastSyncTime, isLoading } = useData();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [timeSinceSync, setTimeSinceSync] = useState('');

  useEffect(() => {
    const docRef = doc(db, 'app_data', 'about');
    const unsub = onSnapshot(docRef, () => {
      setIsConnected(true);
    }, (error) => {
      console.error('[SyncStatus] Connection lost:', error);
      setIsConnected(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - lastSyncTime) / 1000);
      if (diff < 5) setTimeSinceSync('Just now');
      else if (diff < 60) setTimeSinceSync(`${diff}s ago`);
      else if (diff < 3600) setTimeSinceSync(`${Math.floor(diff / 60)}m ago`);
      else setTimeSinceSync(`${Math.floor(diff / 3600)}h ago`);
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  const getStatusColor = () => {
    if (isLoading) return 'text-yellow-500';
    if (isConnected === false) return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw size={10} className="animate-spin" />;
    if (isConnected === false) return <WifiOff size={10} />;
    return <Wifi size={10} />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Connecting...';
    if (isConnected === false) return 'Offline';
    return `Synced ${timeSinceSync}`;
  };

  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${getStatusColor()}`}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}
