import Image from "next/image";
import minar from "@/public/minarepakistan.png";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      {/* Baseline at the very bottom */}
      <div className="footer-divider" aria-hidden />

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
