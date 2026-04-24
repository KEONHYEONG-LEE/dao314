import React, { useState, useEffect } from 'react';

const PiLogin = () => {
  const [piId, setPiId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) {
      setPiId(savedId);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    const savedId = localStorage.getItem('pi_user_id');
    
    // 팝업으로 ID 입력 받기
    const inputId = prompt(
      savedId ? `이전 로그인 기록: ${savedId}\n새로운 Pi ID를 입력하거나 확인을 눌러주세요.` : "Pi ID를 입력해주세요.", 
      savedId || ""
    );

    if (inputId) {
      setPiId(inputId);
      localStorage.setItem('pi_user_id', inputId);
      setIsLoggedIn(true);
      alert(`${inputId}님, 반갑습니다!`);
    }
  };

  const handleSupport = () => {
    alert("0.001 Pi 후원을 진행합니다.");
  };

  return (
    <div className="flex items-center gap-2">
      {!isLoggedIn ? (
        <button 
          onClick={handleLoginClick}
          className="flex items-center gap-1.5 bg-[#4A69FF] hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          {/* 2번 이미지 스타일의 로그인 아이콘 */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Login
        </button>
      ) : (
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-gray-300 bg-white/10 px-2 py-1 rounded-md">{piId}</span>
           <button 
            onClick={handleSupport}
            className="bg-[#FF9800] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
          >
            Tip 0.001π
          </button>
        </div>
      )}
    </div>
  );
};

export default PiLogin;
