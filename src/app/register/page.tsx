"use client";

import Decoration from "../components/Decoration";
import WelcomeCard from "../components/WelcomeCard";
import Footer from "../components/Footer";

export default function RegisterPage() {
  return (
    <>
      <main className="center-wrap">
        <div className="center-content">
          <div
            data-image-slot="../public/logo.svg"
            className="logo-slot-floating"
            title="Logo placeholder"
          />
          <WelcomeCard />
        </div>
      </main>
      <Footer />
    </>
  );
}
