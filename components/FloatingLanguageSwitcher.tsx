"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
];

export function FloatingLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const addScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const s = document.createElement("script");
        s.id = "google-translate-script";
        s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        s.async = true;
        document.body.appendChild(s);
      }
    };
    window.googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "ko,en", autoDisplay: false },
        "google_translate_element"
      );
    };
    addScript();
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change"));
    }
    setCurrentLang(langCode);
    setIsOpen(false);
  };

  return (
    <>
      <div id="google_translate_element" className="hidden invisible"></div>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {isOpen && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 w-32 mb-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors",
                  currentLang === lang.code ? "text-blue-600" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 h-12 px-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all active:scale-95 shadow-blue-500/40"
        >
          <Globe className="h-5 w-5" />
          <span className="text-sm font-bold">Language</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
      </div>
    </>
  );
}

