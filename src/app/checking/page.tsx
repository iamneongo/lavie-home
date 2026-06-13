import { Calendar, Phone, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function CheckingPage() {
  return (
    <main className="site-shell min-h-dvh text-white">
      <SiteHeader />
      <div className="mx-auto w-[min(100%-2rem,540px)] pb-16 pt-32">
        <section className="page-panel p-6 md:p-8">
          <h1 className="text-2xl font-extrabold leading-tight tracking-[-0.025em] md:text-3xl text-center text-pink-100 mb-6">
            Tra cứu đặt phòng
          </h1>

          <form className="grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-white/72">
              Số điện thoại
              <span className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" size={18} />
                <input
                  type="tel"
                  className="field-input"
                  placeholder="Nhập số điện thoại đã đặt phòng"
                  required
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-bold text-white/72">
              Ngày đặt phòng
              <span className="relative">
                <Calendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" size={18} />
                <input
                  type="date"
                  className="field-input"
                  placeholder="mm/dd/yyyy"
                  required
                />
              </span>
            </label>

            <button className="primary-button mt-4 w-full" type="button">
              <Search size={17} /> Tra cứu
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

