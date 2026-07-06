/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, Star, Download, Play, CheckCircle2, ThumbsUp, 
  MessageSquarePlus, ShieldCheck, Info, Sparkles, ChevronRight, Award, Share2, Link, Heart
} from 'lucide-react';
import { AppItem, Review, ActiveDownload } from '../types';

interface AppDetailsProps {
  app: AppItem;
  downloadStatus: ActiveDownload | null;
  isPurchased: boolean;
  isDownloaded: boolean;
  userEmail: string;
  wishlist: string[];
  onToggleWishlist: (appId: string) => void;
  onBack: () => void;
  onDownload: (appId: string) => void;
  onLaunch: (appId: string) => void;
  onBuy: (app: AppItem) => void;
  onAddReview: (appId: string, newReview: Review) => void;
}

export default function AppDetails({
  app,
  downloadStatus,
  isPurchased,
  isDownloaded,
  userEmail,
  wishlist,
  onToggleWishlist,
  onBack,
  onDownload,
  onLaunch,
  onBuy,
  onAddReview
}: AppDetailsProps) {
  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revName, setRevName] = useState('Maisie Clarke');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Likes tracker for reviews to make them interactive
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('app', app.id);
    const shareUrl = url.toString();

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('Failed to copy to clipboard', err);
    });
  };

  const toggleLikeReview = (reviewId: string) => {
    if (likedReviews.includes(reviewId)) {
      setLikedReviews(prev => prev.filter(id => id !== reviewId));
    } else {
      setLikedReviews(prev => [...prev, reviewId]);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revTitle.trim() || !revComment.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      userName: revName.trim() || 'Anonymous Developer',
      rating: revRating,
      title: revTitle,
      comment: revComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };

    onAddReview(app.id, newReview);
    setRevTitle('');
    setRevComment('');
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewForm(false);
    }, 1500);
  };

  // Star color configuration
  const renderStars = (ratingNum: number, size = 4) => {
    const stars = [];
    const floor = Math.floor(ratingNum);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className={`w-${size} h-${size} fill-amber-400 text-amber-400`} />);
      } else {
        stars.push(<Star key={i} className={`w-${size} h-${size} text-zinc-600`} />);
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  // Render download actions
  const renderActionButton = () => {
    if (app.isPremium && !isPurchased) {
      return (
        <button
          onClick={() => onBuy(app)}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition flex items-center justify-center gap-2 tracking-wide uppercase"
        >
          <span>Purchase License • ${app.price}</span>
        </button>
      );
    }

    const showProgress = downloadStatus !== null;
    const isDownloading = downloadStatus?.status === 'downloading';
    const isCompleted = isDownloaded || downloadStatus?.status === 'completed';

    if (showProgress || isCompleted) {
      const progressValue = isCompleted ? 100 : (downloadStatus?.progress || 0);
      const speedValue = isCompleted ? 'Completed' : (downloadStatus?.speed || 'Connecting...');

      return (
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-800/60 flex-1">
          {/* Progress Bar Info */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-[180px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                {isCompleted ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-400 font-bold">Download Completed</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                    <span>Downloading App...</span>
                  </>
                )}
              </span>
              <span className={`font-mono font-bold ${isCompleted ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {progressValue}%
              </span>
            </div>
            
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700/50">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-400'
                }`} 
                style={{ width: `${progressValue}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-0.5">
              <span>{isCompleted ? 'Verified Sandbox' : speedValue}</span>
              <span>{app.size}</span>
            </div>
          </div>

          {/* Launch Button immediately when finishes or isCompleted */}
          {isCompleted && (
            <button
              onClick={() => onLaunch(app.id)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2 tracking-wide uppercase shrink-0"
              id="btn-launch-completed"
            >
              <Play className="w-4 h-4 fill-current text-white-forced" />
              <span className="text-white-forced">Launch Emulator</span>
            </button>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => onDownload(app.id)}
        className="w-full sm:w-auto px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs rounded-xl shadow-lg active:scale-98 transition flex items-center justify-center gap-2 tracking-wide uppercase"
      >
        <Download className="w-4.5 h-4.5" />
        <span>Download Free App</span>
      </button>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-0 relative">
      
      {/* LOCAL TOAST / COPIED NOTIFICATION */}
      {copied && (
        <div 
          className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-emerald-500/30 shadow-2xl flex items-center gap-3 max-w-sm bg-zinc-900 text-emerald-400 animate-slide-in"
          id="toast-link-copied"
        >
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <Link className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-100 leading-snug">Link Copied!</h4>
            <p className="text-[10px] text-zinc-400 leading-normal">Unique shareable link for <b className="text-emerald-300 font-semibold">{app.name}</b> copied to clipboard.</p>
          </div>
        </div>
      )}

      {/* Back button Row */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
          <span>Return to Catalog</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 px-4 py-2 rounded-xl transition shadow-md active:scale-95"
          id="btn-share-top"
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Share App</span>
        </button>
      </div>

      {/* Main App Hero Header Card */}
      <div className="relative p-6 sm:p-8 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        {/* Neon Accent Glow */}
        <div className={`absolute -top-10 -left-10 w-44 h-44 bg-gradient-to-br ${app.color} opacity-10 blur-3xl -z-10`} />

        {/* Big App Icon */}
        <div className={`w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-gradient-to-tr ${app.color} p-0.5 shadow-lg shrink-0 flex items-center justify-center`}>
          <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.1)]">
              {app.icon === 'Gamepad2' ? '🎮' : 
               app.icon === 'Calculator' ? '🧮' : 
               app.icon === 'Palette' ? '🎨' : 
               app.icon === 'TrendingUp' ? '📈' : '📓'}
            </span>
          </div>
        </div>

        {/* Info & Action Buttons Column */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">{app.name}</h2>
              <span className="text-[10px] bg-zinc-800 border border-zinc-700/60 px-2.5 py-0.5 rounded-full text-zinc-400 font-semibold uppercase tracking-wider">
                {app.category}
              </span>
              {app.isPremium && (
                <span className="text-[10px] bg-indigo-950/80 border border-indigo-800/40 px-2.5 py-0.5 rounded-full text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3 text-indigo-400" />
                  Premium
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">{app.tagline}</p>
            <p className="text-[11px] text-zinc-500 font-semibold mt-1.5">Developer: {app.developer}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-b border-zinc-800/60 py-3 text-zinc-300">
            {/* Rating Stat */}
            <div className="flex items-center gap-1.5 pr-4 border-r border-zinc-800/60">
              <span className="text-sm font-bold text-zinc-100">{app.rating.toFixed(1)}</span>
              <div className="flex text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
              </div>
            </div>

            {/* Downloads count Stat */}
            <div className="text-xs pr-4 border-r border-zinc-800/60 font-medium">
              <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">Downloads</span>
              <span className="text-zinc-200 font-bold font-mono">{app.downloadCount}</span>
            </div>

            {/* Size Stat */}
            <div className="text-xs pr-4 border-r border-zinc-800/60 font-medium">
              <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">File Size</span>
              <span className="text-zinc-200 font-bold font-mono">{app.size}</span>
            </div>

            {/* Version Stat */}
            <div className="text-xs font-medium">
              <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">Version</span>
              <span className="text-zinc-200 font-bold font-mono">v{app.version}</span>
            </div>
          </div>

          {/* Call to action button */}
          <div className="pt-1 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {renderActionButton()}
            
            <button
              onClick={handleShare}
              className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 hover:text-white font-bold text-xs rounded-xl shadow-md active:scale-98 transition flex items-center justify-center gap-2 tracking-wide uppercase cursor-pointer"
              id="btn-share-hero"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Share App</span>
            </button>

            <button
              onClick={() => onToggleWishlist(app.id)}
              className={`px-6 py-3.5 rounded-xl border font-bold text-xs shadow-md active:scale-98 transition flex items-center justify-center gap-2 tracking-wide uppercase cursor-pointer ${
                wishlist.includes(app.id)
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800/80 text-zinc-300 hover:text-white'
              }`}
              id="btn-wishlist-toggle"
              title={wishlist.includes(app.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`w-4 h-4 transition duration-150 ${wishlist.includes(app.id) ? 'fill-rose-500 text-rose-500 scale-105' : 'text-zinc-400'}`} />
              <span>{wishlist.includes(app.id) ? 'In Wishlist' : 'Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Description Block */}
      <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl space-y-3">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800/60 pb-2">
          <Info className="w-4 h-4 text-zinc-500" />
          <span>Application Information</span>
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed break-words">{app.description}</p>
        
        <div className="grid grid-cols-2 gap-4 pt-2.5 text-xs text-zinc-400">
          <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/40">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold mb-0.5">Initial Release</span>
            <span className="text-zinc-300 font-medium">{app.releaseDate}</span>
          </div>
          <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/40">
            <span className="text-[9px] text-zinc-500 uppercase block font-semibold mb-0.5">Distribution Server</span>
            <span className="text-zinc-300 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Sandbox Verified
            </span>
          </div>
        </div>
      </div>

      {/* Screenshots Gallery Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 px-1">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Product Walkthrough Screens</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {app.screenshots.map((screen, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between h-36 relative overflow-hidden group hover:border-zinc-700/80 transition"
            >
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${app.color} opacity-5 rounded-full blur-xl pointer-events-none`} />
              <div className="text-[10px] text-zinc-500 font-bold font-mono tracking-wider">
                SCREEN 0{idx + 1}
              </div>
              <p className="text-xs font-medium text-zinc-300 break-words leading-relaxed">
                {screen}
              </p>
              <div className="flex justify-end">
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Reviews & Average Rating Details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Customer Rating Logs</span>
          </h3>
          
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Detailed Review Submission Modal Flow */}
        {showReviewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Dark blur backdrop */}
            <div 
              className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300" 
              onClick={() => setShowReviewForm(false)}
            />
            
            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in-95 duration-250 p-6 sm:p-7 text-zinc-100">
              
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-800/60">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <MessageSquarePlus className="w-4 h-4 text-indigo-400" />
                    <span>Create Detailed Review</span>
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Sharing feedback for <b className="text-zinc-200 font-semibold">{app.name}</b>
                  </p>
                </div>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="p-1.5 rounded-lg bg-zinc-950/40 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                  type="button"
                  aria-label="Close detailed review modal"
                >
                  <span className="text-sm font-bold block leading-none px-1">✕</span>
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                {reviewSuccess ? (
                  <div className="py-8 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center flex flex-col items-center justify-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-zinc-100 text-sm">Review Submitted Successfully!</h4>
                      <p className="text-[10px] text-zinc-400">Your rating contribution has been synchronized to the store database ledger.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Star selection block with descriptive label */}
                    <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-center space-y-2">
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                        How would you rate your overall experience?
                      </label>
                      <div className="flex justify-center items-center gap-2.5 py-1">
                        {[1, 2, 3, 4, 5].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setRevRating(val)}
                            className="p-1.5 rounded-lg hover:bg-zinc-900/80 transition active:scale-90"
                            title={`Rate ${val} Stars`}
                          >
                            <Star className={`w-7 h-7 transition duration-150 ${val <= revRating ? 'fill-amber-400 text-amber-400 scale-105' : 'text-zinc-600 hover:text-zinc-400'}`} />
                          </button>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wide block h-4">
                        {revRating === 1 && '⭐ Poor - Disappointing'}
                        {revRating === 2 && '⭐⭐ Fair - Mediocre'}
                        {revRating === 3 && '⭐⭐⭐ Good - Solid App'}
                        {revRating === 4 && '⭐⭐⭐⭐ Very Good - Highly Recommend'}
                        {revRating === 5 && '⭐⭐⭐⭐⭐ Excellent - Near Perfect'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">Username / Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maisie Clarke"
                          value={revName}
                          onChange={e => setRevName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-zinc-100 transition"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">Review Headline</label>
                        <input
                          type="text"
                          required
                          placeholder="Brief summary of your feedback"
                          value={revTitle}
                          onChange={e => setRevTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-zinc-100 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">Written User Feedback</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell other users why they should or shouldn't download this app, what you liked, or suggest features..."
                        value={revComment}
                        onChange={e => setRevComment(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-zinc-100 resize-none leading-relaxed transition"
                      />
                    </div>

                    <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-800/60 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition active:scale-95 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/10 transition active:scale-95 cursor-pointer"
                      >
                        Publish Review
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-3.5">
          {app.reviews.length === 0 ? (
            <div className="p-6 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl text-center text-zinc-500 text-xs">
              No reviews recorded for this version yet. Be the first to share your experience!
            </div>
          ) : (
            app.reviews.map(review => {
              const isLiked = likedReviews.includes(review.id);
              return (
                <div 
                  key={review.id} 
                  className="p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl space-y-2.5 hover:border-zinc-800/90 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200">{review.userName}</span>
                      <span className="text-[10px] text-zinc-500">•</span>
                      <span className="text-[10px] font-mono text-zinc-500">{review.date}</span>
                    </div>
                    <div>{renderStars(review.rating, 3.5)}</div>
                  </div>

                  <div className="space-y-1 pr-4">
                    <h5 className="text-xs font-semibold text-zinc-300">{review.title}</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed break-words">{review.comment}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-1 border-t border-zinc-900/60">
                    <button
                      onClick={() => toggleLikeReview(review.id)}
                      className={`text-[10px] font-semibold flex items-center gap-1 transition ${
                        isLiked ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>
                        Helpful ({review.likes + (isLiked ? 1 : 0)})
                      </span>
                    </button>
                    <span className="text-[10px] text-zinc-600">|</span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Download
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
