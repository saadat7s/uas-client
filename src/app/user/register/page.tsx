"use client";

import Image from "next/image";
import WelcomeCard from "@/components/WelcomeCard";
import Footer from "@/components/Footer";
import logo from "@/public/Logo.png";

export default function RegisterPage() {
  return (
    <>
      <main className="center-wrap with-mandala with-minar" role="main">
        <div className="center-content">
          <div className="logo-slot-floating">
            <Image
              src={logo}
              alt="PUCAS logo"
              width={200}
              height={200}
              priority
            />
          </div>
          <WelcomeCard />
        </div>
      </main>
      <Footer />
    </>
  );
}
