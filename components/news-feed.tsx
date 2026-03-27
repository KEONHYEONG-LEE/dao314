import NewsCard from "./news-card";

export default function NewsFeed() {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Latest News</h2>
      <div className="space-y-6">
        {/* 뉴스 데이터가 연결되기 전, 샘플 카드를 띄웁니다 */}
        <NewsCard 
          category="Technology"
          title="Pi Network's GPNR App continues to expand its ecosystem"
          excerpt="The Global Pi Newsroom (GPNR) provides real-time updates for Pioneers worldwide..."
          author="GPNR Staff"
          date="Oct 24, 2025"
          image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"
        />
        <NewsCard 
          category="Economy"
          title="Global Consensus Value (GCV) movements gaining momentum"
          excerpt="Community leaders discuss the future valuation of Pi within the global market..."
          author="Eco Analyst"
          date="Oct 23, 2025"
          image="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60"
        />
      </div>
    </section>
  );
}
