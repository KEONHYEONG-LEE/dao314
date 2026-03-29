"use client";

import { useState } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import NewsFeed from "@/components/news-feed";
// Header나 Footer 등 다른 컴포넌트들도 import 되어 있을 겁니다.

export default function Home() {
  // 1. 현재 선택된 카테고리를 관리하는 상태 (기본값 'all')
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <main className="min-h-screen bg-background">
      {/* 2. 카테고리 탭: 상태와 상태 변경 함수를 넘겨줍니다. */}
      <CategoryTabs 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />

      {/* 3. 뉴스 피드: 선택된 카테고리에 따라 뉴스가 필터링됩니다. */}
      <div className="max-w-7xl mx-auto">
        <NewsFeed selectedCategory={selectedCategory} />
      </div>
    </main>
  );
}
