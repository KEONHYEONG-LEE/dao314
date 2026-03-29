import Header from "@/components/header"; // 또는 gpnr-header

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <main className="min-h-screen bg-background">
      <Header /> {/* 상단 헤더 추가 */}
      <CategoryTabs 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      <div className="max-w-7xl mx-auto">
        <NewsFeed selectedCategory={selectedCategory} />
      </div>
    </main>
  );
}
