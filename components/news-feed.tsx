// NewsFeed.tsx 수정 제안
useEffect(() => {
  const allNews: NewsItem[] = [
    {
      id: "1",
      category: "mainnet",
      title: "Pi Network Mainnet Migration Update",
      excerpt: "The latest news on the Open Mainnet preparation...",
      author: "GPNR AI",
      date: "2026-03-29",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800"
    }
  ];

  // async 없이 바로 setNews 호출 (안정성 확보)
  const filtered = allNews.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  );
  setNews(filtered);
}, [selectedCategory]);
