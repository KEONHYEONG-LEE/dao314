"use client";

import { useState } from "react";
// 아이콘 로딩 문제 방지를 위해 lucide-react에서 필요한 것만 명확히 임포트
import { 
  Bell, FileText, Youtube, LogIn, ChevronDown, Search, 
  Grid, Filter, Users, LayoutGrid, Heart 
} from "lucide-react";
import { CategoryTabs } from "@/components/category-tabs";
import { SourceFilter } from "@/components/source-filter";
import NewsFeed from "@/components/news-feed";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  return (
    // bg-background 대신 bg-white와 구체적인 색상값(#f8fafc) 사용
    <main className="min-h-screen bg-white pb-20">
      {/* 상단 헤더 - 안정적인 배경색 적용 */}
      <header style={{ backgroundColor: '#1a2b4b' }} className="text-white px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-yellow-500">GPNR</h1>
            <span className="text-[10px] text-gray-300 hidden sm:block">(Global Pi News Room)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-700 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full">2</span>
            </div>
            <div className="p-2 bg-yellow-500 rounded-lg"><FileText className="w-5 h-5 text-gray-900" /></div>
            <div className="p-2 bg-red-600 rounded-lg"><Youtube className="w-5 h-5 text-white" /></div>
            <button className="bg-blue-600 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1">
              <LogIn className="w-4 h-4" /> Login
            </button>
          </div>
        </div>
      </header>

      {/* 검색 및 필터 영역 */}
      <div className="px-4 mt-4 max-w-7xl mx-auto">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Global Pi news" 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
          />
        </div>

        {/* 상단 둥근 버튼 메뉴 */}
        <div className="flex gap-4 py-2 overflow-x-auto no-scrollbar border-b border-gray-100">
          <div className="flex flex-col items-center min-w-[60px]">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 mt-1">All</span>
          </div>
          <div className="flex flex-col items-center min-w-[60px]">
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
              <Filter className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-gray-500 mt-1">Filter</span>
          </div>
          <div className="flex flex-col items-center min-w-[60px]">
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
              <Grid className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-gray-500 mt-1">Board</span>
          </div>
        </div>
      </div>

      {/* 카테고리 & 뉴스 피드 */}
      <div className="mt-2">
        <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <div className="px-4 max-w-7xl mx-auto mt-4">
          <SourceFilter selectedSource={selectedSource} onSourceChange={setSelectedSource} />
          <NewsFeed selectedCategory={selectedCategory} />
        </div>
      </div>

      {/* 하단 네비게이션 - 고정 위치에서 발생할 수 있는 버그 방지 위해 shadow 추가 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-3 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center text-blue-600">
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <Heart className="w-6 h-6" />
          <span className="text-[10px]">Favs(0)</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <Users className="w-6 h-6" />
          <span className="text-[10px]">Profile</span>
        </div>
      </footer>
    </main>
  );
}
