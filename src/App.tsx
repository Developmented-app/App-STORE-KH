/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, ShieldCheck, Heart, Sparkles, LogOut, Info, AlertCircle,
  ShoppingBag, Star, HelpCircle, CheckCircle2, ChevronRight, Download, Sun, Moon
} from 'lucide-react';
import { AppItem, Review, ActiveDownload, UserWallet, PaymentCard } from './types';
import { INITIAL_APPS } from './data';
import Dashboard from './components/Dashboard';
import AppDetails from './components/AppDetails';
import PaymentGateway from './components/PaymentGateway';
import PhoneSimulator from './components/PhoneSimulator';

// Local storage keys
const APPS_STORAGE_KEY = 'neoappstore_catalog_v1';
const WALLET_STORAGE_KEY = 'neoappstore_wallet_v1';

export default function App() {
  // Application Catalog State
  const [apps, setApps] = useState<AppItem[]>([]);
  const [activeApp, setActiveApp] = useState<AppItem | null>(null);

  // Filters State
  const [activeCategory, setActiveCategory] = useState<'All' | AppItem['category'] | 'Wishlist'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('neoappstore_wishlist_v1');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Downloading Progress state
  const [downloadingApps, setDownloadingApps] = useState<{ [key: string]: ActiveDownload }>({});

  // Active user payment checkout overlay
  const [checkoutApp, setCheckoutApp] = useState<AppItem | null>(null);

  // Active Emulator runtime overlay
  const [runningAppId, setRunningAppId] = useState<string | null>(null);

  // Toast notification system
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Wallet and device inventory
  const [wallet, setWallet] = useState<UserWallet>({
    balance: 10000, // starting simulated balance
    purchaseHistory: ['zen-clicker', 'calclite', 'bytenote'], // free apps pre-purchased
    downloadedHistory: [],
    paymentCards: [
      {
        id: 'default-card',
        cardholderName: 'Maisie Clarke',
        cardNumber: '•••• •••• •••• 4242',
        expiryDate: '12/28',
        cardType: 'Visa'
      }
    ]
  });

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('neoappstore_theme_v1') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('neoappstore_theme_v1', theme);
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // User details from environment metadata
  const userEmail = 'maisieclarke506@gmail.com';
  const userName = 'Maisie Clarke';

  // 1. Initialize data from localstorage or static data
  useEffect(() => {
    const cachedCatalog = localStorage.getItem(APPS_STORAGE_KEY);
    const cachedWallet = localStorage.getItem(WALLET_STORAGE_KEY);

    let currentApps = INITIAL_APPS;
    if (cachedCatalog) {
      try {
        currentApps = JSON.parse(cachedCatalog);
        setApps(currentApps);
      } catch (err) {
        setApps(INITIAL_APPS);
      }
    } else {
      setApps(INITIAL_APPS);
    }

    if (cachedWallet) {
      try {
        setWallet(JSON.parse(cachedWallet));
      } catch (err) {
        // use default wallet state
      }
    }

    // Auto-load app details if direct URL parameter present
    const params = new URLSearchParams(window.location.search);
    const appIdFromUrl = params.get('app');
    if (appIdFromUrl) {
      const match = currentApps.find(a => a.id === appIdFromUrl);
      if (match) {
        setActiveApp(match);
      }
    }
  }, []);

  // Save changes to localStorage on updates
  useEffect(() => {
    if (apps.length > 0) {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
    }
  }, [apps]);

  useEffect(() => {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('neoappstore_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  // Synchronize detailed app view with latest reviews
  useEffect(() => {
    if (activeApp) {
      const latestApp = apps.find(a => a.id === activeApp.id);
      if (latestApp) {
        setActiveApp(latestApp);
      }
    }
  }, [apps]);

  // Synchronize browser URL query parameters dynamically with activeApp selection
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeApp) {
      url.searchParams.set('app', activeApp.id);
    } else {
      url.searchParams.delete('app');
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeApp]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 2. Download Simulation Manager
  const handleDownloadTrigger = (appId: string) => {
    // If already downloading, do nothing
    if (downloadingApps[appId]) return;

    // Check if purchased
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    const isPurchased = !app.isPremium || wallet.purchaseHistory.includes(appId);
    if (!isPurchased) {
      showToast(`License registration required to download ${app.name}`, 'error');
      setCheckoutApp(app);
      return;
    }

    // Set download metadata
    setDownloadingApps(prev => ({
      ...prev,
      [appId]: {
        appId,
        progress: 0,
        speed: 'Connecting...',
        status: 'downloading'
      }
    }));

    showToast(`Initializing download: ${app.name}`);
  };

  // Simulated download progress timer
  useEffect(() => {
    const activeIds = Object.keys(downloadingApps).filter(id => downloadingApps[id].status === 'downloading');
    if (activeIds.length === 0) return;

    const interval = setInterval(() => {
      setDownloadingApps(prev => {
        const copy = { ...prev };
        let updated = false;

        activeIds.forEach(id => {
          const current = copy[id];
          if (current && current.progress < 100) {
            updated = true;
            const step = Math.floor(Math.random() * 12) + 6; // random progress step
            const nextProgress = Math.min(100, current.progress + step);
            const nextSpeed = (Math.random() * 4 + 2).toFixed(1) + ' MB/s';

            if (nextProgress === 100) {
              // Mark as fully downloaded in user library!
              setWallet(w => {
                if (!w.downloadedHistory.includes(id)) {
                  return {
                    ...w,
                    downloadedHistory: [...w.downloadedHistory, id]
                  };
                }
                return w;
              });

              const appName = apps.find(a => a.id === id)?.name || 'Application';
              showToast(`Installed successfully: ${appName}`, 'success');

              // Set status to completed in the downloads queue
              copy[id] = {
                ...current,
                progress: 100,
                speed: 'Completed',
                status: 'completed'
              };
            } else {
              copy[id] = {
                ...current,
                progress: nextProgress,
                speed: nextSpeed
              };
            }
          }
        });

        return updated ? copy : prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [downloadingApps, apps]);

  // 3. Purchase & Payment Gateways
  const handleCheckoutInitiation = (app: AppItem) => {
    // Check if already purchased
    if (wallet.purchaseHistory.includes(app.id)) {
      showToast(`You already own a license for ${app.name}`, 'info');
      return;
    }
    setCheckoutApp(app);
  };

  const handlePaymentSuccess = (appId: string) => {
    setWallet(w => {
      if (!w.purchaseHistory.includes(appId)) {
        return {
          ...w,
          purchaseHistory: [...w.purchaseHistory, appId]
        };
      }
      return w;
    });

    const appName = apps.find(a => a.id === appId)?.name || 'App';
    showToast(`Purchase Authorized: License token created for ${appName}`, 'success');
    setCheckoutApp(null);

    // Auto trigger download once purchased!
    setTimeout(() => {
      handleDownloadTrigger(appId);
    }, 400);
  };

  // 4. Custom Review & Rating Registration
  const handleAddReview = (appId: string, newReview: Review) => {
    setApps(prevApps => {
      const updated = prevApps.map(app => {
        if (app.id === appId) {
          const updatedReviews = [newReview, ...app.reviews];
          // Recalculate average star score
          const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
          const avg = Number((sum / updatedReviews.length).toFixed(1));
          return {
            ...app,
            reviews: updatedReviews,
            rating: avg
          };
        }
        return app;
      });
      return updated;
    });
    showToast('Review submitted successfully!');
  };

  // Add card utility
  const handleAddCard = (newCard: PaymentCard) => {
    setWallet(w => ({
      ...w,
      paymentCards: [newCard, ...w.paymentCards]
    }));
    showToast(`Linked payment card successfully!`, 'success');
  };

  const handleToggleWishlist = (appId: string) => {
    setWishlist(prev => {
      const isAdded = prev.includes(appId);
      let next;
      if (isAdded) {
        next = prev.filter(id => id !== appId);
        showToast('Removed from Wishlist', 'info');
      } else {
        next = [...prev, appId];
        showToast('Added to Wishlist', 'success');
      }
      return next;
    });
  };

  // Get active running app name
  const runningAppName = apps.find(a => a.id === runningAppId)?.name || '';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* GLOBAL TOAST ELEMENT */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border shadow-2xl flex items-center gap-2.5 max-w-sm bg-zinc-900 border-zinc-800 animate-slide-in">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          )}
          <span className="text-xs font-semibold text-zinc-200">{toast.message}</span>
        </div>
      )}

      {/* HEADER BAR BRANDING */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 border-b border-zinc-900/60 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveApp(null); setRunningAppId(null); }}>
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Neo-Slate Store</span>
              <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-medium tracking-wide">
                SANDBOX v2.4
              </span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-medium">Downloading & Launching Real-Time Mini Apps</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              const newTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(newTheme);
              showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
            }}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 transition active:scale-95 cursor-pointer flex items-center justify-center shadow-sm"
            aria-label="Toggle theme preference"
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-indigo-400" />
            )}
          </button>

          {/* User Session Metadata Info */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-zinc-200 block leading-tight">{userName}</span>
              <span className="text-[9px] text-zinc-500 font-mono block">{userEmail}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs border border-zinc-800 text-white">
              MC
            </div>
          </div>
        </div>
      </header>

      {/* COMPANION MAIN WRAPPER */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {runningAppId ? (
          /* ACTIVE PHONE SIMULATOR EMULATOR DISPLAY */
          <div className="py-6 flex flex-col items-center justify-center space-y-6">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center text-xs text-zinc-400">
              <span className="text-indigo-400 font-semibold uppercase tracking-wider block mb-1">Interactive Sandbox Sandbox Active</span>
              You are running <b className="text-white">"{runningAppName}"</b> inside the isolated smartphone simulator container. Try tapping the interactive features!
            </div>
            
            <PhoneSimulator 
              appId={runningAppId} 
              appName={runningAppName} 
              onClose={() => setRunningAppId(null)} 
            />
          </div>
        ) : activeApp ? (
          /* DETAILED APP VIEW SCREEN */
          <AppDetails 
            app={activeApp}
            downloadStatus={downloadingApps[activeApp.id] || null}
            isPurchased={!activeApp.isPremium || wallet.purchaseHistory.includes(activeApp.id)}
            isDownloaded={wallet.downloadedHistory.includes(activeApp.id)}
            userEmail={userEmail}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onBack={() => setActiveApp(null)}
            onDownload={handleDownloadTrigger}
            onLaunch={setRunningAppId}
            onBuy={handleCheckoutInitiation}
            onAddReview={handleAddReview}
          />
        ) : (
          /* DEFAULT MAIN APP CATALOG DASHBOARD */
          <Dashboard 
            apps={apps}
            wallet={wallet}
            downloadingApps={downloadingApps}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            wishlist={wishlist}
            onSelectApp={setActiveApp}
            onCategoryChange={setActiveCategory}
            onSearchChange={setSearchQuery}
            onDownload={handleDownloadTrigger}
            onLaunch={setRunningAppId}
            onBuy={handleCheckoutInitiation}
            onAddCard={handleAddCard}
          />
        )}
      </main>

      {/* FOOTER METADATA */}
      <footer className="mt-20 border-t border-zinc-900/60 py-8 px-6 text-center text-zinc-600 text-[11px] font-mono tracking-wider space-y-2 max-w-7xl mx-auto">
        <div className="flex justify-center items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
          <span>NEO-SLATE HIGH-FIDELITY APP EMULATOR NETWORK</span>
        </div>
        <p>No actual funds or production API tokens are written. All review transactions and ledger logs are verified locally.</p>
        <p>© 2026 Google AI Studio Build Applet. All services sandbox initialized.</p>
      </footer>

      {/* CHECKOUT PAYMENT GATEWAY OVERLAY MODAL */}
      {checkoutApp && (
        <PaymentGateway 
          app={checkoutApp} 
          onPaymentSuccess={handlePaymentSuccess} 
          onCancel={() => setCheckoutApp(null)} 
        />
      )}
    </div>
  );
}
