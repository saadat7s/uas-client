"use client";
import { useSelector } from "react-redux";
import {
  buildCheckout,
  canSendApplication,
  selectPicks,
  selectCatalog,
} from "@/app/redux/slices/universitiesSlice";
import Link from "next/link";

const formatPKR = (n: number) => `${Number(n || 0).toLocaleString("en-PK")} PKR`;

export default function CheckoutPage() {
  const state = useSelector((s: any) => s);
  const catalog = useSelector(selectCatalog);
  const picks = useSelector(selectPicks);
  const ready = canSendApplication(state);
  const _summary = buildCheckout(state);

  const PLATFORM_FEE = 250;
  const NADRA_FEE = 50;

  const appFeeItems = picks.map((p) => {
    const uni = catalog[p.uniId];
    return { uniId: p.uniId, name: uni?.name ?? p.uniId, fee: uni?.applicationFeePKR ?? 0 };
  });

  const appFeesSubtotal = appFeeItems.reduce((n, it) => n + (it.fee || 0), 0);
  const grandTotal = appFeesSubtotal + PLATFORM_FEE + NADRA_FEE;

  return (
    <main className="center-wrap with-mandala with-minar">
      {/* screen-centered sheet */}
      <div style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 96px)", width: "100%" }}>
        <div className="main-card main-card-lg center-sheet" style={{ width: "clamp(900px, 80vw, 1100px)" }}>
          {/* Header */}
          <header className="center-sheet__header pb-4 mb-2 flex items-start justify-between gap-3">
            <div>
              <h2 className="title-primary !text-left !mb-1">Checkout</h2>
              <p className="title-secondary !text-left">Review and submit your PCAS application.</p>
            </div>
            <div className="shrink-0">
              {/* Single back goes to Dashboard */}
              <Link href="/user/Dashboard" className="outline-button">Back</Link>
            </div>
          </header>

          {!ready && (
            <div role="alert" className="border border-red-200 bg-red-50 text-red-800 rounded-xl px-3 py-2 mb-3">
              You need at least one selected program for each university.{" "}
              <Link className="link-primary" href="/user/universities/my">Fix in My Universities</Link>.
            </div>
          )}

          {/* Body */}
          <div className="grid md:grid-cols-[minmax(520px,1fr)_320px] gap-24 items-start">
            {/* LEFT: Selected universities (no fees here) */}
            <section className="section-block">
              <div className="section-title">Selected universities</div>

              {picks.length === 0 ? (
                <div className="rounded-2xl border bg-white px-4 py-5 text-gray-600">
                  No universities selected.{" "}
                  <Link className="link-primary" href="/user/universities/search">
                    Add from Search
                  </Link>.
                </div>
              ) : (
                <div className="numbered-list" role="region" aria-label="Selected universities">
                  <ol className="numbered-list__ol">
                    {picks.map((p, idx) => {
                      const u = catalog[p.uniId];
                      if (!u) return null;
                      return (
                        <li key={p.uniId} className="numbered-item">
                          <span className="num-badge">{idx + 1}</span>
                          <div className="item-main">
                            <div className="item-title item-title--wrap">{u.name}</div>
                            {(u.city || u.province) && (
                              <div className="text-xs text-gray-600 mt-0.5">
                                {[u.city, u.province].filter(Boolean).join(", ")}
                              </div>
                            )}
                          </div>
                          <Link href="/user/universities/my" className="item-action">Edit</Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </section>

            {/* RIGHT: Summary (flat side rail, not a card-in-card) */}
            <aside className="sheet-aside md:sticky md:top-6 p-4">
              <div className="font-semibold text-emerald-900 mb-2">Summary</div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Applications subtotal</span>
                  <span className="font-medium">{formatPKR(appFeesSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform fee</span>
                  <span className="font-medium">{formatPKR(PLATFORM_FEE)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>NADRA one-time fee</span>
                  <span className="font-medium">{formatPKR(NADRA_FEE)}</span>
                </div>

                <div className="border-t pt-2 flex items-center justify-between text-base font-semibold">
                  <span>Total due now</span>
                  <span>{formatPKR(grandTotal)}</span>
                </div>
              </div>

              <button className="normal-button w-full mt-4" disabled={!ready} aria-disabled={!ready}>
                Proceed to Payment
              </button>

              <p className="text-[12px] text-gray-600 mt-2">
                Encrypted payments • By continuing you agree to our terms & privacy.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
