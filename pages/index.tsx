"use client";

import { useState, useRef } from "react";
import { Header } from "../components/Header"; 
import { CategoryTabs } from "../components/category-tabs";
import NewsFeed from "../components/news-feed";

// 달력 관련 카테고리(events)를 완전히 제외한 17개 고유 ID 스키마 매핑
const CATEGORIES = [
  "all", "mainnet", "node", "mining", "wallet", "browser", 
  "roadmap", "whitepaper", "community", "commerce", "kyc", 
  "developer", "ecosystem", "outlook", "price", "security", 
  "legal"
];

// [신규] 실시간 파이 생태계 데이터 (흐르는 배너용 데이터)
const PI_STATS = [
  "🔥 오픈 메인넷 카운트다운 진행 중",
  "🖥️ 글로벌 활성 노드 수: 250,000+ 돌파",
  "🆔 KYC 마이그레이션 누적 1,200만 명 통과",
  "👛 파이 지갑 총 생성 수: 3,500만 개 이상",
  "🛒 글로벌 GCV 커머스 생태계 결제 매장 확대 중",
  "🛡️ 파이 네트워크 V24 코어 보안 프로토콜 업데이트 완료"
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  // --- 스와이프 로직 최적화 (불완전한 import 구문 제거 및 정석 useRef 도입) ---
  const sXRef = useRef<number | null>(null);
  const eXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    sXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    eXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (sXRef.current === null || eXRef.current === null) return;
    const distance = sXRef.current - eXRef.current;
    const currentIndex = CATEGORIES.indexOf(activeCategory);

    if (currentIndex === -1) return;

    if (distance > 75 && currentIndex < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIndex + 1]);
    } else if (distance < -75 && currentIndex > 0) {
      setActiveCategory(CATEGORIES[currentIndex - 1]);
    }

    sXRef.current = null;
    eXRef.current = null;
  };

  return (
    <main 
      className="min-h-screen bg-[#0f172a] text-slate-100 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 글로벌
