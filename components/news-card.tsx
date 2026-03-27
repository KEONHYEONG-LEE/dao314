"use client";

import React from "react";
import { Calendar, ArrowUpRight, Share2 } from "lucide-react";

export default function NewsCard({
  title,
  description,
  date,
  category,
  url,
  thumbnail,
}: any) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-800">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-700">
              <span className="text-white/20">Video</span>
            </div>
          )}
          <div className="absolute top-2 left-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            {category}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold text-white">{title}</h3>
          <p className="line-clamp-2 text-sm text-gray-400">{description}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-400">
            자세히 보기 <ArrowUpRight className="h-4 w-4 inline" />
          </a>
        </div>
      </div>
    </div>
  );
}
