/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle2, AlertCircle, X, HelpCircle } from 'lucide-react';
import { AppItem } from '../types';

interface PaymentGatewayProps {
  app: AppItem;
  onPaymentSuccess: (appId: string) => void;
  onCancel: () => void;
}

export default function PaymentGateway({ app, onPaymentSuccess, onCancel }: PaymentGatewayProps) {
  // Form values
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // UI states
  const [step, setStep] = useState<'details' | 'otp' | 'processing' | 'success'>('details');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');
  const [cardType, setCardType] = useState<'Visa' | 'Mastercard' | 'Amex' | 'Unknown'>('Unknown');

  // Format credit card number (xxxx xxxx xxxx xxxx)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // digit only
    if (value.length > 16) value = value.slice(0, 16);
    
    // Set card type
    if (value.startsWith('4')) setCardType('Visa');
    else if (value.startsWith('5')) setCardType('Mastercard');
    else if (value.startsWith('3')) setCardType('Amex');
    else setCardType('Unknown');

    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    setErrorMsg('');
  };

  // Format expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // digit only
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2));
      if (month < 1 || month > 12) {
        setErrorMsg('Invalid month (01-12)');
      } else {
        setErrorMsg('');
      }
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  // Luhn algorithm for secure card verification
  const validateLuhn = (num: string) => {
    const raw = num.replace(/\s/g, '');
    if (raw.length < 13) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = raw.length - 1; i >= 0; i--) {
      let digit = parseInt(raw.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 15) {
      setErrorMsg('Invalid card length. Please check.');
      return;
    }

    if (!validateLuhn(rawCard)) {
      setErrorMsg('Card number failed Luhn security checks. Please input a valid test card number.');
      return;
    }

    if (expiry.length < 5) {
      setErrorMsg('Invalid expiry date (MM/YY required).');
      return;
    }

    if (cvv.length < 3) {
      setErrorMsg('Invalid CVV (3-4 digits).');
      return;
    }

    // Generate simulated secure One-Time Passcode
    const randCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randCode);
    setStep('otp');
    setOtpCountdown(60);
  };

  // Countdown timer for OTP security code
  useEffect(() => {
    if (step !== 'otp') return;
    if (otpCountdown <= 0) {
      // Regenerate OTP
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newCode);
      setOtpCountdown(60);
      return;
    }
    const timer = setTimeout(() => setOtpCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, otpCountdown]);

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === generatedOtp || otpCode === '123456') { // Allow standard test override
      setErrorMsg('');
      setStep('processing');
      
      // Simulate cryptographic handshake processing delay
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(app.id);
        }, 1800);
      }, 2500);
    } else {
      setErrorMsg('Verification code does not match. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        {step !== 'processing' && step !== 'success' && (
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Branding */}
        <div className="flex items-center gap-2 mb-6 border-b border-zinc-800/80 pb-4">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              <span>Secure Checkout</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider">SECURE TLS 256-BIT CRYPTO</span>
          </div>
        </div>

        {/* Display Error Message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: CARD DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            {/* Purchase App summary */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Purchasing App</span>
                <h4 className="text-xs font-bold text-zinc-100 mt-0.5">{app.name}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-indigo-400 font-bold block">License Fee</span>
                <span className="text-sm font-mono font-bold text-white">${app.price}</span>
              </div>
            </div>

            {/* Credit card form fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maisie Clarke"
                  value={cardholder}
                  onChange={e => setCardholder(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:border-indigo-500 focus:outline-none transition font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1 flex justify-between items-center">
                  <span>Card Number</span>
                  <span className="text-[9px] font-bold text-zinc-500 font-mono flex items-center gap-1">
                    {cardType !== 'Unknown' && <span>{cardType} Recognized</span>}
                    <CreditCard className="w-3.5 h-3.5" />
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="4000 1234 5678 9010 (Try valid Visa/MC)"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:border-indigo-500 focus:outline-none transition font-mono font-semibold"
                  />
                  {/* Subtle test tip */}
                  <span className="absolute right-3 top-2.5 text-[8px] bg-zinc-800 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded cursor-help" title="Use a real Luhn-passing card or any generator code for validation to test successfully!">
                    Test card required
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:border-indigo-500 focus:outline-none transition font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
                    CVV Code
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    maxLength={4}
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-700 focus:border-indigo-500 focus:outline-none transition font-mono font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Safeguard text */}
            <div className="flex items-center gap-2 p-2.5 bg-zinc-950 rounded-lg text-[9px] text-zinc-500">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span>We adhere strictly to secure test environments. No actual funds will be charged. Real-time validation algorithm active.</span>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 font-bold text-xs text-white rounded-xl shadow-lg hover:shadow-indigo-500/20 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <span>Verify and Authorize Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: TWO-FACTOR OTP PIN CODE */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="text-center space-y-2">
              <span className="inline-block p-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Lock className="w-5 h-5" />
              </span>
              <h4 className="text-sm font-bold text-zinc-100">Verification Required</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                We have generated a simulated secure authorization PIN for this purchase. Please input the code below to complete the secure ledger verification.
              </p>
            </div>

            {/* Display Generated OTP Code */}
            <div className="p-3.5 bg-zinc-950 border border-indigo-900/40 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">Dynamic OTP Token</span>
              <span className="text-xl font-bold font-mono tracking-widest text-indigo-300 mt-1">
                {generatedOtp}
              </span>
              <span className="text-[9px] text-zinc-600 mt-1">
                Regenerating in <b className="font-mono text-indigo-400">{otpCountdown}s</b>
              </span>
            </div>

            {/* OTP code Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide block mb-1 text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="------"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-lg font-bold font-mono py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white tracking-widest focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Submit OTP */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 font-bold text-xs text-white rounded-xl shadow-lg active:scale-98 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirm & Authenticate Gateway</span>
            </button>
          </form>
        )}

        {/* STEP 3: CRYPTOGRAPHIC HANDSHAKE PROCESSING */}
        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute top-3.5 left-3.5 text-indigo-400">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Gateway Processing</h4>
              <p className="text-[10px] text-zinc-500 mt-1 max-w-xs leading-normal">
                Verifying token signatures, processing Luhn validation, and writing transaction logs to secure sandbox storage...
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: TRANSACTION SUCCESS */}
        {step === 'success' && (
          <div className="py-10 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-400">Transaction Approved</h4>
              <p className="text-[11px] text-zinc-400 mt-1">
                Licensing tokens updated! Your application download is now ready to begin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
