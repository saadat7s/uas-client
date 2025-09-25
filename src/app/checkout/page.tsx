"use client";
import { useSelector } from "react-redux";
import { buildCheckout, canSendApplication, selectPicks, selectCatalog } from "@/app/redux/slices/universitiesSlice";
import Link from "next/link";

export default function CheckoutPage() {
  const state = useSelector(s => s);
  const catalog = useSelector(selectCatalog);
  const picks = useSelector(selectPicks);
  const ready = canSendApplication(state);
  const summary = buildCheckout(state);
  const PLATFORM_FEE = 250;
  const NADRA_FEE = 50;

  // Application fee calculation (per university, not program tuition)
  const appFeeItems = picks.map(p => {
    const uni = catalog[p.uniId];
    return { uniId: p.uniId, name: uni?.name ?? p.uniId, fee: uni?.applicationFeePKR ?? 0 };
  });
  const appFeesSubtotal = appFeeItems.reduce((n, it) => n + (it.fee || 0), 0);
  const grandTotal = appFeesSubtotal + PLATFORM_FEE + NADRA_FEE;

  return (
    <main className="center-wrap with-mandala">
      <section className="center-content">
        <div className="main-card p-6 md:p-8">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="title-primary text-left">Checkout</h2>
            <div className="flex gap-2">
              <Link href="/Dashboard" className="outline-button">Back to Dashboard</Link>
              <Link href="/universities/my" className="outline-button">Back to My Universities</Link>
            </div>
          </header>

          {!ready && (
            <p className="text-red-700 mt-2">
              You need to pick at least one program for each selected university before sending your application.
            </p>
          )}

          <div className="grid md:grid-cols-[1fr_320px] gap-4 items-start mt-2">
            <div className="rounded-2xl border shadow-sm">
              <div className="p-4 border-b">
                <div className="font-semibold text-emerald-900">Application fees</div>
                <div className="text-sm text-gray-600">Per university (not tuition)</div>
              </div>
              {appFeeItems.length === 0 ? (
                <div className="p-4 text-gray-600">No universities selected yet.</div>
              ) : (
                <ul className="divide-y">
                  {appFeeItems.map((it, i) => (
                    <li key={i} className="py-3 px-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{it.name}</div>
                        <div className="text-sm text-gray-600">Application fee</div>
                      </div>
                      <div className="font-semibold">{it.fee} PKR</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside className="main-card p-4 md:sticky md:top-6">
              <div className="font-semibold text-emerald-900 mb-2">Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Applications subtotal</span>
                  <span>{appFeesSubtotal} PKR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform fee</span>
                  <span>{PLATFORM_FEE} PKR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>NADRA one-time fee</span>
                  <span>{NADRA_FEE} PKR</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between font-semibold">
                  <span>Total due now</span>
                  <span>{grandTotal} PKR</span>
                </div>
              </div>
              <button className="normal-button w-full mt-4" disabled={!ready}>Proceed to Payment</button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
