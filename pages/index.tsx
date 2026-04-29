"use client";
import { useState, useEffect } from "react";
import { CategoryTabs } from "../components/category-tabs";
import NewsFeed from "../components/news-feed";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const hideGoogleUI = () => {
      const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement;
      if (banner) banner.style.display = "none";
      const tooltip = document.getElementById("goog-gt-tt") as HTMLElement;
      if (tooltip) {
        tooltip.style.setProperty("display", "none", "important");
        tooltip.style.setProperty("visibility", "hidden", "important");
      }
      document.body.style.top = "0px";
    };
    const interval = setInterval(hideGoogleUI, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100">
      <CategoryTabs 
        selectedCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />
      <div className="max-w-3xl mx-auto">
        <NewsFeed selectedCategory={activeCategory} />
      </div>
    </main>
  );
}
