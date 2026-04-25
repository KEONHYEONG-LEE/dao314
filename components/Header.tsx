"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search, Globe, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Politics", href: "/politics" },
  { name: "Economy", href: "/economy" },
  { name: "Tech", href: "/tech" },
  { name: "Sports", href: "/sports" },
  { name: "Culture", href: "/culture" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "Korean" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false); 
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'ko,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    addGoogleTranslateScript();
  }, []);

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    setIsLangOpen(false);
    
    const translateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (translateCombo) {
      translateCombo.value = lang.code;
      translateCombo.dispatchEvent(new Event('change'));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div id="google_translate_element" className="absolute opacity-0 pointer-events-none" style={{ visibility: 'hidden' }}></div>
      
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate, .goog-te-gadget-icon { display: none !important; }
        body { top: 0px !important; }
        .goog-tooltip { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; }
      `}</style>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items
