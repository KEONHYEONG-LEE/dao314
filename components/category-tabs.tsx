"use client"; 

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 

const categories = [
  { id: "all", label: "ALL" },
  { id: "mainnet", label: "MAINNET" },
  { id: "community", label: "COMMUNITY" },
  { id: "commerce", label: "COMMERCE" },
  { id: "node", label: "NODE" },
  { id: "mining", label: "MINING" },
  { id: "wallet", label: "WALLET" },
  { id: "browser", label: "BROWSER" },
  { id: "kyc", label: "KYC" },
  { id: "developer", label: "DEVELOPER" },
  { id: "ecosystem", label: "ECOSYSTEM" },
  { id: "listing", label: "LISTING" },
  { id: "price", label: "PRICE" },
  { id: "security", label: "SECURITY" },
  { id: "event", label: "EVENT" },
  { id: "roadmap", label: "ROADMAP" },
  { id: "whitepaper", label: "WHITEPAPER" },
  { id: "legal", label: "LEGAL" }
]; 

export function CategoryTabs({ 
  selectedCategory, 
  onCategoryChange 
}: { 
  selectedCategory: string; 
  onCategoryChange: (category: string) => void; 
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true); 

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth -
