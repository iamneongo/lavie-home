"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bolt,
  CalendarDays,
  CheckCircle2,
  ChevronUp,
  Clock3,
  DoorOpen,
  Film,
  Gift,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import type { ElementType } from "react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { activeBranches, compactPhone, money, Room, roomsByBranch } from "@/lib/tete-data";

const slotLabels = ["08:00 - 11:00", "11:15 - 14:15", "14:30 - 17:30", "17:45 - 20:45", "21:00 - 00:00"];

const amenityIconMap: Record<string, React.ElementType> = {
  netflix: Film,
  phim: Film,
  chiếu: Film,
  giường: BedDouble,
  sofa: Home,
  "ghế": Home,
  "tình yêu": Heart,
  "gương": UserRound,
  "wc": DoorOpen,
  "check cam": ShieldCheck,
  "tặng": Gift,
};

function amenityIcon(label: string) {
  const lower = label.toLocaleLowerCase("vi-VN");
  const entry = Object.entries(amenityIconMap).find(([key]) => lower.includes(key));
  return entry?.[1] ?? CheckCircle2;
}

function makeDates() {
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      iso: date.toISOString().slice(0, 10),
      label: index === 0 ? "Hôm nay" : formatter.format(date),
    };
  });
}

function isBooked(roomId: number, dayIndex: number, slotIndex: number) {
  return (roomId + dayIndex * 3 + slotIndex * 5) % 7 === 0;
}

type SelectedSlot = {
  id: string;
  room: Room;
  date: string;
  dateIso: string;
  time: string;
  price: number;
  position: number;
};

