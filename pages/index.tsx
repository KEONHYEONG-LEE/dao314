// index.tsx의 Home 함수 내부 수정

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 1. 카테고리 상태 추가 (기본값 "all")
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getComponent = (module: any) => {
    if (!module) return null;
    return module.default || Object.values(module).find(val => typeof val === 'function' || typeof val === 'object');
  };

  const NewsFeed = getComponent(NewsModule);
  const Footer = getComponent(FooterModule);

  // ... handlePiLogin 생략 ...

  return (
    <div className="min-h-screen bg-white text-black">
      <Header onLogin={handlePiLogin} isLoggedIn={isLoggedIn} />
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          {/* 2. 카테고리 변경 함수 전달 (CategoryTabs 내부 구현에 따라 다를 수 있음) */}
          <CategoryTabs onCategoryChange={setSelectedCategory} />
        </section>

        <section>
          {/* 3. NewsFeed에 selectedCategory 전달 */}
          {NewsFeed ? (
            <NewsFeed selectedCategory={selectedCategory} />
          ) : (
            <div className="py-10 text-center">뉴스를 불러올 수 없습니다.</div>
          )}
        </section>
      </main>

      {Footer && <Footer />}
    </div>
  );
}
