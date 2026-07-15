import { useState, useEffect } from 'react';

export const usePiNetworkAuthentication = () => {
  // 기본값을 'unknown' 대신 객체 구조로 안전하게 초기화합니다.
  const [user, setUser] = useState<{ username: string; uid: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 10; // Pi SDK 로드를 기다리는 최대 횟수 (10회 * 500ms = 5초)

    const authenticatePi = async () => {
      // 1. window.Pi (SDK)가 로드될 때까지 안전하게 대기하는 헬퍼 함수
      const getPiSDK = (): any => {
        if (typeof window !== 'undefined' && (window as any).Pi) {
          return (window as any).Pi;
        }
        return null;
      };

      const waitForSDKAndAuth = async () => {
        const Pi = getPiSDK();

        if (!Pi) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(waitForSDKAndAuth, 500); // 0.5초 후 재시도
          } else {
            console.error('Pi SDK를 로드하지 못했습니다. Pi 브라우저에서 실행 중인지 확인하세요.');
            if (isMounted) setIsLoading(false);
          }
          return;
        }

        try {
          const scopes = ['username', 'payments'];
          const onIncompletePaymentFound = (payment: any) => {
            console.log('미완료 결제 발견:', payment);
            // 필요 시 결제 승인 API 호출 로직 추가 가능
          };

          // SDK 인증 요청
          const authResponse = await Pi.authenticate(scopes, onIncompletePaymentFound);
          
          if (authResponse && authResponse.user) {
            if (isMounted) {
              // 2. KYC 인증을 마친 정상 유저의 정보를 상태에 자동 저장
              setUser({
                username: authResponse.user.username, // kyc 인증 유저네임
                uid: authResponse.user.uid            // 고유 식별 주소
              });
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error('Pi Auth Failed:', error);
          if (isMounted) {
            setIsAuthenticated(false);
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      waitForSDKAndAuth();
    };

    authenticatePi();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, isAuthenticated, isLoading };
};
