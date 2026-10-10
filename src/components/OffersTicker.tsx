import { useEffect, useMemo, useState } from "react";
import { api, Offer } from "@/services/api";

export default function OffersTicker() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    let alive = true;
    let raf = 0;
    const OFFERS_KEY = "sb_offers";

    const loadData = async () => {
      const data = await api.getOffers();
      if (!alive) return;
      setOffers(data);
    };

    loadData();

    const scheduleReload = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => loadData());
    };

    const onDataChanged = (e: Event) => {
      const ce = e as CustomEvent<{ key?: string }>;
      const key = ce.detail?.key;
      if (!key || key === OFFERS_KEY) scheduleReload();
    };

    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === OFFERS_KEY) scheduleReload();
    };

    window.addEventListener("sb:data_changed", onDataChanged as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("sb:data_changed", onDataChanged as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const items = useMemo(() => {
    const base = offers
      .filter(o => o.isActive)
      .map(o => ({
        id: o.id,
        title: `${o.discountPercent}% OFF — ${o.title}`,
        imageUrl: o.imageUrl,
      }));

    if (base.length === 0) return [];

    const doubled = [...base, ...base];
    return doubled;
  }, [offers]);

  if (items.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md px-4 py-3 shadow-md">
      <style>{`@keyframes sb-marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }`}</style>
      <div className="flex items-center gap-3">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-amber-500 to-rose-500 text-white px-3 py-1 rounded-full shadow-sm shrink-0">
          🔥 Offers
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex w-max gap-6 whitespace-nowrap"
            style={{ animation: "sb-marquee 20s linear infinite" }}
          >
            {items.map((it, idx) => (
              <div
                key={`${idx}-${it.id}`}
                className="text-xs font-bold text-slate-800 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-amber-50 border border-slate-200/60 flex items-center gap-2.5 shadow-xs hover:border-amber-400/50 transition-all cursor-pointer"
              >
                {it.imageUrl ? (
                  <img
                    src={it.imageUrl}
                    alt="Offer"
                    className="w-5 h-5 rounded-full object-cover border border-white ring-1 ring-amber-400/40"
                    loading="lazy"
                  />
                ) : null}
                <span className="text-slate-900 font-semibold">{it.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
