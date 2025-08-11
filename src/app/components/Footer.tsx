import Image from "next/image";
import minar from "@/public/minarepakistan.png";
import mandala from "@/public/mandala.png";

export default function Footer() {
  return (
    <footer className="footer relative">

      {/* Decorations on the footer line */}
      <div className="absolute -top-20 left-12">
        <Image
          src={minar}
          alt="Minar-e-Pakistan"
          width={170}
          height={170}
          priority
        />
      </div>

      <div className="absolute -top-16 right-12 animate-float">
        <Image
          src={mandala}
          alt="Mandala Design"
          width={150}
          height={150}
          priority
        />
      </div>

      {/* Footer links */}
      <nav className="footer-links" aria-label="footer">
        <a href="#" className="footer-link">Need help?</a>
        <a href="#" className="footer-link">System requirements</a>
        <a href="#" className="footer-link">Accessibility information</a>
        <a href="#" className="footer-link">Terms of use</a>
        <a href="#" className="footer-link">Privacy policy</a>
      </nav>
      {/* Divider line */}
      <div className="absolute top-1 left-0 w-full border-t border-gray-300"></div>
      <small className="block text-center" style={{ color: "#0d3a35", opacity: ".8" }}>
        © 2025 Pakistan Education Portal
      </small>
    </footer>
  );
}
