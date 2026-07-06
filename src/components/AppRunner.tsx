/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Sparkles, Plus, Trash2, Search, Send, 
  TrendingUp, TrendingDown, RefreshCw, Layers, DollarSign, Wallet
} from 'lucide-react';

interface AppRunnerProps {
  appId: string;
}

export default function AppRunner({ appId }: AppRunnerProps) {
  switch (appId) {
    case 'zen-clicker':
      return <ZenClickerApp />;
    case 'calclite':
      return <CalcLiteApp />;
    case 'pixelart-canvas':
      return <PixelArtCanvasApp />;
    case 'cryptotrade-sim':
      return <CryptoTradeSimApp />;
    case 'bytenote':
      return <ByteNoteApp />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full bg-zinc-950 text-zinc-400 p-6 text-center">
          <p>Application "{appId}" launched successfully!</p>
          <span className="text-xs text-zinc-600 mt-2">Standalone Sandbox Container Active</span>
        </div>
      );
  }
}

// ==========================================
// 1. ZEN CLICKER GAME
// ==========================================
function ZenClickerApp() {
  const [satori, setSatori] = useState(0);
  const [gardeners, setGardeners] = useState(0);
  const [monks, setMonks] = useState(0);
  const [chimes, setChimes] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const gardenerCost = Math.floor(15 * Math.pow(1.15, gardeners));
  const monkCost = Math.floor(100 * Math.pow(1.18, monks));
  const chimeCost = Math.floor(600 * Math.pow(1.22, chimes));

  const satoriPerSec = (gardeners * 0.4) + (monks * 2.5) + (chimes * 15.0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSatori(prev => prev + satoriPerSec / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [satoriPerSec]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setSatori(prev => prev + 1);
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev.slice(-10), newRipple]); // Limit to 10 ripples
  };

  const cleanRipple = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none font-sans overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-900/60 border-b border-teal-900/40">
        <div className="flex items-center gap-1.5 text-teal-400 font-medium text-xs tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>ZEN SPACE</span>
        </div>
        <button 
          onClick={() => { setSatori(0); setGardeners(0); setMonks(0); setChimes(0); }} 
          className="text-slate-500 hover:text-rose-400 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Satori Display */}
      <div className="flex flex-col items-center justify-center py-5 bg-slate-900/30">
        <span className="text-2xl font-bold tracking-tight text-teal-300">
          {Math.floor(satori).toLocaleString()}
        </span>
        <span className="text-[10px] text-teal-500/80 uppercase tracking-wider font-semibold">
          Satori Energy
        </span>
        <span className="text-[11px] text-slate-400 mt-0.5">
          +{satoriPerSec.toFixed(1)}/sec
        </span>
      </div>

      {/* Core Lotus Click Area */}
      <div className="flex-1 flex items-center justify-center relative bg-slate-950 overflow-hidden">
        <div 
          onClick={handleTap}
          className="relative w-44 h-44 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-teal-500/30 shadow-inner group"
        >
          {/* Animated Background Rings */}
          <div className="absolute inset-2 rounded-full border border-teal-500/20 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-6 rounded-full border border-cyan-500/10 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />

          {/* Lotus Emoji SVG inside */}
          <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(52,211,153,0.4)] transform group-hover:rotate-12 transition duration-500 select-none">
            🌸
          </span>

          {/* Ripples */}
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute text-emerald-400 text-xs font-bold pointer-events-none animate-ping duration-1000 select-none"
              style={{ left: ripple.x - 10, top: ripple.y - 10 }}
              onAnimationEnd={() => cleanRipple(ripple.id)}
            >
              +1
            </span>
          ))}
        </div>
        <p className="absolute bottom-4 text-[10px] text-slate-500 tracking-wide">
          Tap the Lotus to generate Satori
        </p>
      </div>

      {/* Upgrades List */}
      <div className="p-3 bg-slate-900/80 border-t border-teal-950 flex flex-col gap-1.5 h-44 overflow-y-auto">
        {/* Gardener */}
        <button
          disabled={satori < gardenerCost}
          onClick={() => {
            setSatori(p => p - gardenerCost);
            setGardeners(g => g + 1);
          }}
          className={`flex items-center justify-between p-2 rounded-lg border text-left transition ${
            satori >= gardenerCost
              ? 'bg-teal-950/40 border-teal-800/60 hover:bg-teal-900/40'
              : 'bg-slate-900/30 border-slate-900/50 opacity-60 cursor-not-allowed'
          }`}
        >
          <div>
            <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
              <span>🍃 Zen Gardener</span>
              <span className="text-[10px] text-teal-400">({gardeners})</span>
            </div>
            <div className="text-[10px] text-slate-400">+0.4 Satori/sec</div>
          </div>
          <span className="text-xs font-semibold text-teal-300">
            {gardenerCost} Satori
          </span>
        </button>

        {/* Monk */}
        <button
          disabled={satori < monkCost}
          onClick={() => {
            setSatori(p => p - monkCost);
            setMonks(m => m + 1);
          }}
          className={`flex items-center justify-between p-2 rounded-lg border text-left transition ${
            satori >= monkCost
              ? 'bg-teal-950/40 border-teal-800/60 hover:bg-teal-900/40'
              : 'bg-slate-900/30 border-slate-900/50 opacity-60 cursor-not-allowed'
          }`}
        >
          <div>
            <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
              <span>🧘 Celestial Monk</span>
              <span className="text-[10px] text-cyan-400">({monks})</span>
            </div>
            <div className="text-[10px] text-slate-400">+2.5 Satori/sec</div>
          </div>
          <span className="text-xs font-semibold text-cyan-300">
            {monkCost} Satori
          </span>
        </button>

        {/* Wind Chime */}
        <button
          disabled={satori < chimeCost}
          onClick={() => {
            setSatori(p => p - chimeCost);
            setChimes(c => c + 1);
          }}
          className={`flex items-center justify-between p-2 rounded-lg border text-left transition ${
            satori >= chimeCost
              ? 'bg-teal-950/40 border-teal-800/60 hover:bg-teal-900/40'
              : 'bg-slate-900/30 border-slate-900/50 opacity-60 cursor-not-allowed'
          }`}
        >
          <div>
            <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
              <span>🎐 Wind Chimes</span>
              <span className="text-[10px] text-purple-400">({chimes})</span>
            </div>
            <div className="text-[10px] text-slate-400">+15.0 Satori/sec</div>
          </div>
          <span className="text-xs font-semibold text-purple-300">
            {chimeCost} Satori
          </span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 2. CALCLITE APP
