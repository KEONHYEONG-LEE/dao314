
import React, { useState, useEffect } from 'react';

const PiLogin = () => {
  const [piId, setPiId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 3. 최초 1회 로그인 기억 로직
    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) {
      setPiId(savedId);
    }
  }, []);

  const handleLogin = () => {
    if (!piId) return alert("Pi ID를 입력해주세요.");
    
    const savedId = localStorage.getItem('pi_user_id');
    if (savedId) {
      alert(`이전 로그인 기록이 있습니다: ${savedId}`);
    }

    localStorage.setItem('pi_user_id', piId);
    setIsLoggedIn(true);
    alert(`${piId}님, 로그인되었습니다.`);
  };

  const handleDonate = async () => {
    // 2. 0.001 Pi 후원 기능 (Pi SDK 연동 필요)
    alert("0.001 Pi 후원 결제를 진행합니다.");
    // 실제 Pi SDK 결제 로직이 들어가는 자리입니다.
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {!isLoggedIn ? (
        <>
          <input 
            type="text" 
            placeholder="Pi ID 입력" 
            value={piId} 
            onChange={(e) => setPiId(e.target.value)}
            style={{ color: '#000', padding: '4px', borderRadius: '4px', fontSize: '12px' }}
          />
          <button onClick={handleLogin} style={{ background: '#ffa500', padding: '4px 8px', borderRadius: '4px' }}>
            로그인
          </button>
        </>
      ) : (
        <>
          <span style={{ fontSize: '12px' }}>{piId}님</span>
          <button onClick={handleDonate} style={{ background: '#6200ee', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>
            0.001π 후원
          </button>
        </>
      )}
    </div>
  );
};

export default PiLogin;
