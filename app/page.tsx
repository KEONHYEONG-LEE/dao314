"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Youtube, User, Home, Heart, CircleDollarSign, Grid, Languages, MessageSquare, ChevronDown } from 'lucide-react';

// 4번 요구사항: 5개 언어 번역 데이터
const translations = {
  ko: {
    search: "글로벌 파이 뉴스 검색...",
    trending: "인기 소식",
    login_msg: "로그인 후 자세한 소식을 확인하세요.",
    support: "후원 0.001π",
    verified_error: "Pi Browser의 개발자 모드에서 도메인 승인이 필요합니다.",
    ai_assistant: "AI 도우미",
    all: "전체보기",
    login: "로그인",
    profile: "프로필"
  },
  en: {
    search: "Search Global Pi news...",
    trending: "TRENDING",
    login_msg: "Please login to read full details.",
    support: "Support 0.001π",
    verified_error: "Domain approval required in Pi Browser developer mode.",
    ai_assistant: "AI Assistant",
    all: "See All",
    login: "Login",
    profile: "Profile"
  },
  zh: { search: "搜索全球派新闻...", trending: "趋势", login_msg: "请登录后查看详情", support: "支持 0.001π", ai_assistant: "AI 助手", all: "查看全部", login: "登录", profile: "个人资料" },
  es: { search: "Buscar noticias de Pi...", trending: "TENDENCIAS", login_msg: "Inicie sesión para ver detalles.", support: "Apoyo 0.001π", ai_assistant: "Asistente AI", all: "Ver todo", login: "Acceso", profile: "Perfil" },
  vi: { search: "Tìm kiếm tin tức Pi...", trending: "XU HƯỚNG", login_msg: "Vui lòng đăng nhập để xem chi tiết.", support: "Ủng hộ 0.001π", ai_assistant: "Trợ lý AI", all: "Xem tất cả", login: "Đăng nhập", profile: "Hồ sơ" }
};

