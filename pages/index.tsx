// pages/index.tsx의 카드 부분 수정
{news.map((item, index) => (
  <div key={index} className={`...기존 스타일... overflow-hidden`}>
    {/* 이미지 추가 */}
    {item.imageUrl && (
      <img src={item.imageUrl} alt="" className="w-full h-40 object-cover mb-4 rounded-xl" />
    )}
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-bold text-orange-400">{item.category}</span>
      <span className="text-[10px] text-slate-500">{item.source}</span>
    </div>
    <h2 className="text-lg font-bold mb-2 text-white leading-tight">
      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
    </h2>
    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{item.content}</p>
    
    <div className="flex gap-6 ...">
       {/* 버튼들 */}
    </div>
  </div>
))}
