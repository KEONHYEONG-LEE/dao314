"use client";
import { useState, useEffect } from "react";
import { CategoryTabs } from "../components/category-tabs";
import { stripHtml, formatTimeAgo } from "@/lib/utils";

export default function Home() {
  const [news, setNews] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

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
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));

    const fetchNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === 'all' ? '' : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/fetch-news${query}`);
        const data = await res.json();
        setNews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error:", error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    return () => clearInterval(interval);
  }, [activeCategory]);

  const toggleStatus = (url: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = articleStatus[url] || { read: false, star: false, heart: false };
    const updatedStatus = {
      ...articleStatus,
      [url]: { ...current, [type]: !current[type] }
    };
    setArticleStatus(updatedStatus);
    localStorage.setItem('gpnr_article_status', JSON.stringify(updatedStatus));
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100">
      <CategoryTabs 
        selectedCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20 text-slate-500 animate-pulse font-bold">GPNR 데이터를 불러오는 중...</div>
        ) : (news && news.length > 0) ? (
          news.map((item) => {
            const status = articleStatus[item.sourceUrl] || { read: false, star: false, heart: false };
            return (
              <a 
                key={item.id || item.sourceUrl} 
                href={item.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="