const CATEGORIES = [
  { id: 'all', label: { ko: '전체', en: 'See All', zh: '全部', es: 'Todo', vi: 'Tất cả' }, icon: <Grid size={18}/> },
  { id: 'mainnet', label: { ko: '메인넷', en: 'Mainnet', zh: '主网', es: 'Mainnet', vi: 'Mainnet' }, icon: '🌐' },
  { id: 'community', label: { ko: '커뮤니티', en: 'Community', zh: '社区', es: 'Comunidad', vi: 'Cộng đồng' }, icon: '👥' },
  { id: 'commerce', label: { ko: '커머스', en: 'Commerce', zh: '商业', es: 'Comercio', vi: 'Thương mại' }, icon: '🛒' },
  { id: 'social', label: { ko: '소셜', en: 'Social', zh: '社交', es: 'Social', vi: 'Mạng xã hội' }, icon: '💬' },
  { id: 'education', label: { ko: '교육', en: 'Education', zh: '教育', es: 'Educación', vi: 'Giáo dục' }, icon: '📚' },
  { id: 'health', label: { ko: '건강', en: 'Health', zh: '健康', es: 'Salud', vi: 'Sức khỏe' }, icon: '🏥' },
  { id: 'travel', label: { ko: '여행', en: 'Travel', zh: '旅游', es: 'Viajar', vi: 'Du lịch' }, icon: '✈️' },
  { id: 'utilities', label: { ko: '유틸리티', en: 'Utilities', zh: '公用事业', es: 'Utilidades', vi: 'Tiện ích' }, icon: '🛠️' },
  { id: 'career', label: { ko: '커리어', en: 'Career', zh: '职业', es: 'Carrera', vi: 'Sự nghiệp' }, icon: '💼' },
  { id: 'entertainment', label: { ko: '엔터', en: 'Entertain', zh: '娱乐', es: 'Entretenimiento', vi: 'Giải trí' }, icon: '🎬' },
  { id: 'games', label: { ko: '게임', en: 'Games', zh: '游戏', es: 'Juegos', vi: 'Trò chơi' }, icon: '🎮' },
  { id: 'finance', label: { ko: '금융', en: 'Finance', zh: '金融', es: 'Finanzas', vi: 'Tài chính' }, icon: '💰' },
  { id: 'music', label: { ko: '음악', en: 'Music', zh: '音乐', es: 'Música', vi: 'Âm nhạc' }, icon: '🎵' },
  { id: 'sports', label: { ko: '스포츠', en: 'Sports', zh: '体育', es: 'Deportes', vi: 'Thể thao' }, icon: '🏆' },
  { id: 'defi', label: { ko: '디파이', en: 'DeFi', zh: '去中心化金融', es: 'DeFi', vi: 'DeFi' }, icon: '🏦' },
  { id: 'dapp', label: { ko: '디앱', en: 'dApp', zh: '去中心化应用', es: 'dApp', vi: 'dApp' }, icon: '📱' },
  { id: 'nft', label: { ko: 'NFT', en: 'NFT', zh: 'NFT', es: 'NFT', vi: 'NFT' }, icon: '🖼️' },
];

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{username: string, uid: string} | null>(null);
  const [lang, setLang] = useState<'en'|'ko'|'zh'|'es'|'vi'>('ko');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLangMenu, setShowLangMenu] = useState(false); // 언어 메뉴 상태

  useEffect(() => {
    fetchNews();
// window를 any 타입으로 형변환하여 Pi 속성에 접근합니다.
if (typeof window !== "undefined" && (window as any).Pi) {
  (window as any).Pi.init({ version: "1.5", sandbox: true });
}

  }, [activeCategory, lang]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?category=${activeCategory}&lang=${lang}`);
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error("News fetch error");
    } finally {
      setLoading(false);
    }
  };

  const handleSupportClick = async () => {
    if (typeof window === "undefined" || !window.Pi) {
      alert("Please open in Pi Browser.");
      return;
    }
    try {
      const auth = await window.Pi.authenticate(['payments', 'username'], (incompletePayment: any) => {
        console.log("Incomplete payment found:", incompletePayment);
      });
      setUser({ username: auth.user.username, uid: auth.user.uid });

      await window.Pi.createPayment({
        amount: 0.001,
        memo: "Support GPNR",
        metadata: { type: "support_gpnr" },
      }, {
        onReadyForServerApproval: (id: string) => console.log("Wait for approval:", id),
        onReadyForServerCompletion: (id: string, txid: string) => alert("Successfully Supported!"),
        onCancel: (id: string) => console.log("Cancelled"),
        onError: (error: any) => {
          if (error.type === 'app_not_verified') {
            alert(translations[lang].verified_error);
          } else {
            alert("Error: " + error.message);
          }
        },
      });
    } catch (err: any) {
      alert("Auth Failed: " + err.message);
    }
  };

  const currentT = translations[lang];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      
      {/* 1. 상단 헤더 & 언어 선택기 */}
      <header className="bg-[#0D1B3E] text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-extrabold text-sm">G</div>
          <div>
            <h1 className="text-lg font-bold">GPNR</h1>
            <span className="text-[9px] opacity-60">Global Pi News Room</span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {/* 언어 선택 드롭다운 */}
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-white/20"
            >
              <Languages size={14} />
              {lang}
              <ChevronDown size={12} />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-[60] border border-gray-100">
                {[
                  {code:'ko', n:'한국어'}, {code:'en', n:'English'}, {code:'zh', n:'中文'}, {code:'es', n:'Español'}, {code:'vi', n:'Tiếng Việt'}
                ].map((l) => (
                  <button 
                    key={l.code} 
                    onClick={() => { setLang(l.code as any); setShowLangMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50"
                  >
                    {l.n}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleSupportClick} className="bg-indigo-600 px-3 py-1 rounded-md text-xs font-semibold">
            {user ? user.username : currentT.login}
          </button>
        </div>
      </header>

      {/* 2. 검색 & 카테고리 */}
      <div className="bg-white p-4 border-b shadow-sm sticky top-[60px] z-40">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder={currentT.search} className="w-full bg-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none" />
        </div>
        
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-1">
          {CATEGORIES.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveCategory(item.id)}
              className={`flex flex-col items-center min-w-[60px] gap-1.5 cursor-pointer transition-all ${activeCategory === item.id ? 'scale-105' : 'opacity-50'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${activeCategory === item.id ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold whitespace-nowrap">{item.label[lang] || item.label['en']}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 뉴스 피드 */}
      <main className="p-4 space-y-5 pb-28">
        <div className="flex items-center gap-2 text-orange-500 font-black text-[10px] tracking-widest uppercase">
          <span className="animate-pulse">↗ {currentT.trending}</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading News...</div>
        ) : (
          news.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
              onClick={() => {
                if(!user) alert(currentT.login_msg);
                else window.open(item.url, '_blank');
              }}
            >
              <div className="h-44 bg-gray-200 relative">
                <img src={item.image || `https://picsum.photos/seed/${idx}/400/200`} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">{item.category}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-2 line-clamp-2">{item.title}</h3>
                <p className={`text-gray-500 text-[11px] leading-relaxed ${!user && 'blur-[3px] select-none'}`}>
                  {user ? item.description : currentT.login_msg}
                </p>
                <div className="mt-4 flex justify-between items-center text-[10px] text-gray-400">
                  <span>{item.author}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* 4. 하단 탭 바 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t flex justify-around py-3 z-50">
        <div className="flex flex-col items-center text-indigo-700 font-bold"><Home size={22} /><span className="text-[9px] mt-1">Home</span></div>
        <div className="flex flex-col items-center text-gray-400"><MessageSquare size={22} /><span className="text-[9px] mt-1">{currentT.ai_assistant}</span></div>
        <div className="flex flex-col items-center text-gray-400"><User size={22} /><span className="text-[9px] mt-1">{currentT.profile}</span></div>
        <button onClick={handleSupportClick} className="flex flex-col items-center bg-indigo-50 px-4 py-1 rounded-xl border border-indigo-100 active:bg-indigo-100">
          <CircleDollarSign size={22} className="text-indigo-600" />
          <span className="text-[9px] mt-1 font-bold text-indigo-700">{currentT.support}</span>
        </button>
      </footer>
    </div>
  );
}
