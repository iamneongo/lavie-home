import Link from "next/link";
import type { ElementType } from "react";
import {
  CalendarDays,
  Clock3,
  CreditCard,
  FileText,
  Home,
  IdCard,
  Lock,
  MapPin,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { activeBranches, compactPhone, money } from "@/lib/tete-data";

type CheckoutSearchParams = Record<string, string | string[] | undefined>;

type CheckoutPayload = {
  timeslot_ids?: string;
  room_name?: string;
  branch_name?: string;
  branch_id?: string;
  date?: string;
  time_range?: string;
  price?: number | string;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

function decodePayload(data: string): CheckoutPayload {
  if (!data) return {};

  try {
    return JSON.parse(Buffer.from(data, "base64").toString("utf8")) as CheckoutPayload;
  } catch {
    return {};
  }
}

function resolveCheckout(params: CheckoutSearchParams) {
  const decoded = decodePayload(firstValue(params.data));
  const branchId = decoded.branch_id ?? firstValue(params.branch_id);
  const branch = activeBranches.find((item) => String(item.id) === String(branchId));
  const price = Number(decoded.price ?? firstValue(params.price) ?? 0);

  return {
    timeslotIds: decoded.timeslot_ids ?? firstValue(params.timeslot_ids) ?? "N/A",
    roomName: decoded.room_name ?? firstValue(params.room_name) ?? "N/A",
    branchName: decoded.branch_name ?? firstValue(params.branch_name) ?? branch?.name ?? "N/A",
    branchId,
    date: decoded.date ?? firstValue(params.date) ?? "N/A",
    timeRange: decoded.time_range ?? firstValue(params.time_range) ?? "N/A",
    price: Number.isFinite(price) ? price : 0,
    hotline: branch?.hotline ?? "0845.828.676",
    map: branch?.google_maps_link ?? "/contacts",
  };
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<CheckoutSearchParams>;
}) {
  const params = await searchParams;
  const checkout = resolveCheckout(params);
  const transferCode = `LVH${String(checkout.branchId || "00").padStart(2, "0")}${String(checkout.timeslotIds).replace(/\D/g, "").slice(-6) || "000000"}`;

  return (
    <main className="site-shell min-h-dvh text-white">
      <SiteHeader />
      <div className="mx-auto w-[min(100%-2rem,1180px)] pb-16 pt-24">
        <section className="grid items-start gap-5 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-5">
            <section className="page-panel p-5 md:p-7">
              <p className="eyebrow">Thanh toán đặt phòng</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.03em] md:text-5xl">
                Xác nhận thông tin
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/64 md:text-[0.95rem]">
                Điền thông tin người đặt và xác thực giấy tờ để Lavie Home giữ phòng đúng khung giờ bạn đã chọn.
              </p>
            </section>

            <section className="section-card p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.025em]">
                <UserRound className="text-pink-200" size={21} /> Thông Tin Người Đặt
              </h2>
              <form className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm font-bold text-white/72">
                  Họ và Tên (*)
                  <input className="field-input !pl-5" placeholder="Nhập họ và tên" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-white/72">
                  Số Điện Thoại (*)
                  <input className="field-input !pl-5" inputMode="tel" placeholder="Số điện thoại nhận mã mở khóa" />
                </label>

                <div className="grid gap-3">
                  <p className="text-sm font-bold text-white/72">Số Lượng Người</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      ["2", "Đi 2 người", "Mặc định"],
                      ["3", "Đi 3 người", "Phụ thu 50.000đ"],
                      ["4", "Đi 4 người", "Phụ thu 100.000đ"],
                    ].map(([value, title, note]) => (
                      <label key={value} className="cursor-pointer rounded-2xl border border-white/10 bg-white/6 p-4 transition hover:border-pink-200/50 hover:bg-white/9">
                        <input className="sr-only" type="radio" name="guest_count" defaultChecked={value === "2"} />
                        <span className="block font-extrabold text-white">{title}</span>
                        <span className="mt-1 block text-xs font-bold text-white/52">{note}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-white/48">Trẻ em trên 10 tuổi tính như 1 slot ngồi.</p>
                </div>

                <label className="grid gap-2 text-sm font-bold text-white/72">
                  Ghi chú/Yêu cầu riêng (Tuỳ chọn)
                  <textarea
                    className="min-h-28 rounded-3xl border border-white/10 bg-white/8 px-5 py-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/35 focus:border-pink-300/70 focus:bg-white/10"
                    placeholder="Ví dụ: đến muộn 10 phút, cần hỗ trợ thêm..."
                  />
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4 text-sm font-bold text-white/72">
                  <input className="mt-1" type="checkbox" />
                  <span>Đến bằng xe hơi (Để nhân viên hỗ trợ chỗ đỗ xe)</span>
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4 text-sm font-bold text-white/72">
                  <input className="mt-1" type="checkbox" />
                  <span>Gói trang trí Sinh nhật, Ngày Lễ,... (tuỳ chọn, sẽ có nhân viên liên hệ tư vấn gói)</span>
                </label>
              </form>
            </section>

            <section className="section-card p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-[-0.025em]">
                <IdCard className="text-pink-200" size={21} /> Xác Thực Căn Cước
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/58">
                Dữ liệu thẻ CCCD của bạn sẽ được mã hoá và tự động xoá sau khi check-out.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="checkout-upload">
                  <Upload size={24} />
                  <span>Mặt Trước CCCD / Bằng Lái</span>
                  <input type="file" accept="image/*" />
                </label>
                <label className="checkout-upload">
                  <Upload size={24} />
                  <span>Mặt Sau CCCD / Bằng Lái</span>
                  <input type="file" accept="image/*" />
                </label>
              </div>
              <label className="mt-5 flex items-start gap-3 text-sm font-semibold leading-6 text-white/62">
                <input className="mt-1" type="checkbox" />
                <span>
                  Tôi đồng ý với <a className="text-yellow-200 underline-offset-4 hover:underline">Điều khoản và điều kiện</a> và đồng ý bảo lãnh cho bạn cùng phòng.
                </span>
              </label>
            </section>
          </div>

          <aside className="grid h-fit gap-5 lg:sticky lg:top-6">
            <section className="section-card p-5 md:p-6">
              <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-[-0.02em]">
                <FileText className="text-yellow-200" size={21} /> Tóm Tắt Đặt Phòng
              </h2>
              <div className="mt-5 grid gap-3 text-sm">
                <CheckoutLine icon={Home} label="Phòng" value={checkout.roomName} />
                <CheckoutLine icon={MapPin} label="Chi nhánh" value={checkout.branchName} />
                <CheckoutLine icon={CalendarDays} label="Lịch Đặt" value={checkout.date} />
                <CheckoutLine icon={Clock3} label="Khung giờ" value={checkout.timeRange} />
              </div>
              <div className="mt-5 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between text-sm font-bold text-white/62">
                  <span>Tạm Tính</span>
                  <span className="text-xl font-extrabold text-yellow-200">{money(checkout.price)}đ</span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/48">
                  <Lock size={14} /> Giao dịch bảo mật bằng mã hoá SSL 256-bit.
                </p>
              </div>
              <a className="primary-button mt-5 w-full" href="#payment">
                <CreditCard size={17} /> Xác Nhận Đặt Phòng
              </a>
            </section>

            <section id="payment" className="section-card p-5 md:p-6">
              <h2 className="text-lg font-extrabold tracking-[-0.02em]">Thanh Toán Đặt Phòng</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-white/58">
                Hệ thống sẽ tự động duyệt trong 5 giây sau khi nhận được chuyển khoản.
              </p>
              <div className="mt-4 rounded-2xl border border-yellow-200/25 bg-yellow-200/8 p-4 text-center">
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-yellow-200">Thời gian còn lại</p>
                <p className="mt-1 text-2xl font-extrabold text-white">10:00</p>
              </div>
              <div className="qr-card mt-4">
                <span>LVH</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <PaymentLine label="Ngân hàng thụ hưởng" value="Vietinbank" />
                <PaymentLine label="Chủ tài khoản" value="LAVIE HOME" />
                <PaymentLine label="Nội dung chuyển khoản" value={transferCode} />
                <PaymentLine label="Tổng thanh toán" value={`${money(checkout.price)}đ`} strong />
              </div>
              <Link className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/14 bg-white/7 px-6 text-sm font-extrabold text-white transition hover:bg-white/11" href="/#booking">
                Hủy & Đặt Đơn Khác
              </Link>
              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                <h3 className="flex items-center gap-2 font-extrabold text-pink-100">
                  <ShieldCheck size={18} /> Hướng Dẫn Thanh Toán
                </h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm font-semibold leading-6 text-white/62">
                  <li>Mở ứng dụng ngân hàng của bạn.</li>
                  <li>Quét mã QR bên trên hoặc nhập nội dung chuyển khoản.</li>
                  <li>Nội dung chuyển khoản cần viết in hoa chữ cái.</li>
                  <li>Sau khi chuyển khoản thành công, hệ thống sẽ tự động xác nhận trong giây lát.</li>
                </ol>
              </div>
            </section>
          </aside>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-white/50">
          <Link className="hover:text-white" href="/">
            Đặt Phòng
          </Link>
          <Link className="hover:text-white" href="/checking">
            Tra Cứu
          </Link>
          <a className="hover:text-white" href={checkout.map}>
            Địa Chỉ
          </a>
          <a className="hover:text-white" href={`tel:${compactPhone(checkout.hotline)}`}>
            Hotline: {checkout.hotline}
          </a>
        </div>
      </div>
    </main>
  );
}

function CheckoutLine({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 px-4 py-3">
      <p className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-white/38">
        <Icon size={15} className="text-pink-200" /> {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-white/88">{value}</p>
    </div>
  );
}

function PaymentLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-2xl bg-white/5 px-4 py-3">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-white/38">{label}</p>
      <p className={`mt-1 font-extrabold ${strong ? "text-xl text-yellow-200" : "text-sm text-white"}`}>{value}</p>
    </div>
  );
}
