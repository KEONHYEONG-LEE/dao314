"use client"; 

import { Tv, Youtube, Twitter, Facebook, Instagram, Rss, Filter } from "lucide-react"; 

const sources = [
  { id: "all", label: "전체 소스", icon: Filter, color: "text-gray-500", bgColor: "bg-gray-100" },
  { id: "official", label: "공식 뉴스", icon: Tv, color: "text-red-500", bgColor: "bg-red-50", channels: ["CNN", "BBC", "KBS", "Reuters"] },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600", bgColor: "bg-red-50", channels: ["Pi Network", "호알라TV"] },
  { id: "twitter", label: "X (Twitter)", icon: Twitter, color: "text-black", bgColor: "bg-gray-100", channels: ["@PiCoreTeam", "@PiNetwork"] },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600", bgColor: "bg-blue-50", channels: ["Pi Network Official"] },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500", bgColor: "bg-pink-50", channels: ["@pinetwork"] },
  { id: "rss", label: "RSS 피드", icon: Rss, color: "text-orange-500", bgColor: "bg-orange-50", channels: ["CoinDesk", "CoinTelegraph"] },
]; 

interface SourceFilterProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
} 

export function SourceFilter({ selectedSource, onSourceChange }: SourceFilterProps) {
  const activeSource = sources.find((s) => s.id === selectedSource); 

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Filter className="w-4 h-4 text-blue-600" />
        뉴스 소스 필터
      </h3>
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => {
          const IconComponent = source.icon; // 변수명 명확화
          const isSelected = selectedSource === source.id;
          return (
            <button
              key={source.id}
              onClick={() => onSourceChange(source.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : `${source.bgColor} ${source.color} hover:bg-opacity-70`
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{source.label}</span>
            </button>
          );
        })}
      </div> 

      {selectedSource !== "all" && activeSource?.channels && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {activeSource.channels.map((channel) => (
              <span
                key={channel}
                className="px-2 py-0.5 bg-gray-50 rounded text-[10px] text-gray-500 border border-gray-100"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
