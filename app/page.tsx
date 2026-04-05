  const handleSupportClick = async () => {
    if (typeof window !== "undefined" && window.Pi) {
      try {
        console.log("인증 시도 중...");
        
        // 인증 옵션을 명확히 전달하여 파이 브라우저의 로그인 팝업을 강제합니다.
        const auth = await window.Pi.authenticate(['payments', 'username'], 
          (payment: any) => {
            console.log("미완료 결제 발견:", payment);
            // 만약 이전 결제가 중단되었다면 여기서 처리 로직이 필요할 수 있습니다.
          }
        );

        console.log("인증 성공:", auth.user.username);
        setUser({ username: auth.user.username, uid: auth.user.uid });

        // 로그인 성공 후 바로 결제창 호출
        await startPayment();

      } catch (err: any) {
        console.error("인증 상세 에러:", err);
        // 에러가 발생하면 사용자에게 더 상세한 정보를 제공합니다.
        alert(`로그인 실패: ${err.message || "파이 브라우저 설정 혹은 네트워크를 확인하세요."}`);
      }
    } else {
      alert("Pi SDK를 로드할 수 없습니다. 파이 브라우저인지 확인해 주세요.");
    }
  };
