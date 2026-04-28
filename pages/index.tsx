// pages/index.tsx 의 news.map 안쪽 전체 교체
{news.map((item, index) => (
  <a 
    key={item.id || index} 
    href={item.url} 
    target="_blank" 
    rel="noopener noreferrer"
    // 기본은 가로 배치(flex-row), PC(sm:) 이상에서만 세로 배치(flex-col)
    className={`block p-4 rounded-2xl border border-slate-800 transition-all hover:border-slate-600 flex flex-row sm:flex-col gap-4 ${
      articleStatus[item.url]?.read 
        ? 'bg-slate-800/40 opacity-60' 
        : 'bg-[#1e293b] shadow-lg shadow-black/20'
    }`}
  >
    {/* 1. 이미지 영역: 모바일은 작게 가로로(w-24), PC는 크게 위로(w-full h-48) */}
    {item.imageUrl && (
      <div className="relative w-24 h-24 sm:w-full sm:h-48 flex-shrink-0 overflow-hidden rounded-xl bg-slate-700">
        <img 
          src={item.imageUrl} 
          alt="" 
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </div>
    )}
    
    {/* 2. 텍스트 컨텐츠 영역: 이미지가 옆에 있을 때 남은 공간을 꽉 채움(flex-1) */}
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
        <span className="text-[10px] sm:text-xs font-bold text-orange-400 uppercase">{item.category}</span>
        <span className="text-[9px] sm:text-[10px] text-slate-500">{item.source}</span>
      </div>

      {/* 제목: 모바일에서는 조금 작게, 줄임표(line-clamp-2) 처리 */}
      <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-white leading-tight line-clamp-2 sm:line-clamp-none">
        {item.title}
      </h2>

      {/* 본문: 모바일에서는 너무 길지 않게(line-clamp-2) */}
      <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-3 sm:mb-4">
        {item.content}
      </p>

      {/* 3. 하단 버튼 영역: PC에서는 맨 아래로 밀착(mt-auto), 모바일은 작게 */}
      <div className="flex gap-3 sm:gap-4 text-xl sm:text-2xl bg-black/20 w-fit px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/5 sm:mt-auto">
        <button onClick={(e) => toggleStatus(item.url, 'read', e)} title="Read">
          {articleStatus[item.url]?.read ? '📖' : '📕'}
        </button>
        <button onClick={(e) => toggleStatus(item.url, 'star', e)} title="Star">
          {articleStatus[item.url]?.star ? '⭐' : '☆'}
        </button>
        <button onClick={(e) => toggleStatus(item.url, 'heart', e)} title="Heart">
          {articleStatus[item.url]?.heart ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  </a>
))}
