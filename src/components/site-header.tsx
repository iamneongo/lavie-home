"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen && !guideOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setGuideOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, guideOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] border-b border-white/10 bg-[#100813]/86 backdrop-blur-xl">
        <div className="mx-auto flex w-[min(100%-2rem,1360px)] items-center justify-between gap-5 py-3">
          <Link href="/" className="flex min-w-0 shrink-0 items-center" aria-label="Lavie Home">
            <BrandWordmark />
          </Link>

          <nav className="hidden items-center gap-1.5 lg:flex">
            <Link className="nav-link" href="/#rooms">
              Khám Phá
            </Link>
            <Link className="nav-link" href="/checking">
              Tra Cứu
            </Link>
            <button className="nav-link cursor-pointer bg-transparent border-none text-left" onClick={() => setGuideOpen(true)}>
              Hướng Dẫn
            </button>
            <Link className="nav-link" href="/contacts">
              Chi Nhánh
            </Link>
            <Link className="primary-button ml-2 min-h-11 px-5 py-2.5 text-sm" href="/#booking">
              Đặt Phòng Ngay
            </Link>
          </nav>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 lg:hidden transition hover:bg-white/10 active:scale-95"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-sidebar"
            aria-label="Mở menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className={`mobile-drawer-shell lg:hidden ${mobileOpen ? "is-open" : ""}`}>
          <button className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)} aria-label="Đóng menu" />
          <aside id="mobile-sidebar" className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
            <div className="mobile-drawer-head" style={{ justifyContent: "flex-end" }}>
              <button className="mobile-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Đóng menu">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <Link className="mobile-drawer-link" href="/#rooms" onClick={() => setMobileOpen(false)}>
                Khám Phá Phòng
              </Link>
              <Link className="mobile-drawer-link" href="/checking" onClick={() => setMobileOpen(false)}>
                Tra Cứu Đặt Phòng
              </Link>
              <button
                className="mobile-drawer-link text-left bg-transparent border-none"
                onClick={() => {
                  setMobileOpen(false);
                  setGuideOpen(true);
                }}
              >
                Hướng Dẫn Sử Dụng
              </button>
              <Link className="mobile-drawer-link" href="/contacts" onClick={() => setMobileOpen(false)}>
                Hệ Thống Chi Nhánh
              </Link>
              <Link className="mobile-drawer-link is-primary justify-center" href="/#booking" onClick={() => setMobileOpen(false)}>
                Đặt Phòng Ngay
              </Link>
            </nav>

            <p className="mobile-drawer-note">Lavie Home self check-in 24/7</p>
          </aside>
        </div>
      </header>

      {guideOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 guide-modal-overlay"
          onClick={() => setGuideOpen(false)}
        >
          <div 
            className="glass-panel w-full max-w-xl overflow-hidden rounded-3xl p-6 md:p-8 relative guide-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 mobile-drawer-close"
              onClick={() => setGuideOpen(false)}
              aria-label="Đóng hướng dẫn"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <h2 className="text-xl font-extrabold text-pink-200 text-center border-b border-white/10 pb-4">
              Hướng Dẫn Sử Dụng
            </h2>

            <div className="mt-6 space-y-6 text-sm text-white/80 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <h3 className="font-extrabold text-white text-base mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-200 text-xs">1</span>
                  Dành cho khách hàng
                </h3>
                <ul className="list-disc pl-8 space-y-1.5 text-white/70">
                  <li>Tìm kiếm phòng phù hợp với yêu cầu của quý khách.</li>
                  <li>Chọn khung giờ và nhấn "Xác nhận đặt phòng".</li>
                  <li>Nhập thông tin người đặt và hoàn tất thanh toán.</li>
                  <li>Chờ xác nhận tự động hoặc từ lễ tân Tê Tê Home qua Zalo.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-200 text-xs">2</span>
                  Hủy đơn & Hoàn tiền
                </h3>
                <ul className="list-disc pl-8 space-y-1.5 text-white/70">
                  <li>Quý khách vui lòng gọi Hotline <a href="tel:0845828676" className="text-yellow-200 font-bold hover:underline">0845.828.676</a> để yêu cầu hủy.</li>
                  <li>Hoặc liên hệ tài khoản Zalo hỗ trợ.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-200 text-xs">3</span>
                  Hỗ trợ phát sinh
                </h3>
                <ul className="list-disc pl-8 space-y-1.5 text-white/70">
                  <li>Tê Tê Home sẵn sàng hỗ trợ 24/7 mọi vấn đề liên quan dịch vụ.</li>
                  <li>Vui lòng tuân thủ quy định an ninh tại chi nhánh.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
