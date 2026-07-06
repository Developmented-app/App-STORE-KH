/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, Star, Download, Play, CheckCircle2, ThumbsUp, 
  MessageSquarePlus, ShieldCheck, Info, Sparkles, ChevronRight, Award, Share2, Link
} from 'lucide-react';
import { AppItem, Review, ActiveDownload } from '../types';

interface AppDetailsProps {
  app: AppItem;
  downloadStatus: ActiveDownload | null;
  isPurchased: boolean;
  isDownloaded: boolean;
  userEmail: string;
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

    if (isDownloaded) {
      return (
        <button
          onClick={() => onLaunch(app.id)}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 active:scale-98 transition flex items-center justify-center gap-2 tracking-wide uppercase"
        >
          <Play className="w-4.5 h-4.5 fill-current" />
          <span>Launch App Emulator</span>
        </button>
      );
    }

    if (downloadStatus?.status === 'downloading') {
      return (
        <div className="w-full sm:w-auto min-w-[200px] flex flex-col gap-1.5 p-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
              Downloading...
            </span>
            <span className="font-mono text-indigo-400 font-bold">{downloadStatus.progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700/50">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-300" 
              style={{ width: `${downloadStatus.progress}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono text-right">{downloadStatus.speed}</span>
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
              className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-300 hover:text-white font-bold text-xs rounded-xl shadow-md active:scale-98 transition flex items-center justify-center gap-2 tracking-wide uppercase"
              id="btn-share-hero"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Share App</span>
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

        {/* Dynamic Review Submission Form */}
        {showReviewForm && (
          <form 
            onSubmit={handleReviewSubmit} 
            className="p-5 bg-zinc-900/80 border border-indigo-500/30 rounded-2xl space-y-4 animate-fade-in"
          >
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Write Custom App Review</h4>
            
            {reviewSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Review submitted successfully! Updating average rating log...</span>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Username / Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maisie Clarke"
                      value={revName}
                      onChange={e => setRevName(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-indigo-500 focus:outline-none text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Score Rating (1-5)</label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRevRating(val)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star className={`w-6 h-6 ${val <= revRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Review Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of your experience"
                    value={revTitle}
                    onChange={e => setRevTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-indigo-500 focus:outline-none text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 font-semibold block mb-1">Detailed Comment</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell other users why they should or shouldn't download this application..."
                    value={revComment}
                    onChange={e => setRevComment(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-indigo-500 focus:outline-none text-zinc-100 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg transition"
                  >
                    Publish Review
                  </button>
                </div>
              </div>
            )}
          </form>
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
