import { MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { activeBranches, compactPhone } from "@/lib/tete-data";

export default function ContactsPage() {
  return (
    <main className="site-shell min-h-dvh text-white">
      <SiteHeader />
      <div className="mx-auto w-[min(100%-2rem,1180px)] pb-16 pt-24">
        <section className="page-panel p-6 md:p-8">
          <p className="eyebrow">Thông tin chi nhánh</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-5xl">
            Liên hệ & mạng xã&nbsp;hội
          </h1>
          <p className="mt-4 max-w-[62ch] text-sm font-semibold leading-6 text-white/64 md:text-[0.95rem]">
            Danh sách chi nhánh, hotline, Zalo và link chỉ đường cho hệ thống Lavie Home.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {activeBranches.map((branch) => (
            <article key={branch.id} className="section-card p-5">
              <h2 className="text-base font-extrabold text-pink-200">{branch.name}</h2>
              <p className="mt-2 text-sm text-white/55">Hotline: {branch.hotline}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <a className="primary-button min-h-11 px-3 py-2 text-xs" href={`tel:${compactPhone(branch.hotline)}`}>
                  <Phone size={15} /> Gọi
                </a>
                <a className="primary-button min-h-11 px-3 py-2 text-xs" href={`https://zalo.me/${compactPhone(branch.hotline)}`}>
                  <MessageCircle size={15} /> Zalo
                </a>
                <a className="primary-button min-h-11 px-3 py-2 text-xs" href={branch.google_maps_link}>
                  <MapPin size={15} /> Map
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
