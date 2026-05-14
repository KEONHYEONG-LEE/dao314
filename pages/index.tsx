  useEffect(() => {
    // [보안관 퇴근, 안내원으로 교체] 구글 번역 UI만 조용히 숨깁니다.
    const hideGoogleBar = () => {
      if (typeof document === "undefined") return;

      // 1. body와 html 위치 강제 고정 (화면 밀림 방지)
      document.body.style.top = "0px";
      document.documentElement.style.setProperty("padding-top", "0px", "important");

      // 2. 구글 번역 UI 요소들을 삭제하지 않고 '숨기기'만 합니다.
      const googleElements = document.querySelectorAll<HTMLElement>(
        '.goog-te-banner-frame, .goog-te-banner, .skiptranslate, iframe[id*="goog"]'
      );
      
      googleElements.forEach(el => {
        // 우리가 만든 하단 언어 선택 버튼(FloatingLanguageSwitcher)은 제외
        if (!el.classList.contains('fixed')) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.height = '0';
        }
      });
    };

    // 0.5초마다 체크 (너무 자주 하면 성능에 좋지 않으니 주기를 늘렸습니다)
    const interval = setInterval(hideGoogleBar, 500);
    hideGoogleBar();

    return () => clearInterval(interval);
  }, []);
