import Image from "next/image";
import minar from "@/public/minarepakistan.png";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      {/* Baseline at the very bottom */}
      <div className="footer-divider" aria-hidden />

      {/* Minar sits ON the baseline; softly blended; subtly follows cursor */}
      <div className="footer-decor footer-decor-left" aria-hidden>
        <Image
          src={minar}
          alt="Minar-e-Pakistan"
          width={340}
          height={340}
          className="blend-soft parallax-minar"
          priority
        />
      </div>

      <nav className="footer-links" aria-label="Footer links">
        <a href="#" className="footer-link">Need help?</a>
        <a href="#" className="footer-link">System requirements</a>
        <a href="#" className="footer-link">Accessibility information</a>
        <a href="#" className="footer-link">Terms of use</a>
        <a href="#" className="footer-link">Privacy policy</a>
      </nav>

      <small>© 2025 Pakistan Education Portal</small>
    </footer>
  );
}
