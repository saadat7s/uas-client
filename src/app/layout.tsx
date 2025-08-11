import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pakistan Education Portal",
  description: "Green Common-App style start screen (First-year / Graduate).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="main-wrap">{children}</body>
    </html>
  );
}
