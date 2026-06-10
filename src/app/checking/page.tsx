import { KeyRound, Phone, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function CheckingPage() {
  return (
    <main className="site-shell min-h-dvh text-white">
      <SiteHeader />
      <div className="mx-auto w-[min(100%-2rem,1180px)] pb-16 pt-24">
        <section className="page-panel p-6 md:p-10">
          <p className="eyebrow">Tra cứu đặt phòng</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-5xl">Tra mã mở khóa cổng</h1>
          <p className="mt-4 max-w-[62ch] text-sm font-semibold leading-6 text-white/64 md:text-[0.95rem]">
            Bản clone NextJS mô phỏng màn tra cứu. Khi nối backend thật, form này có thể gọi API kiểm tra mã đặt phòng và số điện thoại.
          </p>

          <form className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm font-bold text-white/72">
              Mã đặt phòng
              <span className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" size={18} />
                <input
                  className="field-input"
                  placeholder="VD: LVH-2406"
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-white/72">
              Số điện thoại
              <span className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" size={18} />
                <input
                  className="field-input"
                  placeholder="Nhập số điện thoại đã đặt"
                />
              </span>
            </label>
            <button className="primary-button mt-2" type="button">
              <Search size={17} /> Tra cứu
            </button>
          </form>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {["Nhập mã đặt phòng", "Xác thực số điện thoại", "Nhận mã mở khóa"].map((item) => (
            <div key={item} className="section-card p-5 text-sm font-bold text-white/72">
              {item}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
