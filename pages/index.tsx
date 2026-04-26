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
    // 구글 번역 UI 정리 로직 (요청하신 번역 아이콘 삭제와 병행하여 UI를 깔끔하게 유지합니다)
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
    
    // 로컬 스토리지에서 읽음/별/하트 상태 불러오기
    const savedStatus = localStorage.getItem('gpnr_article_status');
    if (savedStatus) setArticleStatus(JSON.parse(savedStatus));

    // 뉴스 데이터 페칭
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

  // 끊겼던 toggleStatus 함수 완성
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
    <main className="min-h-screen bg-background">
      {/* 카테고리 탭 영역 */}
      <CategoryTabs 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      {/* 뉴스 리스트 영역 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20 text-muted-foreground">뉴스를 불러오는 중입니다...</div>
        ) : news.length > 0 ? (
          <div className="grid gap-4">
            {news.map((item, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border transition-all ${
                  articleStatus[item.url]?.read ? 'bg-slate-50/50 opacity-60' : 'bg-card'
                }`}
              >
                <h2 className="text-lg font-bold mb-2">{item.title}</h2>
                <div className="flex gap-4 text-xl">
                  <button onClick={(e) => toggleStatus(item.url, 'read', e)}>
                    {articleStatus[item.url]?.read ? '📖' : '📕'}
                  </button>
                  <button onClick={(e) => toggleStatus(item.url, 'star', e)}>
                    {articleStatus[item.url]?.star ? '⭐' : '☆'}
                  </button>
                  <button onClick={(e) => toggleStatus(item.url, 'heart', e)}>
                    {articleStatus[item.url]?.heart ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">표시할 뉴스가 없습니다.</div>
        )}
      </div>
    </main>
  );
}
