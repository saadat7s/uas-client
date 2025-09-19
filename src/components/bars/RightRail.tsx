// components/application/RightRail.tsx
export default function RightRail() {
  return (
    <aside className="right-rail app-right">
      <div className="main-card main-card-sm faq-card sticky top-6">
        <header className="mb-3">
          <div className="text-sm font-semibold opacity-80">Help & support</div>
        </header>
        <div className="faq-search mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 21l-4.3-4.3" stroke="#0d6b55" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="11" r="7" stroke="#0d6b55" strokeWidth="2" />
          </svg>
          <input className="w-full outline-none text-sm" placeholder="Search FAQs" />
        </div>
        <div className="space-y-2">
          <details className="faq-item" open>
            <summary>Need Help?</summary>
            <div className="faq-body">Please use the help topics for most answers or contact support.</div>
          </details>
          <details className="faq-item">
            <summary>All help topics</summary>
            <div className="faq-body">Opens the help center with full articles and walkthroughs.</div>
          </details>
        </div>
      </div>
    </aside>
  );
}
