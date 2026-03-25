"use client";

import { useState } from "react";
import { GPNRHeader } from "@/components/gpnr-header";
import { CategoryTabs } from "@/components/category-tabs";
import { SourceFilter } from "@/components/source-filter";
import { NewsFeed } from "@/components/news-feed";
import { TrendingSidebar } from "@/components/trending-sidebar";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GPNRHeader />
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <main className="flex-1 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <SourceFilter
                selectedSource={selectedSource}
                onSourceChange={setSelectedSource}
              />
              <NewsFeed
                selectedCategory={selectedCategory}
                selectedSource={selectedSource}
              />
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <TrendingSidebar />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-auto">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">Pi</span>
              </div>
              <span className="text-sm text-muted-foreground">
                GPNR - Global Pi News Room
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Pi Network 관련 뉴스를 전 세계에서 수집하여 제공합니다. 모든 뉴스의 저작권은 원 출처에 있습니다.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">이용약관</a>
              <a href="#" className="hover:text-foreground transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-foreground transition-colors">문의하기</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
