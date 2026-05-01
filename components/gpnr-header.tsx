// components/Header.tsx

// ... 기존 import 생략
import { useCallback } from "react";

export function Header() {
  // 후원 처리 함수
  const handleDonation = useCallback(async () => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      try {
        const payment = await (window as any).Pi.createPayment({
          amount: 0.001,
          memo: "GPNR 서비스 후원", // 사용자 지갑에 표시될 메시지
          metadata: { type: "one-time-donation", app: "GPNR" }
        }, {
          // 승인 단계
          onReadyForServerApproval: (paymentId: string) => {
            fetch('/api/payments/approve', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId }) 
            });
          },
          // 완료 단계
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            fetch('/api/payments/complete', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid }) 
            });
            alert("0.001 Pi 후원이 완료되었습니다. 감사합니다!");
          },
          onCancel: (paymentId: string) => console.log("후원 취소됨"),
          onError: (error: Error) => console.error("결제 오류:", error),
        });
      } catch (err) {
        console.error("Pi SDK 결제 실행 실패:", err);
      }
    } else {
      alert("Pi Browser에서 접속하거나 SDK 로딩을 확인해주세요.");
    }
  }, []);

  return (
    // ... 기존 헤더 코드 중 π 0.001 버튼 부분 찾기
    // 예시: <button className="...">π 0.001</button>
    // 아래와 같이 onClick을 추가합니다.
    <button 
      onClick={handleDonation} 
      className="flex items-center gap-1 bg-[#f7a145]/20 text-[#f7a145] px-3 py-1 rounded-full border border-[#f7a145]/30 hover:bg-[#f7a145]/30 transition-colors"
    >
      <span>π</span>
      <span>0.001</span>
    </button>
  );
}
