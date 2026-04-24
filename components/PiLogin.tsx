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
    const inputId = prompt(
      savedId ? `이전 기록: ${savedId.substring(0, 10)}...` : "Pi ID를 입력해주세요.", 
      savedId || ""
    );

    if (inputId) {
      setPiId(inputId);
      localStorage.setItem('pi_user_id', inputId);
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {!isLoggedIn ? (
        <button 
          onClick={handleLoginClick}
          className="flex items-center gap-1 bg-[#4A69FF] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Login
        </button>
      ) : (
        <div className="flex items-center gap-2">
           {/* ID가 길어도 작게 표시되도록 너비 제한 */}
           <div className="flex items-center gap-1 bg-white/10 px-2 py-1.5 rounded-lg border border-white/20">
             <span className="text-[10px] text-green-400 font-bold">●</span>
             <span className="text-[10px] text-white max-w-[50px] truncate">{piId}</span>
           </div>
           <button 
            onClick={() => alert("0.001 Pi 후원을 진행합니다.")}
            className="bg-[#FF9800] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95"
          >
            Tip
          </button>
        </div>
      )}
    </div>
  );
};

export default PiLogin;
