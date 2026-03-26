import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Pi Newsroom",
  description: "Pi Network News",
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
