/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Home, ArrowLeft, RefreshCw, Smartphone } from 'lucide-react';
import AppRunner from './AppRunner';

interface PhoneSimulatorProps {
  appId: string;
  appName: string;
  onClose: () => void;
}

export default function PhoneSimulator({ appId, appName, onClose }: PhoneSimulatorProps) {
  const [time, setTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);

  useEffect(() => {
    // Current simulated local time
    const updateClock = () => {
      const date = new Date();
      let hrs = date.getHours();
      const mins = String(date.getMinutes()).padStart(2, '0');
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12 || 12; // 12-hour format
      setTime(`${hrs}:${mins} ${ampm}`);
    };
    
    updateClock();
    const timer = setInterval(updateClock, 15000);

    // Slowly drain battery as a fun detail
    const drainTimer = setInterval(() => {
      setBatteryLevel(prev => (prev > 15 ? prev - 1 : 100));
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(drainTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-2 lg:p-6 bg-zinc-950/20 rounded-3xl border border-zinc-800/40 backdrop-blur-md max-w-sm mx-auto shadow-2xl relative">
      {/* Decorative Outer Shell Shadow / Glow */}
      <div className="absolute -inset-1 rounded-[42px] bg-gradient-to-br from-zinc-700/10 via-zinc-800/20 to-zinc-900/40 opacity-70 blur-md -z-10" />

      {/* Phone Hardware Container */}
      <div className="w-[310px] h-[610px] rounded-[40px] bg-zinc-950 border-[9px] border-zinc-900 shadow-3xl relative flex flex-col overflow-hidden ring-4 ring-zinc-800/40 select-none">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-28 h-6 rounded-full bg-black z-30 flex items-center justify-center px-3 border border-zinc-900">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900/80 mr-auto border border-zinc-950" /> {/* Camera lens */}
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse ml-auto" /> {/* Green secure indicator */}
        </div>

        {/* Top Status Bar (iOS style) */}
        <div className="h-10 pt-4 px-6 flex justify-between items-center text-[10px] font-semibold text-zinc-400 bg-zinc-950 z-20 select-none">
          <span className="font-mono">{time}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-zinc-400" />
            <Wifi className="w-3 h-3 text-zinc-400" />
            <div className="flex items-center gap-0.5">
              <span className="text-[8px] mr-0.5">{batteryLevel}%</span>
              <Battery className="w-4.5 h-3.5 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* App Interactive Screen Body */}
        <div className="flex-1 bg-zinc-900 relative flex flex-col overflow-hidden">
          <AppRunner appId={appId} />
        </div>

        {/* Home Navigation Control Bar */}
        <div className="h-10 bg-zinc-950 flex items-center justify-between px-10 z-20 border-t border-zinc-900/60">
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-full hover:bg-zinc-900 transition active:scale-95"
            title="Exit App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="w-24 h-1 rounded-full bg-zinc-700 hover:bg-zinc-400 transition cursor-pointer mx-auto" onClick={onClose} />
          
          <button 
            className="text-zinc-500 hover:text-zinc-200 p-1.5 rounded-full hover:bg-zinc-900 transition active:scale-95"
            title="Running Container Details"
            onClick={() => alert(`Active Container Service: App "${appName}" is running in simulated isolated OS environment.`)}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating simulator badge */}
      <div className="text-[10px] font-mono font-medium text-zinc-500 mt-3 text-center tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        <span>SIMULATOR ACTIVE: {appName}</span>
      </div>
    </div>
  );
}
