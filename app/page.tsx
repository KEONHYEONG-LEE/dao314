"use client";

import { useState, useEffect } from "react";
import { Search, User, Home, CircleDollarSign, Grid, X, Share2, ExternalLink, Sparkles, ChevronDown, Users } from 'lucide-react'; 

const CATEGORIES = [
  { id: 'all', label: { ko: '전체', en: 'All' }, icon: <Grid size={18}/> },
  { id: 'mainnet', label: { ko: '메인넷', en: 'Mainnet' }, icon: '🌐' },
  // [수정 포인트 2] COMMUNITY 카테고리 복구 (MAINNET과 COMMERCE 사이)
  { id: 'community', label: { ko: '커뮤니티', en: 'Community' }, icon: <Users size={18}/> }, 
  { id: 'commerce', label: { ko: '커머스', en: 'Commerce' }, icon: '🛒' },
  { id: 'social', label: { ko: '소셜', en: 'Social' }, icon: '💬' },
  { id: 'education', label: { ko: '교육', en: 'Education' }, icon: '📚' },
  { id: 'health', label: { ko: '건강', en: 'Health' }, icon: '🏥' },
  { id: 'travel', label: { ko: '여행', en: 'Travel' }, icon: '✈️' },
  { id: 'utilities', label: { ko: '유틸리티', en: 'Utilities' }, icon: '🛠️' },
  { id: 'career', label: { ko: '커리어', en: 'Career' }, icon: '💼' },
  { id: 'entertainment', label: { ko: '엔터', en: 'Entertain' }, icon: '🎬' },
  { id: 'games', label: { ko: '게임', en: 'Games' }, icon: '🎮' },
  { id: 'finance', label: { ko: '금융', en: 'Finance' }, icon: '💰' },
  { id: 'music', label: { ko: '음악', en: 'Music' }, icon: '🎵' },
  { id: 'sports', label: { ko: '스포츠', en: 'Sports' }, icon: '🏆' },
  { id: 'defi', label: { ko: '디파이', en: 'DeFi' }, icon: '🏦' },
  { id: 'dapp', label: { ko: '디앱', en: 'dApp' }, icon: '📱' },
  { id: 'nft', label: { ko: 'NFT', en: 'NFT' }, icon: '🖼️' },
];

// ... (LANGUAGES 배열 및 NewsPage 컴포넌트 시작 부분 동일)

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* 헤더 부분 생략 (기존 코드 유지) */}
      
      {/* 카테고리 네비게이션 */}
      <nav className="bg-white border-b sticky top-[52px] z-50 overflow-x-auto no-scrollbar py-3">
        <div className="flex gap-4 px-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex flex-col items-center min-w-[56px] ${activeCategory === cat.id ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{cat.icon}</div>
              {/* [수정 포인트 3] 아이콘 하단 이름 유지하되 'all' 아이콘 클릭 기능은 살려둠 */}
              <span className="text-[10px] font-bold mt-1 uppercase">{cat.id}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 기사 리스트 */}
      <main className="divide-y divide-gray-100">
        {loading ? <div className="p-20 text-center text-gray-400 font-bold animate-pulse">데이터 동기화 중...</div> :
          news.map((item) => (
            <article key={item.id} className="flex items-center gap-4 p-4 active:bg-gray-50" onClick={() => { setSelectedNews(item); setSummary(""); }}>
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-1 items-center">
                  {/* [핵심] 이제 item.category는 route.ts에서 처리된 실제 카테고리명이 나옵니다. */}
                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                  <span className="text-[9px] text-gray-400 font-medium">{item.date}</span>
                </div>
                <h3 className="font-bold text-[15px] leading-snug line-clamp-2">{item.title}</h3>
              </div>
              <img src={item.image} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm" alt="thumb" />
            </article>
          ))
        }
      </main>

      {/* 상세 모달 부분 생략 (기존 코드 유지) */}
    </div>
  );
}
