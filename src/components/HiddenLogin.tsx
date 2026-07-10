import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NeuContainer } from './NeuContainer';
import { X } from 'lucide-react';

export default function HiddenLogin() {
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const { login, isOwner } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (clickCount > 0 && clickCount < 5) {
      timer = setTimeout(() => setClickCount(0), 2000);
    }
    if (clickCount >= 5) {
      setShowModal(true);
      setClickCount(0);
    }
    return () => clearTimeout(timer);
  }, [clickCount]);

  if (isOwner) return null;

  return (
    <>
      <div 
        className="fixed bottom-0 right-0 w-16 h-16 z-50 cursor-pointer"
        onClick={() => setClickCount(prev => prev + 1)}
      />

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <NeuContainer shape="flat" className="p-8 w-full max-w-sm relative flex flex-col gap-6">
            <button 
              onClick={() => { setShowModal(false); setPassword(''); setError(''); }}
              className="absolute top-4 right-4 text-[var(--text-color)] opacity-70 hover:opacity-100"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-center text-[var(--text-color)]">Owner Access</h2>
            <div className="flex flex-col gap-4">
              <NeuContainer shape="pressed" className="p-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-transparent border-none outline-none p-3 text-[var(--text-color)]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (login(password)) {
                        setShowModal(false);
                      } else {
                        setError('Invalid password');
                      }
                    }
                  }}
                />
              </NeuContainer>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                onClick={() => {
                  if (login(password)) {
                    setShowModal(false);
                  } else {
                    setError('Invalid password');
                  }
                }}
                className="py-3 px-6 rounded-xl font-medium text-[var(--text-color)] transition-opacity hover:opacity-80"
                style={{
                  background: 'var(--bg-color)',
                  boxShadow: `5px 5px 10px var(--neu-shadow-dark), -5px -5px 10px var(--neu-shadow-light)`
                }}
              >
                Login
              </button>
            </div>
          </NeuContainer>
        </div>
      )}
    </>
  );
}
