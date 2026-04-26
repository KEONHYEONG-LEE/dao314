"use client";
import { useState, useEffect } from "react";
// [추가] 별도 파일로 만든 CategoryTabs를 불러옵니다.
import { CategoryTabs } from "../components/category-tabs";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [articleStatus, setArticleStatus] = useState<Record<string, { read: boolean; star: boolean; heart: boolean }>>({});

  useEffect(() => {
    // 구글 번역 UI 정리 로직
    const hideGoogleUI = () => {
      const banner = document.querySelector(".goog-te-banner-frame") as HTMLElement;
      if (banner) banner.style.display = "none";
      const tooltip = document.getElementById("goog-gt-tt") as HTMLElement;
      if (tooltip) { tooltip.style.display = "none"; tooltip.style.visibility = "hidden"; }
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
        setNews(Array.isArray(data) ? data : (data.articles || []));
      } catch (error) {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    return () => clearInterval(interval);
  }, [activeCategory]);

  const toggleStatus = (url: string, type: 'read' | 'star' | 'heart', e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const current = articleStatus[url] || { read: false
