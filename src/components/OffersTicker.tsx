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
    <div className="w-full overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-r from-coral/light to-white/80 backdrop-blur px-4 py-3 shadow-sm">
      <style>{`@keyframes sb-marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }`}</style>
      <div className="flex items-center gap-3">
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary shrink-0">Offers</div>
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex w-max gap-6 whitespace-nowrap"
            style={{ animation: "sb-marquee 20s linear infinite" }}
          >
            {items.map((it, idx) => (
              <div
                key={`${idx}-${it.id}`}
                className="text-xs font-bold text-slate-900 px-4 py-2 rounded-full bg-white/80 border border-primary/15 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                {it.imageUrl ? (
                  <img
                    src={it.imageUrl}
                    alt="Offer"
                    className="w-6 h-6 rounded-full object-cover border border-white ring-2 ring-primary/20"
                    loading="lazy"
                  />
                ) : null}
                <span className="text-primary">{it.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
