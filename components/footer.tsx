import Link from "next/link";
import { Globe, Twitter, Facebook, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  뉴스: ["정치", "경제", "기술", "스포츠", "문화", "국제"],
  서비스: ["뉴스레터", "모바일 앱", "RSS 피드", "API"],
  회사: ["회사 소개", "채용", "광고 문의", "제휴"],
  지원: ["고객센터", "자주 묻는 질문", "이용약관", "개인정보처리방침"],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-accent" />
              <span className="text-lg font-bold">GPNR</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              전 세계의 최신 뉴스를 실시간으로 전달합니다.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 GPNR. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              이용약관
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              쿠키 설정
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
