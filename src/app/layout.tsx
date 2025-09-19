import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/app/redux/ReduxProvider";
import AuthInitializer from "@/components/AuthInitializer";

export const metadata: Metadata = {
  title: "Pakistan Education Portal",
  description: "Green Common-App style start screen (First-year / Graduate).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="main-wrap">
        <ReduxProvider>
          <AuthInitializer />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
