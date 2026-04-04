import { Share2, MessageSquare, Heart, EyeOff, Bookmark, ChevronDown } from "lucide-react";

export default function NewsCard({ category, title, excerpt, date, author, image }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      <div className="p-4 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-blue-600">Global Community</span>
        </div>
        <div className="flex gap-3 text-slate-300">
          <EyeOff className="w-4 h-4" />
          <Bookmark className="w-4 h-4" />
          <Heart className="w-4 h-4" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{excerpt}</p>
        <img src={image} alt="news" className="w-full h-48 object-cover rounded-xl mb-4" />
        
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t pt-3">
          <div className="flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-600" />
            <span>Pi Network Community</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{date}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        
        <div className="flex gap-4 mt-3 text-slate-500 text-xs font-medium">
          <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> Comments (0)</div>
          <div className="flex items-center gap-1"><Share2 className="w-4 h-4" /> Share</div>
        </div>
      </div>
    </div>
  );
}
