"use client";

import { useState, useEffect } from "react";
import { Search, User, Home, CircleDollarSign, Grid, X, Share2, ExternalLink, Sparkles, Languages } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: { ko: '전체', en: 'All', zh: '全部', ja: '全部', vi: 'Tất cả' }, icon: <Grid size={18}/> },
  { id: 'mainnet', label: { ko: '메인넷', en: 'Mainnet', zh: '主网', ja: 'メインネット', vi: 'Mainnet' }, icon: '🌐' },
  // ... 나머지 카테고리 동일
];

const LANGUAGES = [
  { code: 'ko', label: 'KO' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: 'ZH' },
  { code: 'ja', label: 'JA' },
  { code: 'vi', label: 'VI' },
];

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{username: string} | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [lang, setLang] = useState('ko');
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    const res = await fetch(`/api/news?category=${activeCategory}&lang=${lang}`);
    const data = await res.json();
    setNews(data);
    setLoading(false);
  };

  const handleAISummary = () => {
    setSummarizing(true);
    setTimeout(() => {
      setSummary(`[GPNR AI 요약]\n• 본 기사는 파이 네트워크의 ${selectedNews.category} 관련 최신 업데이트를 분석하고 있습니다.\n• 주요 이슈는 생태계 확장과 마이그레이션의 기술적 안정성 확보입니다.\n• 글로벌 파이오니어들의 활동량이 전주 대비 증가 추세에 있습니다.`);
      setSummarizing(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20 font-sans">
      {/* 상단 헤더: 다국어 선택기 부활 */}
      <header className="bg-[#0D1B3E] text-white px-4 py-3 flex justify-between items-center sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">G</div>
          <span className="text-xl font-black italic">GPNR</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/10 rounded-lg p-1 mr-2">
            {LANGUAGES.map(l => (
              <button 
                key={l.code} 
                onClick={() => setLang(l.code)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${lang === l.code ? 'bg-indigo-600' : ''}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="bg-indigo-600 px-4 py-1.5 rounded-full text-[11px] font-bold">
            {user ? user.username : "Guest_Pioneer"}
          </button>
        </div>
      </header>

      {/* 리스트 UI: 사진 8번 스타일 유지 */}
      <main className="divide-y divide-gray-100">
        {news.map((item) => (
          <article key={item.id} className="flex items-center gap-4 p-4 active:bg-gray-50" onClick={() => { setSelectedNews(item); setSummary(""); }}>
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 mb-1 items-center">
                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                <span className="text-[9px] text-gray-400">{item.date}</span>
              </div>
              <h3 className="font-bold text-[15px] leading-snug line-clamp-2">{item.title}</h3>
            </div>
            <img src={item.image} className="w-20 h-20 object-cover rounded-xl border" alt="thumb" />
          </article>
        ))}
      </main>

      {/* 상세 모달: 순서 교정 (본문 -> 요약) */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end justify-center">
          <div className="bg-white w-full max-w-2xl h-[92vh] rounded-t-[2.5rem] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{selectedNews.category}</span>
              <button onClick={() => setSelectedNews(null)} className="p-2 bg-gray-100 rounded-full"><X/></button>
            </div>
            
            <img src={selectedNews.image} className="w-full h-52 object-cover rounded-3xl mb-6 shadow-lg" />
            <h2 className="text-2xl font-black mb-6 leading-tight text-gray-900">{selectedNews.title}</h2>

            {/* 1. 기사 본문 먼저 보여주기 */}
            <div className="text-gray-700 leading-relaxed mb-8 text-[16px] whitespace-pre-wrap border-b pb-8">
              {selectedNews.content}
            </div>

            {/* 2. 그 다음 AI 요약 제공 */}
            <div className="mb-8">
              <button 
                onClick={handleAISummary}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-indigo-200 shadow-lg"
              >
                <Sparkles size={18} className={summarizing ? "animate-spin" : ""} />
                AI 핵심 내용 요약하기
              </button>
              
              {summary && (
                <div className="mt-4 bg-indigo-50 p-5 rounded-2xl border-l-4 border-indigo-500 animate-in slide-in-from-top">
                  <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap font-medium">{summary}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              <a href={selectedNews.url} target="_blank" className="bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm">
                <ExternalLink size={18}/> 원문 기사 사이트
              </a>
              <button className="bg-[#0D1B3E] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm">
                <Share2 size={18}/> 공유하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
