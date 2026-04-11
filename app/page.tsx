{/* 8번 뉴스 상세 페이지 강화 버전 */}
{selectedNews && user && (
  <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl relative animate-in slide-in-from-bottom-20 duration-500 ease-out no-scrollbar">
      
      {/* 상단 헤더: 카테고리와 닫기 버튼 */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md p-5 flex justify-between items-center border-b z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
          <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">{selectedNews.category}</span>
        </div>
        <button 
          onClick={() => setSelectedNews(null)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200"
        >
          <X size={24} className="text-gray-400" />
        </button>
      </div>
      
      <div className="p-6 sm:p-8">
        {/* 메인 이미지: 가독성을 위해 라운딩 및 쉐도우 강화 */}
        <div className="relative group mb-8">
          <img 
            src={selectedNews.image} 
            className="w-full h-72 sm:h-96 object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" 
            alt="detail" 
          />
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-black/10"></div>
        </div>

        {/* 제목 및 메타 정보 */}
        <h2 className="text-2xl sm:text-3xl font-black mb-6 leading-tight text-gray-900 tracking-tight">
          {selectedNews.title}
        </h2>
        
        <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              {selectedNews.author ? selectedNews.author[0] : 'G'}
            </div>
            <div>
              <p className="font-bold text-gray-800">{selectedNews.author || "GPNR Reporter"}</p>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">{selectedNews.date}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600"><Heart size={20}/></button>
            <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600"><Bell size={20}/></button>
          </div>
        </div>
        
        {/* 본문 콘텐츠 영역 */}
        <div className="text-gray-700 leading-relaxed space-y-6 text-lg mb-10">
          {/* AI 요약 하이라이트 섹션 (신규 추가) */}
          <div className="bg-indigo-50/50 border-l-4 border-indigo-500 p-5 rounded-r-2xl mb-8">
            <p className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-widest">AI Quick Summary</p>
            <p className="text-base text-indigo-900 font-medium leading-normal">
              {selectedNews.description}
            </p>
          </div>

          <p className="font-normal text-gray-800">
            {/* 실제 뉴스 본문이 들어가는 자리 (현재는 데이터에 본문 필드가 있다고 가정) */}
            {selectedNews.content || "상세 뉴스를 분석 중입니다. 파이 네트워크 생태계의 최신 데이터를 바탕으로 실시간 업데이트가 진행되고 있습니다."}
          </p>
          
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-10" />
          
          <p className="text-sm text-gray-400 italic font-medium leading-relaxed bg-gray-50 p-4 rounded-xl">
            * 본 기사는 GPNR AI 엔진이 전 세계 Pi 관련 소식을 실시간으로 수집하여 요약한 것입니다. 원문과의 차이가 있을 수 있으므로 중요한 결정 시 공식 채널을 확인하시기 바랍니다.
          </p>
        </div>

        {/* 하단 액션 버튼 영역 */}
        <div className="flex flex-col gap-3 mb-10">
          <button 
            onClick={() => { setIsChatOpen(true); setChatHistory([]); }}
            className="w-full bg-white text-indigo-600 border-2 border-indigo-600 py-5 rounded-[1.5rem] font-black hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg shadow-sm"
          >
            <MessageSquare size={22} />
            {currentT.ai_assistant}와 심층 토론하기
          </button>
          
          <button 
            onClick={() => window.open(selectedNews.url, '_blank')}
            className="w-full bg-[#0D1B3E] text-white py-5 rounded-[1.5rem] font-black hover:bg-indigo-900 transition-all shadow-[0_10px_20px_-5px_rgba(13,27,62,0.3)] active:scale-95 text-lg flex items-center justify-center gap-2"
          >
            {currentT.read_more}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
