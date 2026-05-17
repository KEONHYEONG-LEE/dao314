"use client";

import PiLogin from "./PiLogin"; 
import { useState, useEffect } from "react";
import { NEWS_CATEGORIES } from "@/lib/categories";

interface HeaderProps {
  currentCategory?: string;                     
  onCategoryChange?: (categoryId: string) => void; 
}

export function Header({ 
  currentCategory = "all", 
  onCategoryChange
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false); 

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 본체 헤더 영역 (notranslate 추가로 로고 직역 방지) */}
      <header className="sticky top-0 z-[60] w-full bg-[#0f172a]/90 border-b border-slate-800 backdrop-blur-xl transition-colors notranslate">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[60px] items-center justify-between">
            {/* 로고 (원하셨던 선명한 파이 보라색 테마 완벽 적용) */}
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(147,51,234,0.6)]">
                GPNR
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest ml-2">
                Global Pi Newsroom
              </span>
            </div>
            
            {/* 우측 아이콘 메뉴 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-xl text-2xl font-bold transition-all ${isLauncherOpen ? 'bg-slate-800 text-
