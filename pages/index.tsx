// pages/index.tsx 의 70번째 줄 부근 news.map 부분 교체
{news.map((item, index) => (
  <a 
    key={item.id || index} 
    href={item.url} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`block p-5 rounded-2xl border border-slate-800 transition-all hover:border-slate-600 ${
      articleStatus[item.url]?.read 
        ? 'bg-slate-800/40 opacity-60' 
        : 'bg-[#1e293b] shadow-lg shadow-black/20'
    }`}
  >
    {/* 이미지 표시 */}
    {item.imageUrl && (
      <img src={item.imageUrl} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
    )}
    
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-orange-400">{item.category}</span>
      <span className="text-[10px] text-slate-500">{item.source}</span>
    </div>

    <h2 className="text-lg font-bold mb-3 text-white leading-tight">
      {item.title}
    </h2>

    <p className="text-sm text-slate-400 line-clamp-2 mb-4">
      {item.content}
    </p>

    {/* 하단 버튼 영역 */}
    <div className="flex gap-6 text-2xl bg-black/20 w-fit px-4 py-2 rounded-xl border border-white/5">
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
  </a>
))}
