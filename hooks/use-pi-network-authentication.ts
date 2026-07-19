import { useState, useEffect } from 'react';

// 파이 네트워크 유저 객체 타입 정의
interface PiUser {
  username: string; // 56자리 지갑 주소/UID가 들어갈 자리
  uid?: string;
}

export function usePiNetworkAuthentication() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 브라우저 환경이 아닐 경우 예외 처리
    if (typeof window === 'undefined') return;

    const initializePiAuth = async () => {
      try {
        // 1. 파이 브라우저 및 SDK 로드 확인
        if (!window.Pi) {
          console.warn("Pi SDK를 찾을 수 없습니다. 파이 브라우저로 접속 중인지 확인하세요.");
          setIsLoading(false);
          return;
        }

        // 파이 SDK 초기화 (샌드박스 플래그는 환경에 맞게 조절 가능)
        window.Pi.init({ version: "2.0", sandbox: false });

        // 2. 파이 네트워크 인증 스트림 시작
        const scopes = ['username', 'payments', 'wallet_address'];
        
        const authResult = await window.Pi.authenticate(scopes, (onIncompletePaymentFound) => {
          console.log("미완료된 결제 발견:", onIncompletePaymentFound);
        });

        // 3. 인증 성공 시 데이터 매핑
        if (authResult && authResult.user) {
          // SDK 버전에 따라 uid, username, 혹은 wallet_address 중 56자리 값을 낚아챕니다.
          const rawId = authResult.user.uid || authResult.user.username || '';
          
          if (rawId) {
            setUser({
              // 메인 페이지에서 혼선이 없도록 56자리 긴 ID를 username 필드에 강제로 할당합니다.
              username: rawId, 
              uid: authResult.user.uid
            });
            setIsAuthenticated(true);
          } else {
            console.error("인증은 성공했으나 유저 식별자(ID)를 추출할 수 없습니다.");
          }
        }
      } catch (error) {
        console.error("Pi Network 인증 중 오류 발생:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializePiAuth();
  }, []);

  return { user, isAuthenticated, isLoading };
}
