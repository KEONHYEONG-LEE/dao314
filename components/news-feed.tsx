// ... (상단 interface 및 CATEGORY_MAP은 유지)

export default function NewsFeed({ selectedCategory }: { selectedCategory: string }) {
  // ... (useState 및 useEffect 로직 유지)

  return (
    <section className="px-4 pb-24 space-y-3 mt-4">
      {news.length > 0 ? news.map((item) => (
        <a key={item.id} 
           href={item.url} // 깨졌던 링크를 복구했습니다.
           target="_blank" 
           rel="noopener noreferrer" 
           className="block bg-[#1e293b] rounded-xl p-4 border border-slate-700/50 shadow-md">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase">
                  {CATEGORY_MAP[item.category.toUpperCase()] || item.category}
                </span>
                <h3 className="text-[15px] font-semibold text-slate-100 line-clamp-2 leading-snug mt-1">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
                {/* 사라졌던 출처와 날짜를 다시 표시합니다. */}
                <span className="truncate max-w-[100px]">{item.source}</span>
                <span>•</span>
                <span>{item.date ? new Date(item.date).toLocaleDateString() : ""}</span>
                
                <div className="flex items-center gap-3 ml-auto text-sm">
                  {/* ... 하단 버튼 로직 유지 */}
                </div>
              </div>
            </div>
            {/* ... 이미지 섹션 유지 */}
          </div>
        </a>
      )) : <div className="text-center py-20 text-slate-500 text-sm">뉴스를 불러오는 중입니다...</div>}
    </section>
  );
}
