/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, Grid, Gamepad2, Calculator, Palette, TrendingUp, Notebook, 
  Download, Play, Smartphone, Wallet, ShieldCheck, Plus, Check, Award, 
  ExternalLink, Sparkles, CreditCard, X, AlertCircle
} from 'lucide-react';
import { AppItem, AppCategory, ActiveDownload, UserWallet, PaymentCard } from '../types';

interface DashboardProps {
  apps: AppItem[];
  wallet: UserWallet;
  downloadingApps: { [key: string]: ActiveDownload };
  activeCategory: AppCategory | 'All';
  searchQuery: string;
  onSelectApp: (app: AppItem) => void;
  onCategoryChange: (cat: AppCategory | 'All') => void;
  onSearchChange: (query: string) => void;
  onDownload: (appId: string) => void;
  onLaunch: (appId: string) => void;
  onBuy: (app: AppItem) => void;
  onAddCard: (card: PaymentCard) => void;
}

export default function Dashboard({
  apps,
  wallet,
  downloadingApps,
  activeCategory,
  searchQuery,
  onSelectApp,
  onCategoryChange,
  onSearchChange,
  onDownload,
  onLaunch,
  onBuy,
  onAddCard
}: DashboardProps) {
  // Card form states
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardholder, setNewCardholder] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvv, setNewCvv] = useState('');
  const [cardError, setCardError] = useState('');

  // Format new credit card (16 digits)
  const handleCardFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setNewCardNumber(formatted);
  };

  // Submit new payment card
  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError('');

    const rawNum = newCardNumber.replace(/\s/g, '');
    if (rawNum.length < 15) {
      setCardError('Card must be 15-16 digits');
      return;
    }

    if (newExpiry.length < 5) {
      setCardError('Expiry must be MM/YY');
      return;
    }

    const cardType = rawNum.startsWith('4') ? 'Visa' : rawNum.startsWith('5') ? 'Mastercard' : rawNum.startsWith('3') ? 'Amex' : 'Unknown';

    const card: PaymentCard = {
      id: 'card-' + Date.now(),
      cardholderName: newCardholder.trim() || 'Maisie Clarke',
      cardNumber: `•••• •••• •••• ${rawNum.slice(-4)}`,
      expiryDate: newExpiry,
      cardType
    };

    onAddCard(card);
    setNewCardholder('');
    setNewCardNumber('');
    setNewExpiry('');
    setNewCvv('');
    setShowAddCard(false);
  };

  // Categories helper to map icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Games': return <Gamepad2 className="w-4 h-4" />;
      case 'Productivity': return <Calculator className="w-4 h-4" />;
      case 'Creative': return <Palette className="w-4 h-4" />;
      case 'Finance': return <TrendingUp className="w-4 h-4" />;
      default: return <Notebook className="w-4 h-4" />;
    }
  };

  // Curate filtered applications
  const filteredApps = apps.filter(app => {
    const matchesCat = activeCategory === 'All' || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.developer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Curate featured app (e.g., first premium app)
  const featuredApp = apps.find(app => app.id === 'cryptotrade-sim') || apps[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT 8 COLS: APP STORES CATALOG & FILTERS */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Featured Big Hero Card */}
        {searchQuery === '' && activeCategory === 'All' && featuredApp && (
          <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800/80 p-6 sm:p-8 overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
            {/* Ambient Background Blur */}
            <div className={`absolute -right-20 -bottom-20 w-72 h-72 bg-gradient-to-tr ${featuredApp.color} opacity-20 blur-3xl pointer-events-none -z-10 transition group-hover:opacity-30`} />
            <div className="absolute top-4 right-4 text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Premium</span>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${featuredApp.color} p-0.5 flex items-center justify-center`}>
                  <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-2xl">
                    📊
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{featuredApp.name}</h3>
                  <p className="text-xs text-zinc-400">{featuredApp.tagline}</p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed pr-2">
                {featuredApp.description.slice(0, 160)}...
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectApp(featuredApp)}
                  className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition"
                >
                  <span>Explore App Specs</span>
                </button>
                <span className="text-xs text-indigo-400 font-bold font-mono">
                  License: ${featuredApp.price}
                </span>
              </div>
            </div>

            {/* Screenshots mockup previews on featured */}
            <div className="hidden md:flex flex-col gap-2 p-1 bg-zinc-950/40 border border-zinc-800/60 rounded-xl max-w-[200px] text-[10px] select-none text-zinc-400">
              <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/40">
                ⭐ {featuredApp.rating.toFixed(1)} average rating
              </div>
              <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/40">
                🔒 Verified TLS secure sandbox code
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Custom Tabs */}
          <div className="flex flex-nowrap overflow-x-auto gap-1.5 pb-1 sm:pb-0 scrollbar-none">
            {(['All', 'Games', 'Productivity', 'Creative', 'Finance'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/10' 
                    : 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                {cat !== 'All' && getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search store application..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full sm:w-60 text-xs pl-9.5 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl focus:border-indigo-500 focus:outline-none text-zinc-200 placeholder-zinc-600 transition"
            />
          </div>
        </div>

        {/* Apps Grids Layout */}
        {filteredApps.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-900/20">
            <p className="text-zinc-500 text-sm font-medium">No mobile apps match your search criteria</p>
            <span className="text-xs text-zinc-600 mt-1 block">Try selecting a different category tab or clear search query</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map(app => {
              const isPurchased = !app.isPremium || wallet.purchaseHistory.includes(app.id);
              const isDownloaded = wallet.downloadedHistory.includes(app.id);
              const downloadState = downloadingApps[app.id];

              return (
                <div 
                  key={app.id}
                  className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between group h-44 shadow-lg hover:shadow-2xl relative"
                >
                  {/* Small ambient background logo glow */}
                  <div className={`absolute right-4 top-4 w-12 h-12 bg-gradient-to-tr ${app.color} opacity-0 group-hover:opacity-[0.06] rounded-full blur-xl transition duration-500 pointer-events-none`} />

                  {/* Icon + Information header row */}
                  <div className="flex gap-4 items-start cursor-pointer" onClick={() => onSelectApp(app)}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${app.color} p-0.5 shrink-0 flex items-center justify-center`}>
                      <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-xl">
                        {app.icon === 'Gamepad2' ? '🎮' : 
                         app.icon === 'Calculator' ? '🧮' : 
                         app.icon === 'Palette' ? '🎨' : 
                         app.icon === 'TrendingUp' ? '📈' : '📓'}
                      </div>
                    </div>
                    
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition">{app.name}</h4>
                        {app.isPremium && (
                          <span className="text-[8px] bg-indigo-950/60 border border-indigo-900/40 px-1.5 py-0.5 rounded text-indigo-400 font-bold uppercase tracking-wider">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 leading-normal pr-4">{app.tagline}</p>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium pt-0.5">
                        <span className="text-zinc-400 font-bold flex items-center gap-0.5">
                          ⭐ {app.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{app.size}</span>
                        <span>•</span>
                        <span className="text-zinc-600 font-bold">{app.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom details / Action bar */}
                  <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
                    <span className="text-xs font-mono font-bold text-zinc-300">
                      {app.price === 0 ? (
                        <span className="text-emerald-400 font-semibold text-[10px] uppercase tracking-wider">Free App</span>
                      ) : (
                        <span>${app.price}</span>
                      )}
                    </span>

                    {/* Check library or download status */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectApp(app)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg transition"
                      >
                        Specs Info
                      </button>

                      {isDownloaded ? (
                        <button
                          onClick={() => onLaunch(app.id)}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Launch</span>
                        </button>
                      ) : downloadState?.status === 'downloading' ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold font-mono">
                          <span className="w-1 h-1 bg-indigo-400 rounded-full animate-ping" />
                          <span>Downloading {downloadState.progress}%</span>
                        </div>
                      ) : app.isPremium && !isPurchased ? (
                        <button
                          onClick={() => onBuy(app)}
                          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Buy App</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onDownload(app.id)}
                          className="px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 text-[10px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT 4 COLS: SECURE WALLET & OFFLINE DEVICE PANEL */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* SECURE WALLET CARD */}
        <div className="p-5 bg-zinc-900 border border-zinc-800/80 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Secure Store Wallet</h3>
            </div>
            <button
              onClick={() => setShowAddCard(!showAddCard)}
              className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 bg-indigo-500/5 border border-indigo-500/20 px-2.5 py-1 rounded"
            >
              <Plus className="w-3 h-3" />
              <span>Link Card</span>
            </button>
          </div>

          {/* Add card form drawer */}
          {showAddCard && (
            <form onSubmit={handleAddCardSubmit} className="p-3 bg-zinc-950/80 border border-indigo-900/40 rounded-xl space-y-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Link Test Payment Card</span>
                <button type="button" onClick={() => setShowAddCard(false)} className="text-zinc-600 hover:text-zinc-400"><X className="w-3 h-3" /></button>
              </div>

              {cardError && (
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{cardError}</span>
                </div>
              )}

              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Cardholder (e.g. Maisie Clarke)"
                  value={newCardholder}
                  onChange={e => setNewCardholder(e.target.value)}
                  className="w-full text-[11px] px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded focus:border-indigo-500 focus:outline-none text-zinc-200"
                />
                <input
                  type="text"
                  required
                  placeholder="Card Number (Luhn verified)"
                  value={newCardNumber}
                  onChange={handleCardFormat}
                  className="w-full text-[11px] px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded focus:border-indigo-500 focus:outline-none text-zinc-200 font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={newExpiry}
                    onChange={e => setNewExpiry(e.target.value)}
                    className="w-full text-[11px] px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded focus:border-indigo-500 focus:outline-none text-zinc-200 font-mono"
                  />
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="CVV"
                    value={newCvv}
                    onChange={e => setNewCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-[11px] px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded focus:border-indigo-500 focus:outline-none text-zinc-200 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[10px] rounded transition"
                >
                  Verify and Save Card
                </button>
              </div>
            </form>
          )}

          {/* Cards List Display */}
          <div className="space-y-2">
            {wallet.paymentCards.length === 0 ? (
              <div className="p-3 bg-zinc-950/40 rounded-xl border border-dashed border-zinc-800/80 text-center text-zinc-500 text-[10px] py-4">
                No verified card linked. Please link a test card to unlock premium application purchases!
              </div>
            ) : (
              wallet.paymentCards.map(card => (
                <div 
                  key={card.id}
                  className="p-3 bg-gradient-to-r from-zinc-950 to-zinc-900 rounded-xl border border-zinc-800/60 flex items-center justify-between shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-zinc-800 border border-zinc-700/60 text-indigo-400">
                      <CreditCard className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-300 font-mono">{card.cardNumber}</span>
                      <span className="text-[8px] text-zinc-600 block uppercase font-mono">{card.cardholderName} • EXP {card.expiryDate}</span>
                    </div>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded">
                    {card.cardType}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-zinc-950/40 rounded-xl border border-zinc-800/40 text-[9px] text-zinc-500 leading-normal flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Store Wallet keeps encrypted tokens only. Integrates real-time verification layers to authorize app catalog downloads securely.</span>
          </div>
        </div>

        {/* DEVICE COMPANION LIBRARY */}
        <div className="p-5 bg-zinc-900 border border-zinc-800/80 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4.5 h-4.5 text-emerald-400" />
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Downloaded Apps</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-zinc-500">
              ({wallet.downloadedHistory.length} Installed)
            </span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {wallet.downloadedHistory.length === 0 ? (
              <div className="p-6 bg-zinc-950/20 border border-zinc-800/40 rounded-xl text-center text-zinc-600 text-[10px] py-8">
                Your sandbox container has no active downloads. Browse the catalog and tap download to install apps.
              </div>
            ) : (
              wallet.downloadedHistory.map(appId => {
                const app = apps.find(a => a.id === appId);
                if (!app) return null;
                return (
                  <div 
                    key={appId}
                    className="p-2.5 bg-zinc-950/60 border border-zinc-800/40 rounded-xl flex items-center justify-between hover:border-zinc-700/60 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${app.color} p-0.5 flex items-center justify-center text-xs`}>
                        <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                          {app.icon === 'Gamepad2' ? '🎮' : 
                           app.icon === 'Calculator' ? '🧮' : 
                           app.icon === 'Palette' ? '🎨' : 
                           app.icon === 'TrendingUp' ? '📈' : '📓'}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-300 group-hover:text-indigo-400 transition">{app.name}</h4>
                        <span className="text-[8px] text-zinc-600 block uppercase font-mono">{app.size} • INSTALLED</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onLaunch(appId)}
                      className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-md transition flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Launch</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
