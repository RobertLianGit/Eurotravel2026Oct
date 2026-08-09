import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "欧洲历史旅行手册｜14日互动版",
  description: "一份可以带到现场、随时改写、随时开口讲的欧洲历史旅行手册。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
