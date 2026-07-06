/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppItem } from './types';

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'zen-clicker',
    name: 'Zen Clicker',
    tagline: 'Cultivate inner peace, one mindful tap at a time.',
    description: 'Immerse yourself in a beautiful meditative celestial clicker game. Cultivate satori energy by tapping a glowing lotus flower. Upgrade your celestial gardens with automation nodes like Monks, Wind Chimes, and Lotus Ponds. Features soothing ambient sound-wave simulations, serene space themes, and satisfying visual ripple animations.',
    price: 0,
    category: 'Games',
    rating: 4.8,
    downloadCount: '250K+',
    size: '14.2 MB',
    developer: 'Aura Studio',
    version: '1.2.4',
    icon: 'Gamepad2',
    color: 'from-emerald-500 via-teal-500 to-cyan-600',
    accentColor: 'text-emerald-400',
    screenshots: [
      'Glow-in-the-dark interactive Lotus blossom core',
      'Zen Gardeners automation dashboard',
      'Atmospheric color themes and ambient ripple customizer'
    ],
    isPremium: false,
    releaseDate: 'May 12, 2026',
    reviews: [
      {
        id: 'r1',
        userName: 'Aria Meadows',
        rating: 5,
        title: 'Insanely Relaxing!',
        comment: 'I play this whenever I feel stressed at work. The lotus expanding on tap is so satisfying. The incremental upgrades are very balanced.',
        date: '2026-06-14',
        likes: 34
      },
      {
        id: 'r2',
        userName: 'PixelPioneer',
        rating: 4,
        title: 'Very polished, but needs more upgrades',
        comment: 'The visual effects are top notch! I love the colors. I reached maximum upgrades in about 30 minutes, hoping the devs add more tiers soon.',
        date: '2026-06-28',
        likes: 12
      }
    ]
  },
  {
    id: 'calclite',
    name: 'CalcLite',
    tagline: 'The modern, physics-based fluid math calculator.',
    description: 'A beautiful glassmorphism-themed calculator utilizing smooth animation transitions and interactive numerical physics. Features direct gesture erasing, scientific constant lookups, and a gorgeous historical tape tracker to recover previous arithmetic strings.',
    price: 0,
    category: 'Productivity',
    rating: 4.6,
    downloadCount: '500K+',
    size: '8.1 MB',
    developer: 'Quantify Labs',
    version: '3.1.0',
    icon: 'Calculator',
    color: 'from-blue-500 to-sky-600',
    accentColor: 'text-sky-400',
    screenshots: [
      'Glassmorphic neon calculator surface',
      'Scientific lookup tables and sliding panel',
      'Persistent calculations formula history'
    ],
    isPremium: false,
    releaseDate: 'Jan 24, 2026',
    reviews: [
      {
        id: 'r3',
        userName: 'Alex Carter',
        rating: 5,
        title: 'Best-looking calculator ever!',
        comment: 'Usually calculators are so boring, but CalcLite feels extremely premium. Love the custom neon effects.',
        date: '2026-04-03',
        likes: 19
      }
    ]
  },
  {
    id: 'pixelart-canvas',
    name: 'PixelArt Canvas Pro',
    tagline: 'Create, share, and animate 12x12 retro sprite art.',
    description: 'Design retro 8-bit sprites directly on your phone using an elegant pixel-mapping matrix. Select customized palette swatches, activate color-droppers, toggle isometric guidelines, and export your gorgeous pixel creations directly into high-fidelity image files.',
    price: 1.99,
    category: 'Creative',
    rating: 4.7,
    downloadCount: '45K+',
    size: '18.7 MB',
    developer: 'RetroBytes Ltd.',
    version: '2.0.1',
    icon: 'Palette',
    color: 'from-purple-500 via-pink-500 to-rose-500',
    accentColor: 'text-rose-400',
    screenshots: [
      'Dynamic retro grid and multi-color wheel selector',
      'Saved creations layout with retro frame previews',
      'Sprite canvas presets with pre-drawn retro icons'
    ],
    isPremium: true,
    releaseDate: 'Feb 15, 2026',
    reviews: [
      {
        id: 'r4',
        userName: 'PixelKing_99',
        rating: 5,
        title: 'Perfect for Retro Fans',
        comment: 'Absolutely love the 12x12 canvas constraints. It forces creative sprite thinking. Well worth the small entry fee!',
        date: '2026-03-22',
        likes: 56
      },
      {
        id: 'r5',
        userName: 'Samanthart',
        rating: 4,
        title: 'Super fluid!',
        comment: 'Drawing feels incredibly natural. It would be amazing to have an undo history stack in a future version.',
        date: '2026-05-10',
        likes: 21
      }
    ]
  },
  {
    id: 'cryptotrade-sim',
    name: 'CryptoTrade Simulator',
    tagline: 'Master the high-stakes markets with real-time tickers.',
    description: 'Step onto the virtual trading floor with a starting budget of $10,000. Track live, volatile simulated price feeds for Solana-Lego (SLEGO), Gemini-Coin (GMINI), and Vapor-Token (VAPOR). Place instant buy/sell orders, view profit/loss indicators, and track your high-score ledger.',
    price: 4.99,
    category: 'Finance',
    rating: 4.9,
    downloadCount: '12K+',
    size: '22.4 MB',
    developer: 'BullMarket Labs',
    version: '4.5.2',
    icon: 'TrendingUp',
    color: 'from-amber-500 via-orange-500 to-yellow-400',
    accentColor: 'text-amber-400',
    screenshots: [
      'Live ticker feeds with fluorescent real-time candlesticks',
      'Simulated trading console with buy/sell state machines',
      'Wallet net worth ledger with historical profits'
    ],
    isPremium: true,
    releaseDate: 'April 09, 2026',
    reviews: [
      {
        id: 'r6',
        userName: 'HODL_Master',
        rating: 5,
        title: 'Addictive Simulation!',
        comment: 'Bought this because I wanted to simulate leverage without losing real money. The price feeds update every second and feel super realistic.',
        date: '2026-05-01',
        likes: 88
      },
      {
        id: 'r7',
        userName: 'Vance Capital',
        rating: 4,
        title: 'Excellent practice tool',
        comment: 'Very helpful to learn the rhythm of price fluctuations and buy/sell timings. Sleek, responsive layout.',
        date: '2026-06-19',
        likes: 15
      }
    ]
  },
  {
    id: 'bytenote',
    name: 'ByteNote',
    tagline: 'Simple, secure markdown-supported daily notes.',
    description: 'Write down tasks, thoughts, or diaries with lightning-fast local storage synchronization. ByteNote supports responsive lists, category tagging, note deletion, search indexing, and a clean minimalist editor optimized for quick typing.',
    price: 0,
    category: 'Productivity',
    rating: 4.5,
    downloadCount: '1.2M+',
    size: '6.5 MB',
    developer: 'ByteEngine Inc.',
    version: '5.0.0',
    icon: 'Notebook',
    color: 'from-indigo-500 to-violet-600',
    accentColor: 'text-indigo-400',
    screenshots: [
      'Minimalist distraction-free note canvas',
      'Index database list with instant live filters',
      'Category badges and custom note pins'
    ],
    isPremium: false,
    releaseDate: 'Nov 18, 2025',
    reviews: [
      {
        id: 'r8',
        userName: 'WritersBlock',
        rating: 5,
        title: 'The cleanest notes app I have used',
        comment: 'No complicated settings, just open it and type. Instantly loaded and never buggy. Love using it daily.',
        date: '2026-02-14',
        likes: 112
      }
    ]
  }
];
