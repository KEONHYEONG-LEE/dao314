import { useState, useEffect } from 'react';

// 파이 네트워크 유저 객체 타입 정의
interface PiUser {
  username: string; // 56자리 지갑 주소 또는 KYC ID
  uid?: string;
}

export function usePiNetworkAuthentication() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. 저장된 KYC ID/지갑주소 확인 및 예외 처리 ("undefined", "null" 방어)
    const savedId = localStorage.getItem('gpnr_kyc_id');

    if (
      savedId && 
      savedId !== 'undefined' && 
      savedId !== 'null' && 
      savedId.trim() !== ''
    ) {
      setUser({ username: savedId, uid: savedId });
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      // 잘못되거나 유효하지 않은 값("undefined" 등)이 들어있다면 완전히 제거
      localStorage.removeItem('gpnr_kyc_id');
      setUser(null);
      setIsAuthenticated(false);
    }

    // 2. Pi SDK 자동 인증 시도 (SDK가 정상 작동하고 유효한 ID를 반환할 때만 처리)
    const initializePiAuth = async () => {
      try {
        if (!window.Pi) {
          console.warn("Pi SDK 미발견 - 수동 ID 입력 팝업 모드로 대기합니다.");
          setIsLoading(false);
          return;
        }

        window.Pi.init({ version: "2.0", sandbox: false });

        const scopes = ['username', 'payments', 'wallet_address'];
        const authResult = await window.Pi.authenticate(scopes, (onIncompletePaymentFound) => {
          console.log("미완료 결제 건 발견:", onIncompletePaymentFound);
        });

        if (authResult && authResult.user) {
          const rawId = authResult.user.uid || authResult.user.username || '';
          
          // 가져온 ID가 유효한 경우에만 인증 성공 처리
          if (rawId && rawId !== 'undefined' && rawId !== 'null' && rawId.trim() !== '') {
            setUser({ username: rawId, uid: authResult.user.uid });
            setIsAuthenticated(true);
            localStorage.setItem('gpnr_kyc_id', rawId);
          } else {
            console.warn("Pi SDK 인증 결과의 유저 ID가 유효하지 않습니다. 수동 입력을 요청합니다.");
          }
        }
      } catch (error) {
        console.error("Pi SDK 자동 인증 스킵/오류 - 수동 입력 모드 준비:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePiAuth();
  }, []);

  // [핵심] 팝업에서 유저가 56자리 KYC ID 수동 입력 시 호출하는 로그인 함수
  const loginWithKycId = (kycId: string) => {
    const cleanId = kycId.trim();
    
    if (!cleanId || cleanId === 'undefined' || cleanId === 'null') {
      return false;
    }

    localStorage.setItem('gpnr_kyc_id', cleanId);
    setUser({ username: cleanId, uid: cleanId });
    setIsAuthenticated(true);
    return true;
  };

  // 로그아웃 / ID 재설정
  const logout = () => {
    localStorage.removeItem('gpnr_kyc_id');
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, isLoading, loginWithKycId, logout };
}
