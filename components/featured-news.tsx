"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";

// 원본 데이터 (실제 운영 시 영문 데이터가 들어온다고 가정)
const initialFeaturedArticle = {
  id: 1,
  title: "Pi Network Open Mainnet Transition: A New Turning Point for Global Crypto Market",
  description: "Pi Network is on the verge of transitioning to the Open Mainnet. GPNR delivers this historic moment in real-time, watched by millions of pioneers worldwide.",
  image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop",
  category: "Tech",
  date: "March 24, 2026",
  readTime: "5 min",
};

const initialSecondaryArticles = [
  {
    id: 2,
    title: "Global Climate Summit Held: Agreement Reached on Carbon Neutral 2040 Target",
    image: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&h=400&fit=crop",
    category: "Politics",
    date: "March 24, 2026",
  },
  {
    id: 3,
    title: "AI Technology Revolution Opens New Possibilities in Healthcare",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
    category: "Tech",
    date: "March 23, 2026",
  },
  {
    id: 4,
    title: "World Economic Outlook: 3.5% Growth Expected in 2026",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    category: "Economy",
    date: "March 23, 2026",
  },
];

export function FeaturedNews() {
  const [featured, setFeatured] = useState(initialFeaturedArticle);
  const [secondary, setSecondary] = useState(initialSecondaryArticles);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateText = async (text: string) => {
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        return data[0].map((x: any) => x[0]).join("");
      } catch {
        return text;
      }
    };

    const handleTranslation = async () => {
      const targetLang = localStorage.getItem("gpnr-language");
      if (targetLang === "ko") {
        setIsTranslating(true);
        // 메인 기사 번역
        const fTitle = await translateText(initialFeaturedArticle.title);
        const fDesc = await translateText(initialFeaturedArticle.description);
        setFeatured(prev => ({ ...prev, title: fTitle, description: fDesc }));

        // 서브 기사들 번역
        const translatedSecondary = await Promise.all(
          initialSecondaryArticles.map(async (art) => ({
            ...art,
            title: await translateText(art.title)
          }))
        );
        setSecondary(translatedSecondary);
        setIsTranslating(false);
      } else {
        setFeatured(initialFeaturedArticle);
        setSecondary(initialSecondaryArticles);
      }
    };

    handleTranslation();
    window.addEventListener("languageChange", handleTranslation);
    return () => window.removeEventListener("languageChange", handleTranslation);
  }, []);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold uppercase tracking-tight">Featured News</h2>
        </div>
        <Link href="/featured" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-600 transition-colors">
          More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Article */}
        <Link href={`/news/${featured.id}`} className="lg:col-span-2 group">
          <article className="relative h-[400px] lg:h-full rounded-xl overflow-hidden shadow-lg">
            <Image src={featured.image} alt="Featured" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold bg-blue-600 text-white rounded-full uppercase">
                {featured.category}
              </span>
              <h3 className="text-xl lg:text-2xl font-bold mb-2 line-clamp-2">
                {isTranslating ? "Translating..." : featured.title}
              </h3>
              <p className="text-sm text-gray-200 mb-3 line-clamp-2 hidden sm:block">
                {featured.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-300">
                <span>{featured.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime}</span>
              </div>
            </div>
          </article>
        </Link>

        {/* Secondary Articles */}
        <div className="flex flex-col gap-4">
          {secondary.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`} className="group">
              <article className="flex gap-4 p-3 rounded-lg bg-card hover:bg-secondary transition-colors border border-border/40">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image src={article.image} alt="Thumbnail" fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[10px] text-blue-600 font-bold mb-1 uppercase">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {isTranslating ? "..." : article.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {article.date}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