export function LavieHomeApp() {
  const [activeBranchId, setActiveBranchId] = useState(activeBranches[0]?.id ?? 30);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [modalRoom, setModalRoom] = useState<Room | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const branchRooms = useMemo(() => roomsByBranch(activeBranchId), [activeBranchId]);
  const featuredRooms = branchRooms.slice(0, 10);
  const heroSlides = featuredRooms.slice(0, 5);
  const heroRoom = heroSlides.length ? heroSlides[heroIndex % heroSlides.length] : branchRooms[0];
  const calendarRooms = branchRooms.slice(0, 8);
  const currentBranch = activeBranches.find((branch) => branch.id === activeBranchId) ?? activeBranches[0];
  const dates = useMemo(() => makeDates(), []);

  const subtotal = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
  const discountRate = selectedSlots.length === 2 ? 0.1 : selectedSlots.length === 3 ? 0.2 : 0;
  const comboTotal =
    selectedSlots.length === 4 && selectedSlots[0]
      ? selectedSlots[0].price + Math.min(selectedSlots[0].room.full_day_price, selectedSlots[0].price * 2)
      : subtotal - subtotal * discountRate;

  function switchBranch(branchId: number) {
    setActiveBranchId(branchId);
    setSelectedSlots([]);
    setHeroIndex(0);
  }

  function moveHero(direction: -1 | 1) {
    if (heroSlides.length < 2) return;
    setHeroIndex((current) => (current + direction + heroSlides.length) % heroSlides.length);
  }

  function toggleSlot(slot: SelectedSlot) {
    setSelectedSlots((current) => {
      if (current.some((item) => item.id === slot.id)) {
        return current.filter((item) => item.id !== slot.id);
      }

      if (current.length >= 4) return current;
      if (current.length > 0) {
        const sameRoom = current.every((item) => item.room.id === slot.room.id && item.date === slot.date);
        const nextPositions = [...current.map((item) => item.position), slot.position].sort((a, b) => a - b);
        const sequential = nextPositions.every((position, index) => index === 0 || position - nextPositions[index - 1] === 1);
        if (!sameRoom || !sequential) return [slot];
      }

      return [...current, slot].sort((a, b) => a.position - b.position);
    });
  }

  const selectedSummary = selectedSlots[0]
    ? {
        room: selectedSlots[0].room.card_name,
        date: selectedSlots[0].date,
        branch: selectedSlots[0].room.branch_name,
        time: selectedSlots.map((slot) => slot.time).join(", "),
      }
    : null;

  function formatCheckoutDate(iso: string) {
    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
  }

  function createCheckoutUrl() {
    if (!selectedSlots[0]) return "/checkout";

    const firstSlot = selectedSlots[0];
    const timeslotIds = selectedSlots.map((slot) => slot.id).join(",");
    const checkoutDate = formatCheckoutDate(firstSlot.dateIso);
    const payload = {
      timeslot_ids: timeslotIds,
      room_name: firstSlot.room.card_name,
      branch_name: firstSlot.room.branch_name,
      branch_id: String(firstSlot.room.branch_id),
      date: checkoutDate,
      time_range: selectedSlots.map((slot) => slot.time).join(", "),
      price: Math.max(comboTotal, 0),
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const params = new URLSearchParams({
      data: encoded,
      timeslot_ids: payload.timeslot_ids,
      room_name: payload.room_name,
      branch_name: payload.branch_name,
      branch_id: payload.branch_id,
      date: payload.date,
      time_range: payload.time_range,
      price: String(payload.price),
    });

    return `/checkout/?${params.toString()}`;
  }

  function goToCheckout() {
    if (!selectedSlots.length) return;
    window.location.href = createCheckoutUrl();
  }

  return (
    <div id="top" className="site-shell text-white">
      <SiteHeader />

      <main className="pt-24">
        <section className="lavie-hero-section">
          <div className="lavie-hero-shell">
            {heroRoom ? (
              <div className="lavie-hero-media">
                <Image
                  key={heroRoom.id}
                  src={heroRoom.main_image}
                  alt={`${heroRoom.card_name} tại ${heroRoom.branch_name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="object-cover"
                />
                <div className="lavie-hero-shade" />
              </div>
            ) : null}

            {heroSlides.length > 1 ? (
              <div className="lavie-hero-carousel" aria-label="Chọn phòng nổi bật">
                <button type="button" onClick={() => moveHero(-1)} aria-label="Ảnh trước">
                  <ArrowLeft size={15} />
                </button>
                <div className="lavie-hero-dots">
                  {heroSlides.map((room, index) => (
                    <button
                      key={room.id}
                      type="button"
                      className={index === heroIndex % heroSlides.length ? "is-active" : ""}
                      onClick={() => setHeroIndex(index)}
                      aria-label={`Xem ${room.card_name}`}
                    />
                  ))}
                </div>
                <button type="button" onClick={() => moveHero(1)} aria-label="Ảnh tiếp theo">
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : null}

            <div className="lavie-hero-copy">
              <div className="lavie-hero-kicker">
                <Sparkles size={15} />
                Lavie Home self check-in
              </div>
              <h1>Nghỉ riêng tư, đặt phòng nhanh.</h1>
              <p>
                Xem phòng thật, chọn khung giờ còn trống và nhận hướng dẫn check-in 24/7 trên điện thoại.
              </p>
              <div className="lavie-hero-actions">
                <a className="primary-button px-6" href="#booking">
                  <Bolt size={17} /> Đặt phòng ngay
                </a>
                <a className="lavie-hero-secondary" href="#rooms">
                  Xem phòng trống
                </a>
              </div>
            </div>

            {heroRoom ? (
              <div className="lavie-hero-booking">
                <div className="lavie-hero-room">
                  <span>Phòng gợi ý hôm nay</span>
                  <strong>{heroRoom.card_name}</strong>
                  <small>{heroRoom.branch_name}</small>
                </div>
                <div className="lavie-hero-booking-grid">
                  <div>
                    <CalendarDays size={16} />
                    <span>Hôm nay</span>
                  </div>
                  <div>
                    <MapPin size={16} />
                    <span>{currentBranch?.name}</span>
                  </div>
                  <div>
                    <ShieldCheck size={16} />
                    <span>Từ {money(heroRoom.price_from)}đ</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mx-auto w-[min(100%-2rem,1360px)] py-6">
          <div className="section-card p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Chi nhánh</p>
                <h2 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight tracking-[-0.025em] md:text-4xl">Chọn nơi bạn muốn nghỉ</h2>
              </div>
              <p className="max-w-md text-sm font-semibold leading-6 text-white/62 md:text-[0.95rem]">
                Chọn chi nhánh để xem phòng và lịch trống tương ứng.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {activeBranches.map((branch) => (
                <button
                  key={branch.id}
                  className={`rounded-full border px-4 py-2.5 text-[0.72rem] font-extrabold uppercase tracking-wide transition sm:text-xs ${
                    activeBranchId === branch.id
                      ? "border-pink-200 bg-pink-200 text-[#170913] lavie-glow"
                      : "border-white/14 bg-white/7 text-white hover:-translate-y-0.5 hover:bg-white/11"
                  }`}
                  onClick={() => switchBranch(branch.id)}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="rooms" className="mx-auto w-[min(100%-2rem,1360px)] py-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Danh sách phòng</p>
              <h2 className="mt-2 max-w-3xl text-2xl font-extrabold leading-tight tracking-[-0.025em] md:text-4xl">Phòng tại {currentBranch?.name}</h2>
              <p className="mt-3 max-w-[62ch] text-sm font-semibold leading-6 text-white/62 md:text-[0.95rem]">{branchRooms.length} phòng đang hiển thị từ dữ liệu gốc.</p>
            </div>
            <div className="hidden gap-2 md:flex">
              <button className="icon-button" onClick={() => document.getElementById("room-row")?.scrollBy({ left: -420, behavior: "smooth" })} aria-label="Cuộn trái">
                <ArrowLeft size={18} />
              </button>
              <button className="icon-button" onClick={() => document.getElementById("room-row")?.scrollBy({ left: 420, behavior: "smooth" })} aria-label="Cuộn phải">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div id="room-row" className="hide-scrollbar flex snap-x gap-5 overflow-x-auto pb-6">
            {featuredRooms.map((room) => (
              <article key={room.id} className="room-card-clone snap-center">
                <Image
                  src={room.main_image}
                  alt={`${room.card_name} room`}
                  width={420}
                  height={300}
                  className="h-52 w-full rounded-2xl object-cover"
                />
                <h3 className="mt-4 min-h-12 text-base font-extrabold leading-tight text-pink-100">{room.card_name}</h3>
                <div className="mt-3 flex max-h-28 flex-wrap gap-2 overflow-hidden">
                  {room.room_amenities.slice(0, 8).map((amenity) => {
                    const Icon = amenityIcon(amenity);
                    return (
                      <span key={amenity} className="inline-flex items-center gap-1 rounded-xl border border-pink-300/40 bg-pink-300/10 px-2.5 py-1.5 text-[0.72rem] font-bold text-white">
                        <Icon size={13} /> {amenity}
                      </span>
                    );
                  })}
                </div>
                <p className="mt-4 text-sm font-bold text-white/75">
                  Từ <span className="text-yellow-200">{money(room.price_from)}đ</span> đến{" "}
                  <span className="text-pink-200">{money(room.price_to)}đ</span>
                </p>
                <p className="mt-1 text-sm font-bold text-white/65">Qua đêm: {money(room.full_day_price)}đ</p>
                <button className="primary-button mt-5 w-full" onClick={() => setModalRoom(room)}>
                  <Sparkles size={16} /> Xem ảnh & Đặt phòng
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="booking" className="mx-auto w-[min(100%-2rem,1360px)] py-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Check-in tự động</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.025em] md:text-4xl">Đặt phòng siêu tốc</h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-white/62 md:text-[0.95rem]">Chọn khung giờ và ngày bạn muốn check-in bên dưới nhé.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="glass-panel overflow-hidden rounded-3xl">
              <div className="hide-scrollbar overflow-auto">
                <table className="w-full min-w-[980px] border-collapse text-center text-xs">
                  <thead>
                    <tr>
                      <th className="sticky left-0 top-0 z-20 w-36 bg-[#281531] p-3 text-left text-white">Ngày / giờ</th>
                      {calendarRooms.map((room) => (
                        <th key={room.id} className="sticky top-0 z-10 bg-[#281531] p-3 text-pink-100" data-room-name={room.card_name}>
                          {room.card_name.replace("Phòng ", "")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dates.map((date, dayIndex) =>
                      slotLabels.map((slot, slotIndex) => (
                        <tr key={`${date.iso}-${slot}`}>
                          <td className="sticky left-0 z-10 border-t border-white/10 bg-[#1b1024] p-3 text-left font-extrabold">
                            <span className="block text-yellow-200">{date.label}</span>
                            <span className="text-white/70">{slot}</span>
                          </td>
                          {calendarRooms.map((room) => {
                            const id = `${room.id}-${date.iso}-${slotIndex}`;
                            const booked = isBooked(room.id, dayIndex, slotIndex);
                            const selected = selectedSlots.some((item) => item.id === id);
                            const discounted = slotIndex >= 2;
                            return (
                              <td key={id} className="slot-cell border border-white/10 bg-[#1c1125] p-2">
                                <button
                                  disabled={booked}
                                  className={`h-11 w-full rounded-lg text-[0.66rem] font-extrabold transition ${
                                    booked
                                      ? "cursor-not-allowed bg-red-500 text-white"
                                      : selected
                                        ? "bg-yellow-300 text-slate-950 shadow-[0_0_16px_rgba(253,224,71,0.7)]"
                                        : discounted
                                          ? "bg-emerald-100 text-emerald-950 hover:bg-emerald-200"
                                          : "bg-white text-slate-950 hover:bg-pink-100"
                                  }`}
                                  onClick={() =>
                                    toggleSlot({
                                      id,
                                      room,
                                      date: date.label,
                                      dateIso: date.iso,
                                      time: slot,
                                      price: room.price_from,
                                      position: dayIndex * slotLabels.length + slotIndex,
                                    })
                                  }
                                >
                                  {booked ? "Đã đặt" : `${money(room.price_from)}đ`}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="glass-panel sticky top-24 self-start rounded-3xl p-5">
              <h3 className="border-b border-pink-300/20 pb-4 text-center text-base font-extrabold text-pink-200">
                Thông Tin Đặt Phòng
              </h3>
              <div className="mt-4 grid gap-3 text-sm">
                <SummaryRow icon={BedDouble} label="Phòng" value={selectedSummary?.room ?? "Chưa chọn"} />
                <SummaryRow icon={MapPin} label="Chi nhánh" value={selectedSummary?.branch ?? currentBranch?.name ?? "Chưa chọn"} />
                <SummaryRow icon={CalendarDays} label="Ngày" value={selectedSummary?.date ?? "Chưa chọn"} />
                <SummaryRow icon={Clock3} label="Khung giờ" value={selectedSummary?.time ?? "Chưa chọn"} />
              </div>
              <div className="mt-5 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Giá gốc</span>
                  <span>{money(subtotal)}đ</span>
                </div>
                {selectedSlots.length > 1 ? (
                  <div className="mt-2 flex justify-between text-emerald-300">
                    <span>Ưu đãi</span>
                    <span>{selectedSlots.length === 4 ? "Combo 4 khung" : `${Math.round(discountRate * 100)}%`}</span>
                  </div>
                ) : null}
                <div className="mt-4 flex justify-between text-base font-extrabold">
                  <span>Tổng cộng</span>
                  <span className="text-yellow-200">{money(Math.max(comboTotal, 0))}đ</span>
                </div>
              </div>
              <button
                className="primary-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!selectedSlots.length}
                onClick={goToCheckout}
              >
                <Bolt size={16} /> Xác nhận đặt phòng
              </button>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-white/75">
                <Legend color="bg-white" label="Còn trống" />
                <Legend color="bg-yellow-300" label="Đang chọn" />
                <Legend color="bg-red-500" label="Đã đặt" />
                <Legend color="bg-emerald-100" label="Đang giảm giá" />
              </div>
              <p className="mt-5 text-center text-xs leading-5 text-white/55">
                Khách hàng được giảm thêm 10% hoặc 20% trên tổng hoá đơn khi chọn book 2, 3 khung giờ.
              </p>
            </aside>
          </div>
        </section>

        <section id="guide" className="mx-auto w-[min(100%-2rem,1360px)] py-12">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Dành cho khách hàng", "Tìm phòng phù hợp, chọn khung giờ, nhập thông tin và hoàn tất thanh toán."],
              ["Check-in tự động", "Nhân viên kiểm tra thông tin và gửi hướng dẫn check-in qua số điện thoại đã đặt."],
              ["Hỗ trợ phát sinh", "Liên hệ hotline hoặc Zalo từng chi nhánh để hủy đơn, đổi giờ hoặc nhận hỗ trợ."],
            ].map(([title, body]) => (
              <div key={title} className="section-card p-6">
                <h3 className="text-base font-extrabold text-pink-200">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/68">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-[min(100%-2rem,1360px)] pb-20">
          <div className="page-panel grid gap-5 p-6 md:grid-cols-2 md:p-8">
            <div>
              <h2 className="text-xl font-extrabold md:text-2xl">Chào mừng bạn đến với Lavie Home</h2>
              <p className="mt-3 text-white/65">Hãy chọn mô hình bạn muốn book phòng.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-pink-300/25 bg-pink-300/8 p-5">
                <Home className="text-pink-200" />
                <h3 className="mt-3 font-extrabold">Lavie Decor</h3>
                <p className="mt-2 text-sm text-white/60">Đa dạng chủ đề phòng dành cho các cặp đôi.</p>
              </div>
              <a href="#booking" className="rounded-2xl border border-yellow-200/25 bg-yellow-200/8 p-5 transition hover:-translate-y-1">
                <BedDouble className="text-yellow-200" />
                <h3 className="mt-3 font-extrabold">Hotel Truyền Thống</h3>
                <p className="mt-2 text-sm text-white/60">Phù hợp cho gia đình, kỳ nghỉ và ở lâu dài.</p>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-white/55">
        © 2025 Bản quyền thuộc về Lavie Home. Clone NextJS phục vụ demo giao diện.
      </footer>

      <div className="fixed bottom-7 right-5 z-40 hidden flex-col gap-3 md:flex">
        <a className="float-button bg-slate-700" href="#top" aria-label="Lên đầu trang">
          <ChevronUp size={22} />
        </a>
        <a className="float-button bg-emerald-500" href={`tel:${compactPhone(currentBranch?.hotline ?? "0845828676")}`} aria-label="Gọi ngay">
          <Phone size={22} />
        </a>
        <a className="float-button bg-blue-600" href={`https://zalo.me/${compactPhone(currentBranch?.hotline ?? "0845828676")}`} aria-label="Zalo">
          <MessageCircle size={20} />
        </a>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-white/10 bg-[#1b1024]/95 px-2 py-2 backdrop-blur-xl md:hidden">
        <a className="bottom-link" href="#rooms">
          <Home size={18} /> Trang chủ
        </a>
        <Link className="bottom-link" href="/checking">
          <Search size={18} /> Tra cứu
        </Link>
        <a className="bottom-link" href={`tel:${compactPhone(currentBranch?.hotline ?? "0845828676")}`}>
          <Phone size={18} /> Gọi ngay
        </a>
        <Link className="bottom-link" href="/contacts">
          <MapPin size={18} /> Địa chỉ
        </Link>
      </nav>

      {modalRoom ? <RoomModal room={modalRoom} onClose={() => setModalRoom(null)} onBook={() => setModalRoom(null)} /> : null}
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-white/5 px-3 py-3">
      <span className="flex shrink-0 items-center gap-2 text-white/60">
        <Icon size={16} className="text-pink-200" /> {label}
      </span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded ${color}`} /> {label}
    </span>
  );
}

function RoomModal({ room, onClose, onBook }: { room: Room; onClose: () => void; onBook: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel mx-auto my-8 max-w-6xl overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-pink-200">{room.card_name}</h2>
            <p className="text-sm text-white/55">{room.branch_name}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-5 p-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto">
            {room.images.slice(0, 10).map((src) => (
              <Image
                key={src}
                src={src}
                alt={room.card_name}
                width={900}
                height={650}
                className="h-[360px] w-full min-w-full snap-center rounded-2xl object-cover sm:h-[520px]"
              />
            ))}
          </div>
          <div className="flex flex-col">
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <p className="flex justify-between">
                <span className="text-white/60">Giá theo khung</span>
                <span className="font-extrabold text-yellow-200">
                  {money(room.price_from)}đ - {money(room.price_to)}đ
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-white/60">Qua đêm</span>
                <span className="font-extrabold text-pink-200">{money(room.full_day_price)}đ</span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {room.room_amenities.map((amenity) => {
                const Icon = amenityIcon(amenity);
                return (
                  <span key={amenity} className="inline-flex items-center gap-1.5 rounded-xl border border-pink-300/30 bg-pink-300/10 px-3 py-2 text-xs font-bold">
                    <Icon size={14} /> {amenity}
                  </span>
                );
              })}
            </div>
            <button className="primary-button mt-6" onClick={onBook}>
              <Bolt size={16} /> Chọn phòng này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
