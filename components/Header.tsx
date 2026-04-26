"use client";

import PiLogin from "./PiLogin"; 

export function Header() {
  return (
    <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/80 border-b border-white/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[60px] items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-2xl tracking-tighter">GPNR</span>
            <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest ml-2">Global Pi Newsroom</span>
          </div>
          
          <div className="flex items-center">
            <PiLogin />
          </div>
        </div>
      </div>
    </header>
  );
}
