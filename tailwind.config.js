/** @type {import('tailwindcss').Config} */
module.exports = {
  // 다크모드 시스템 설정과 충돌하여 화면이 하얗게 변하는 것을 방지합니다.
  darkMode: 'class', 
  
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 구형 브라우저에서 읽지 못할 수 있는 커스텀 변수 확장을 최소화합니다.
      colors: {
        // 혹시 코드 내에 남아있을지 모르는 변수들을 표준 색상으로 강제 매핑합니다.
        background: "#ffffff",
        foreground: "#000000",
      },
    },
  },
  plugins: [
    // 카테고리 탭의 스크롤바를 깔끔하게 숨기기 위해 추가합니다.
    require('tailwind-scrollbar-hide'),
  ],
}
