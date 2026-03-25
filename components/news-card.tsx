"use client";

import { Clock, ExternalLink, Bookmark, Share2, Youtube, Twitter, Facebook, Instagram, Tv, Rss } from "lucide-react";
import Image from "next/image";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceType: "official" | "youtube" | "twitter" | "facebook" | "instagram" | "rss";
  category: string;
  image: string;
  timestamp: string;
  url: string;
  isBreaking?: boolean;
  viewCount?: number;
}

const sourceIcons: Record<string, typeof Tv> = {
  official: Tv,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  rss: Rss,
};

const sourceColors: Record<string, string> = {
  official: "text-red-500 bg-red-500/10",
  youtube: "text-red-600 bg-red-600/10",
  twitter: "text-foreground bg-secondary",
  facebook: "text-blue-600 bg-blue-600/10",
  instagram: "text-pink-500 bg-pink-500/10",
  rss: "text-orange-500 bg-orange-500/10",
};

const categoryColors: Record<string, string> = {
  mainnet: "bg-green-500/10 text-green-600 dark:text-green-400",
  migration: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  kyc: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  ecosystem: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  partnership: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  exchange: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  price: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  mining: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  official: "bg-red-500/10 text-red-600 dark:text-red-400",
  analysis: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

interface NewsCardProps {
  news: NewsItem;
  variant?: "default" | "featured" | "compact";
}

export function NewsCard({ news, variant = "default" }: NewsCardProps) {
  const SourceIcon = sourceIcons[news.sourceType] || Tv;
  const sourceColor = sourceColors[news.sourceType] || "text-muted-foreground bg-secondary";
  const categoryColor = categoryColors[news.category] || "bg-primary/10 text-primary";

  if (variant === "featured") {
    return (
      <article className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl">
        <div className="relative aspect-video">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          {news.isBreaking && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
              BREAKING
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${categoryColor}`}>
                {news.category}
              </span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${sourceColor}`}>
                <SourceIcon className="w-3 h-3" />
                <span>{news.source}</span>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 line-clamp-2 text-balance">
              {news.title}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {news.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{news.timestamp}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors">
                  <ExternalLink className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-3 p-3 bg-card rounded-xl border border-border hover:border-primary/50 transition-all">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${sourceColor}`}>
              <SourceIcon className="w-3 h-3" />
            </div>
            <span className="text-xs text-muted-foreground">{news.timestamp}</span>
          </div>
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
            {news.title}
          </h3>
          <span className="text-xs text-muted-foreground">{news.source}</span>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg">
      <div className="relative aspect-video">
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {news.isBreaking && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            BREAKING
          </div>
        )}
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${sourceColor}`}>
          <SourceIcon className="w-3 h-3" />
          <span className="font-medium">{news.source}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${categoryColor}`}>
            {news.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{news.timestamp}</span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {news.summary}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          {news.viewCount && (
            <span className="text-xs text-muted-foreground">
              조회 {news.viewCount.toLocaleString()}
            </span>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-primary/20 transition-colors">
              <ExternalLink className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
