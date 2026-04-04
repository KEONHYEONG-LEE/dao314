"use client";

import { useState } from "react";
import { Bell, FileText, Youtube, LogIn, ChevronDown, Search, Grid, Filter, Users, LayoutGrid, Share2, MessageSquare, Heart, EyeOff, Bookmark } from "lucide-react";
import { CategoryTabs } from "@/components/category-tabs";
import { SourceFilter } from "@/components/source-filter";
import NewsFeed from "@/components/news-feed";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* GPNR 상단 헤더 영역 */}
      <header className="bg-[#1a2b4b] text-white px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-yellow-500">GPNR</h1>
            <span className="text-[10px] text-slate-300 leading-tight hidden xs:block">
              (Global Pi News Room)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-slate-700/50 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full">2</span>
            </button>
            <button className="p-2 bg-yellow-500 rounded-lg"><FileText className="w-5 h-5 text-[#1a2b4b]" /></button>
            <button className="p-2 bg-red-600 rounded-lg"><Youtube className="w-5 h-5" /></button>
            <button className="flex items-center gap-1 bg-blue-600 px-3 py-2 rounded-lg text-sm font-bold">
              <LogIn className="w-4 h-4" /> Login
            </button>
            <button className="flex items-center gap-1 bg-slate-700/50 px-2 py-2 rounded-lg text-xs">
              English <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Daily updated Pi Network news across all categories.</p>
      </header>

      {/* 검색창 영역 */}
      <div className="px-4 mt-4 max-w-7xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Global Pi news" 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 둥근 아이콘 메뉴 필터 */}
      <div className="flex justify-around px-4 py-4 bg-white mt-4 border-y border-slate-100 max-w-7xl mx-auto overflow-x-auto gap-4 scrollbar-hide">
        <div className="flex flex-col items-center gap-1 min-w-[50px]">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"><LayoutGrid className="w-5 h-5" /></div>
          <span className="text-[10px] font-bold text-blue-600">All</span>
        </div>
        <div className="flex flex-col items-center gap-1 min-w-[50px]">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500"><Filter className="w-5 h-5" /></div>
          <span className="text-[10px] font-medium text-slate-500">Filter</span>
        </div>
        <div className="flex flex-col items-center gap-1 min-w-[50px]">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500"><Grid className="w-5 h-5" /></div>
          <span className="text-[10px] font-medium text-slate-500">Board</span>
        </div>
      </div>

      {/* 카테고리 탭 (이전에 드린 수정본) */}
      <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      {/* 뉴스 피드 영역 */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <SourceFilter selectedSource={selectedSource} onSourceChange={setSelectedSource} />
        <NewsFeed selectedCategory={selectedCategory} />
      </div>

      {/* 하단 네비게이션 바 (두 번째 사진 하단) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        <div className="flex flex-col items-center gap-1 text-blue-600">
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <Heart className="w-6 h-6" />
          <span className="text-[10px]">Favs(0)</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <Users className="w-6 h-6" />
          <span className="text-[10px]">Profile</span>
        </div>
      </footer>
    </main>
  );
}
