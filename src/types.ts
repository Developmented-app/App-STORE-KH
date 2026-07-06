/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppCategory = 'Games' | 'Productivity' | 'Creative' | 'Finance';

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
  likes: number;
}

export interface AppItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // 0 means Free
  category: AppCategory;
  rating: number; // Average rating calculated dynamically
  downloadCount: string; // e.g., "100K+", "1M+"
  size: string; // e.g., "42 MB"
  developer: string;
  version: string;
  icon: string; // Name of Lucide icon
  color: string; // Tailwind glow color class, e.g., 'from-indigo-500 to-purple-600'
  accentColor: string; // Hex or tailwind text color, e.g., 'text-indigo-400'
  screenshots: string[]; // Mock screenshot details or styling
  isPremium: boolean;
  releaseDate: string;
  reviews: Review[];
}

export interface ActiveDownload {
  appId: string;
  progress: number; // 0 to 100
  speed: string; // e.g., "4.2 MB/s"
  status: 'downloading' | 'paused' | 'completed';
}

export interface UserWallet {
  balance: number;
  paymentCards: PaymentCard[];
  purchaseHistory: string[]; // List of purchased appIds
  downloadedHistory: string[]; // List of fully downloaded appIds
}

export interface PaymentCard {
  id: string;
  cardholderName: string;
  cardNumber: string; // Masked except last 4
  expiryDate: string;
  cardType: 'Visa' | 'Mastercard' | 'Amex' | 'Unknown';
}
