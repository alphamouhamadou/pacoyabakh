'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function useLocalStorage(key: string, initialValue: boolean) {
  const [storedValue, setStoredValue] = useState<boolean>(() => {
    if (typeof window === 'undefined') return initialValue;
    return localStorage.getItem(key) !== null;
  });

  const setValue = useCallback((value: boolean) => {
    setStoredValue(value);
    if (value) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
  }, [key]);

  return [storedValue, setValue] as const;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useLocalStorage('pwa-install-dismissed', false);
  const promptTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      promptTimeoutRef.current = setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (promptTimeoutRef.current) clearTimeout(promptTimeoutRef.current);
    };
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
  };

  if (!showPrompt || dismissed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-[#1a1a20] border border-neutral-700 rounded-2xl p-4 shadow-2xl shadow-black/50">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <img src="/pwa-icon-192.png" alt="PacoYaBakh" className="w-10 h-10 rounded-lg" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm">
              Installer PacoYaBakh
            </h3>
            <p className="text-neutral-400 text-xs mt-1">
              Accède rapidement à nos services depuis ton écran d&apos;accueil
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Installer
              </button>
              <button
                onClick={handleDismiss}
                className="text-neutral-400 hover:text-white text-xs px-3 py-2 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
