// ... 상단 import 동일

const PiLogin = () => {
  // ... 상태 선언 동일

  useEffect(() => {
    // 1. SDK 로드 확인 및 반복 시도 (SDK가 늦게 로드될 경우 대비)
    const initPi = () => {
      if (window.Pi) {
        window.Pi.init({ version: "2.0", sandbox: true });
        console.log("Pi SDK Initialized");
      } else {
        // SDK가 로드될 때까지 500ms 간격으로 재시도
        setTimeout(initPi, 500);
      }
    };
    initPi();

    // ... 기존 savedId 및 스타일 로직 동일
  }, []);

  const handleSupport = async () => {
    // 디버깅용 알림 추가
    if (!window.Pi) {
      alert("Pi 브라우저가 아니거나 SDK가 로드되지 않았습니다.");
      return;
    }

    if (!isLoggedIn) {
      alert("먼저 로그인 아이콘을 눌러 인증해주세요.");
      return;
    }

    setLoading(true);
    
    try {
      await window.Pi.createPayment({
        amount: 0.001,
        memo: "GPNR 후원 테스트",
        metadata: { orderId: `test-${Date.now()}` },
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("서버 승인 대기중 (ID):", paymentId);
          // 테스트 환경에서는 여기서 바로 승인 처리를 시뮬레이션하거나 
          // 서버 없이 진행할 경우 Pi 가이드를 따라야 합니다.
          alert("결제 승인 단계에 진입했습니다. 잠시만 기다려주세요.");
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          alert(`후원 완료! TXID: ${txid.substring(0, 10)}...`);
          setLoading(false);
        },
        onCancel: (paymentId: string) => {
          setLoading(false);
        },
        onError: (error: Error, payment?: any) => {
          alert(`오류 발생: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (err) {
      alert("결제창을 여는 데 실패했습니다.");
      setLoading(false);
    }
  };

  // ... 나머지 코드 동일
