// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Global Pi Newsroom',
  description: 'News for Pi Network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
