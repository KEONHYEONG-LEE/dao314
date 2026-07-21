import { useState, useEffect } from 'react';

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

    // 1. 저장된 KYC ID/지갑주소 확인 (기존 입력 이력 유효성 체크)
    const savedId = localStorage.getItem('gpnr_kyc_id');
    if (savedId) {
      setUser({ username: savedId, uid: savedId });
      setIsAuthenticated(true);
    }

    const initializePiAuth = async () => {
      try {
        if (!window.Pi) {
          console.warn("Pi SDK 미발견 - 수동 ID 입력 모드로 대기합니다.");
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
          if (rawId) {
            setUser({ username: rawId, uid: authResult.user.uid });
            setIsAuthenticated(true);
            localStorage.setItem('gpnr_kyc_id', rawId);
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
    if (!cleanId) return false;

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
