import { useEffect } from 'react';
import { usePiNetworkAuthentication } from '../hooks/use-pi-network-authentication';

export default function HomePage() {
  // 훅에서 user, isAuthenticated, isLoading을 모두 가져옵니다.
  const { user, isAuthenticated, isLoading } = usePiNetworkAuthentication();

  useEffect(() => {
    // 1. 아직 SDK가 인증 정보를 로딩 중이라면 아무것도 하지 않고 대기합니다.
    if (isLoading) return;

    // 2. 로딩은 끝났는데 인증이 실패했거나 유저 정보가 없다면 넘어가지 못하게 막습니다.
    if (!isAuthenticated || !user || !user.username) {
      console.log("Pi 네트워크 인증을 기다리고 있거나 실패했습니다.");
      return;
    }

    // 3. Pi ID(username)가 확실하게 존재할 때만 환영 메시지를 띄우고 다음 로직을 실행합니다.
    alert(`${user.username}님, 환영합니다!`);
    
    // 이후 로그인 완료 후 페이지 전환이나 데이터 로드 로직 실행...
    
  }, [isLoading, isAuthenticated, user]);

  // Pi 브라우저에서 인증이 완료될 때까지 로딩 화면을 보여주어 진입을 막습니다.
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Pi Network 로그인 확인 중...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <p>Pi 브라우저를 통해 정상적으로 접속해 주세요.</p>
      </div>
    );
  }

  // 본문 화면 렌더링
  return (
    <div>
      {/* GPNR 메인 콘텐츠 */}
      <h1>GPNR 뉴스룸</h1>
      <p>{user.username}님 로그인됨</p>
    </div>
  );
}
