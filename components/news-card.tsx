"use client";

import React from "react";
import { Youtube, Calendar, ArrowUpRight, Share2 } from "lucide-react"; // 'Youtube' 오타 수정 완료
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind 클래스 합치기 유틸리티
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NewsCardProps {
  title: string;
  description: string;
  date: string;
  category: string;
  url: string;
  thumbnail?: string;
}

export default function NewsCard({
  title,
  description,
  date,
  category,
  url,
  thumbnail,
}: NewsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
      <div className="flex flex-col gap-4">
        {/* 썸네일 영역 */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-800">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <Youtube className="h-10 w-10 text-white/20" /> {/* 오타 수정된 아이콘 사용 */}
            </div>
          )}
          <div className="absolute top-2 left-2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {category}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold text-white group-hover:text-indigo-400">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-400">
            {description}
          </p>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-2 flex items-center justify-between">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            자세히 보기
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <button 
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="공유하기"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