// ==========================================
function CalcLiteApp() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const pressKey = (key: string) => {
    if (key === 'C') {
      setDisplay('0');
      setEquation('');
      return;
    }

    if (key === '=') {
      try {
        // Safe evaluation of simple math strings
        const safeEq = equation.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const result = eval(safeEq);
        setDisplay(String(Number(result).toFixed(4).replace(/\.?0+$/, '')));
        setEquation('');
      } catch (err) {
        setDisplay('Error');
        setEquation('');
      }
      return;
    }

    // Numbers & operators
    setDisplay(prev => {
      if (prev === '0' || prev === 'Error') {
        return key;
      }
      return prev + key;
    });
    setEquation(prev => prev + key);
  };

  const keys = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '='
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white font-sans overflow-hidden">
      {/* Upper display screen */}
      <div className="flex-1 flex flex-col justify-end items-end p-5 bg-gradient-to-b from-zinc-900/40 to-transparent">
        <span className="text-xs text-sky-400 font-mono tracking-wider mb-1 h-4">
          {equation}
        </span>
        <span className="text-3xl font-light tracking-tight text-white font-mono break-all text-right max-w-full">
          {display}
        </span>
      </div>

      {/* Button keyboard */}
      <div className="p-4 grid grid-cols-4 gap-2.5 bg-zinc-900/60 border-t border-zinc-800/50">
        {keys.map(key => {
          const isOperator = ['/', '*', '-', '+', '='].includes(key);
          const isClear = key === 'C';
          return (
            <button
              key={key}
              onClick={() => pressKey(key)}
              className={`h-12 flex items-center justify-center text-sm font-semibold rounded-xl transition ${
                isClear 
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 active:scale-95' 
                  : isOperator 
                    ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 active:scale-95'
                    : 'bg-zinc-800/40 hover:bg-zinc-800/60 text-zinc-300 border border-zinc-700/30 active:scale-95'
              }`}
            >
              {key === '*' ? '×' : key === '/' ? '÷' : key}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 3. PIXELART CANVAS APP
// ==========================================
function PixelArtCanvasApp() {
  const gridSize = 12;
  const initialGrid = Array(gridSize * gridSize).fill('#1f2937'); // slate gray background by default
  const [grid, setGrid] = useState<string[]>(initialGrid);
  const [activeColor, setActiveColor] = useState('#ef4444'); // default red

  const colors = [
    '#ef4444', '#f97316', '#eab308', // Red, Orange, Yellow
    '#22c55e', '#06b6d4', '#3b82f6', // Green, Cyan, Blue
    '#a855f7', '#ec4899', '#f3f4f6'  // Purple, Pink, Off-White
  ];

  const paintPixel = (index: number) => {
    setGrid(prev => {
      const copy = [...prev];
      // Toggle color or paint it
      copy[index] = copy[index] === activeColor ? '#1f2937' : activeColor;
      return copy;
    });
  };

  const clearCanvas = () => {
    setGrid(initialGrid);
  };

  const loadPreset = () => {
    // Generate a quick retro heart shape
    const heart = [...initialGrid];
    const heartIndices = [
      15, 16, 19, 20,
      26, 27, 28, 29, 30, 31, 32, 33,
      38, 39, 40, 41, 42, 43, 44, 45,
      51, 52, 53, 54, 55, 56, 57, 58,
      64, 65, 66, 67, 68, 69, 70, 71,
      78, 79, 80, 81, 82, 83,
      91, 92, 93, 94,
      104, 105
    ];
    heartIndices.forEach(idx => {
      if (idx < heart.length) heart[idx] = '#ec4899'; // Pink
    });
    setGrid(heart);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>PIXEL CANVAS</span>
        </span>
        <div className="flex gap-2">
          <button 
            onClick={loadPreset} 
            className="text-[10px] bg-rose-950/40 border border-rose-800/50 px-2 py-0.5 rounded text-rose-300 hover:bg-rose-900/30 transition"
          >
            Heart Preset
          </button>
          <button 
            onClick={clearCanvas} 
            className="text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded hover:bg-zinc-700 transition flex items-center gap-1"
          >
            <Trash2 className="w-2.5 h-2.5" /> Clear
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 bg-zinc-950">
        <div 
          className="grid gap-0.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800" 
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {grid.map((color, idx) => (
            <div
              key={idx}
              onClick={() => paintPixel(idx)}
              className="w-5 h-5 rounded-[2px] cursor-crosshair transition duration-100 border border-zinc-900/40"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Color Swatch Picker */}
      <div className="p-4 bg-zinc-900/80 border-t border-zinc-800">
        <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-2 text-center">
          Palette Selector
        </div>
        <div className="grid grid-cols-9 gap-1.5 px-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`w-full aspect-square rounded-full transition transform active:scale-90 border-2 ${
                activeColor === color ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. CRYPTOTRADE SIMULATOR
// ==========================================
function CryptoTradeSimApp() {
  const [balance, setBalance] = useState(10000);
  const [holdings, setHoldings] = useState<{ [key: string]: number }>({
    GMINI: 0,
    SLEGO: 0,
    VAPOR: 0
  });

  const [activeToken, setActiveToken] = useState('GMINI');
  const [prices, setPrices] = useState<{ [key: string]: number }>({
    GMINI: 42.50,
    SLEGO: 8.20,
    VAPOR: 154.00
  });

  // Keep a small sparkline history for the active token to plot in an SVG
  const [history, setHistory] = useState<{ [key: string]: number[] }>({
    GMINI: [40, 41, 40.5, 42, 41.8, 42.5],
    SLEGO: [7.8, 8.0, 8.1, 7.9, 8.2, 8.2],
    VAPOR: [150, 151.2, 149.8, 152, 153.1, 154.0]
  });

  const [trend, setTrend] = useState<'up' | 'down'>('up');

  // Simulate price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        const active = activeToken;
        
        // Random walk
        const pct = (Math.random() - 0.49) * 0.04; // Slightly upward bias (0.49 vs 0.5)
        const oldPrice = prev[active];
        const newPrice = Math.max(0.01, Number((oldPrice * (1 + pct)).toFixed(2)));
        next[active] = newPrice;

        setTrend(newPrice >= oldPrice ? 'up' : 'down');

        // Append to sparkline history
        setHistory(prevHist => {
          const updated = { ...prevHist };
          const hist = [...updated[active]];
          hist.push(newPrice);
          if (hist.length > 20) hist.shift(); // keep last 20 ticks
          updated[active] = hist;
          return updated;
        });

        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [activeToken]);

  const price = prices[activeToken];
  const holding = holdings[activeToken] || 0;

  const buyToken = (amount: number) => {
    const totalCost = Number((price * amount).toFixed(2));
    if (balance >= totalCost) {
      setBalance(b => Number((b - totalCost).toFixed(2)));
      setHoldings(h => ({ ...h, [activeToken]: Number((h[activeToken] + amount).toFixed(2)) }));
    }
  };

  const sellToken = (amount: number) => {
    if (holding >= amount) {
      const payout = Number((price * amount).toFixed(2));
      setBalance(b => Number((b + payout).toFixed(2)));
      setHoldings(h => ({ ...h, [activeToken]: Number((Math.max(0, h[activeToken] - amount)).toFixed(2)) }));
    }
  };

  // Convert sparkline history to SVG points
  const activeHistory = history[activeToken] || [40, 40];
  const minPrice = Math.min(...activeHistory);
  const maxPrice = Math.max(...activeHistory);
  const priceRange = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice;
  const svgWidth = 220;
  const svgHeight = 60;
  const points = activeHistory.map((val, idx) => {
    const x = (idx / (activeHistory.length - 1)) * svgWidth;
    const y = svgHeight - 4 - ((val - minPrice) / priceRange) * (svgHeight - 8);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Stats Header */}
      <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Wallet className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] text-zinc-400 font-semibold uppercase">Wallet Ledger</span>
        </div>
        <span className="text-xs font-bold text-amber-400 font-mono">
          ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Token Tabs */}
      <div className="flex bg-zinc-900 border-b border-zinc-800 text-[10px]">
        {['GMINI', 'SLEGO', 'VAPOR'].map(tok => (
          <button
            key={tok}
            onClick={() => { setActiveToken(tok); setTrend('up'); }}
            className={`flex-1 py-2 text-center font-bold border-b-2 transition ${
              activeToken === tok 
                ? 'border-amber-500 text-amber-400 bg-zinc-800/40' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tok === 'GMINI' ? '💎 GMINI' : tok === 'SLEGO' ? '🧱 SLEGO' : '☁️ VAPOR'}
          </button>
        ))}
      </div>

      {/* Main Graph Card */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Active Price Feed</h4>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-white">
                ${price.toFixed(2)}
              </span>
              <span className={`text-xs flex items-center font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {trend === 'up' ? '+Buy' : '-Sell'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 block uppercase">Inventory Owned</span>
            <span className="text-xs font-bold font-mono text-zinc-200">
              {holding} {activeToken}
            </span>
          </div>
        </div>

        {/* Sparkline Canvas */}
        <div className="my-3 bg-zinc-900/40 border border-zinc-900 p-2 rounded-xl flex items-center justify-center">
          <svg className="w-full h-[60px]" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <polyline
              fill="none"
              stroke={trend === 'up' ? '#34d399' : '#f87171'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>

        {/* Operations Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => buyToken(1)}
              disabled={balance < price}
              className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 disabled:opacity-40 font-semibold active:scale-95 transition text-center"
            >
              Buy 1 {activeToken}
            </button>
            <button
              onClick={() => buyToken(10)}
              disabled={balance < (price * 10)}
              className="py-1 text-[10px] rounded-lg bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400/80 border border-emerald-900/40 disabled:opacity-40 active:scale-95 transition"
            >
              Buy 10
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => sellToken(1)}
              disabled={holding < 1}
              className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 disabled:opacity-40 font-semibold active:scale-95 transition text-center"
            >
              Sell 1 {activeToken}
            </button>
            <button
              onClick={() => sellToken(holding)}
              disabled={holding <= 0}
              className="py-1 text-[10px] rounded-lg bg-rose-950/20 hover:bg-rose-950/40 text-rose-400/80 border border-rose-900/40 disabled:opacity-40 active:scale-95 transition"
            >
              Sell All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. BYTENOTE APP
// ==========================================
function ByteNoteApp() {
  const [notes, setNotes] = useState<{ id: string; title: string; content: string; date: string }[]>([
    {
      id: 'n1',
      title: 'Store Launch!',
      content: 'Downloaded ByteNote successfully. Simple, local, fast notepad.',
      date: 'July 6, 2026'
    }
  ]);
  const [search, setSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotes(prev => [newNote, ...prev]);
    setNewTitle('');
    setNewContent('');
    setShowAdd(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Notebook Header */}
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>BYTENOTE</span>
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Note Creator Form Toggle */}
      {showAdd ? (
        <form onSubmit={addNote} className="p-3 bg-zinc-900/90 border-b border-zinc-800 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Note Title"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:outline-none"
            required
          />
          <textarea
            placeholder="Write something awesome..."
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            rows={2}
            className="w-full text-xs px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:outline-none resize-none"
            required
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-[10px] px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-[10px] px-2.5 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition flex items-center gap-1"
            >
              <Send className="w-2.5 h-2.5" /> Save Note
            </button>
          </div>
        </form>
      ) : (
        /* Search Bar */
        <div className="px-3 py-2 bg-zinc-900/40 border-b border-zinc-900 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search diary notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none placeholder-zinc-600"
          />
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2.5 bg-zinc-950">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-zinc-600 text-xs">
            No notes found. Create your first note!
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 group relative hover:border-zinc-700/80 transition">
              <div className="flex justify-between items-start pr-6">
                <h5 className="text-xs font-semibold text-zinc-200">{note.title}</h5>
                <span className="text-[9px] text-zinc-600">{note.date}</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 break-words">{note.content}</p>
              
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute right-2 top-2 text-zinc-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition duration-150"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
