import { useState, useEffect, useCallback } from 'react';

// window.Pi 객체 타입 정의 (TypeScript 지원)
declare global {
  interface Window {
    Pi?: any;
  }
}

// 파이 네트워크 유저 객체 타입 정의
export interface PiUser {
  username: string; // 56자리 지갑 주소 또는 KYC ID / Username
  uid?: string;
}

export function usePiNetworkAuthentication() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ID 유효성 검증 헬퍼 함수 (undefined, null, 빈문자열 엄격 체크)
  const isValidId = (id: any): id is string => {
    if (!id) return false;
    const str = String(id).trim();
    return str !== '' && str !== 'undefined' && str !== 'null' && str !== '[object Object]';
  };

  // 미완료 결제 건 처리 함수
  const handleIncompletePayment = useCallback(async (payment: any) => {
    console.log("미완료 결제 건 발견 및 처리 시도:", payment);
    try {
      // 필요 시 백엔드 API 호출하여 미완료 결제 완료 처리
    } catch (err) {
      console.error("미완료 결제 처리 중 오류 발생:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. 저장된 KYC ID/지갑주소 검증 및 로드
    const rawSavedId = localStorage.getItem('gpnr_kyc_id') || localStorage.getItem('walletAddress');

    if (isValidId(rawSavedId)) {
      const cleanSavedId = rawSavedId.trim();
      setUser({ username: cleanSavedId, uid: cleanSavedId });
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      // 잘못된 값('undefined' 문자열 등)이 저장되어 있다면 강제 삭제
      localStorage.removeItem('gpnr_kyc_id');
      localStorage.removeItem('walletAddress');
      setUser(null);
      setIsAuthenticated(false);
    }

    // 2. Pi SDK 자동 인증 시도
    const initializePiAuth = async () => {
      try {
        if (!window.Pi) {
          console.warn("Pi SDK 미발견 - 수동 ID 입력 팝업 모드로 대기합니다.");
          setIsLoading(false);
          return;
        }

        // Pi SDK 초기화
        window.Pi.init({ version: "2.0", sandbox: false });

        const scopes = ['username', 'payments', 'wallet_address'];
        const authResult = await window.Pi.authenticate(
          scopes, 
          handleIncompletePayment
        );

        if (authResult && authResult.user) {
          // SDK 결과값에서 유효한 username 또는 uid 추출
          const extractedId = authResult.user.username || authResult.user.uid;
          
          if (isValidId(extractedId)) {
            const cleanId = extractedId.trim();
            setUser({ username: cleanId, uid: authResult.user.uid || cleanId });
            setIsAuthenticated(true);
            localStorage.setItem('gpnr_kyc_id', cleanId);
            localStorage.setItem('walletAddress', cleanId);
          }
        }
      } catch (error) {
        console.error("Pi SDK 자동 인증 스킵/오류 - 수동 입력 모드 준비:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePiAuth();
  }, [handleIncompletePayment]);

  // 수동 입력 로그인 처리 함수 (KYC ID / 지갑주소 공통)
  const loginWithKycId = (kycId: string) => {
    if (!isValidId(kycId)) {
      return false;
    }

    const cleanId = kycId.trim();

    localStorage.setItem('gpnr_kyc_id', cleanId);
    localStorage.setItem('walletAddress', cleanId);
    setUser({ username: cleanId, uid: cleanId });
    setIsAuthenticated(true);
    return true;
  };

  // 로그아웃 / ID 재설정
  const logout = () => {
    localStorage.removeItem('gpnr_kyc_id');
    localStorage.removeItem('walletAddress');
    setUser(null);
    setIsAuthenticated(false);
  };

  return { 
    user, 
    isAuthenticated, 
    isLoading, 
    loginWithKycId, 
    loginWithAddress: loginWithKycId, 
    logout 
  };
}
