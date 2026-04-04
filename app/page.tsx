// app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "안녕하세요! 무엇을 도와드릴까요?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 하단으로 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = { id: Date.now(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // (선택 사항) 여기에 답장 로직을 추가할 수 있습니다.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "메시지를 잘 받았습니다!", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border shadow-lg bg-white">
      {/* 헤더 */}
      <div className="p-4 border-b bg-blue-600 text-white font-bold">
        채팅창
      </div>

      {/* 메시지 영역 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.isUser
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white border text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 입력창 영역 */}
      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          전송
        </button>
      </form>
    </div>
  );
}
