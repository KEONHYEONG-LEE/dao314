import Header from "../components/header";
import GPNRHeader from "../components/gpnr-header";
import BreakingNews from "../components/breaking-news";
import FeaturedNews from "../components/featured-news";
import CategoryTabs from "../components/category-tabs";
import LatestNews from "../components/latest-news";
import TrendingSidebar from "../components/trending-sidebar";
import CategoryNews from "../components/category-news";
import NewsFeed from "../components/news-feed";
import Newsletter from "../components/newsletter";
import Footer from "../components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <GPNRHeader />
      <Header />
      <div className="container mx-auto px-4 py-6">
        <BreakingNews />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-8">
            <FeaturedNews />
            <CategoryTabs />
            <NewsFeed />
          </div>
          <aside className="lg:col-span-4">
            <TrendingSidebar />
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}
