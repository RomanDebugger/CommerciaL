'use client';

import React, { JSX } from 'react';

export default function Loading(): JSX.Element {
  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gr1/10 via-purple-900/10 to-black opacity-30 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-[3px] border-purple-600 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(147,51,234,0.4)]" />
        <div className="text-center text-gray-300 text-sm font-mono tracking-widest relative">
          <span className="animate-pulse">Initializing CommerciaL Engine...</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-5 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
