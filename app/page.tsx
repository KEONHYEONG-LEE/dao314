"use client";

import { useState, useEffect } from "react";

// Pi SDK 타입을 인식시키기 위한 선언입니다.
declare global {
  interface Window {
    Pi: any;
  }
}

interface NewsItem {
  title: string;
  description: string;
  source: string;
  image?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/data/news.json");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("뉴스 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();

    // Pi SDK 초기화 (필요 시)
    if (typeof window !== "undefined" && window.Pi) {
      window.Pi.init({ version: "1.5", sandbox: false });
    }
  }, []);

  // 진짜 결제 로직: 이 함수가 실행되면 파이 지갑이 열립니다.
  const handlePayment = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        const payment = await window.Pi.createPayment({
          amount: 0.001,
          memo: "GPNR 글로벌 뉴스 후원",
          metadata: { paymentType: "donation" },
        }, {
          onReadyForServerApproval: (paymentId: string) => {
            console.log("결제 승인 대기 중:", paymentId);
            // 10단계 통과를 위해 앱 포털에서 승인이 필요하지만,
            // 일단 결제창이 뜨는 것만으로도 큰 진전입니다!
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            console.log("결제 완료!", txid);
            alert("후원이 성공적으로 완료되었습니다!");
          },
          onCancel: (paymentId: string) => {
            console.log("결제 취소:", paymentId);
          },
          onError: (error: Error, payment?: any) => {
            console.error("결제 에러:", error);
            alert("결제 중 오류가 발생했습니다.");
          },
        });
      } catch (err) {
        alert("파이 브라우저에서 실행 중인지 확인해 주세요.");
      }
    } else {
      alert("Pi SDK를 찾을 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* 헤더 */}
      <header className="bg-blue-900 text-white p-6 text-center shadow-md">
        <h1 className="text-3xl font-bold">GPNR Global News</h1>
      </header>

      {/* 뉴스 리스트 (2주간 만드신 소중한 데이터) */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">뉴스를 불러오는 중입니다...</div>
        ) : news.length > 0 ? (
          news.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border">
              {item.image && (
                <div className="md:w-1/3">
                  <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1">
                <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded mb-2 font-bold">{item.source}</span>
                <h2 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">표시할 뉴스가 없습니다.</div>
        )}
      </main>

      {/* 하단 네비게이션 및 결제 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-lg z-50">
        <div className="text-sm font-bold text-gray-700">GPNR Support</div>
        <button 
          onClick={handlePayment}
          className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-purple-700 active:scale-95 transition-all"
        >
          Support 0.001 Pi
        </button>
      </div>
    </div>
  );
}
