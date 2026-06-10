"use client";

import Link from "next/link";
import { BedDouble, Bolt, CircleHelp, MapPin, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { BrandWordmark } from "@/components/brand-wordmark";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#100813]/86 backdrop-blur-xl">
      <div className="mx-auto flex w-[min(100%-2rem,1360px)] items-center justify-between gap-5 py-3">
        <Link href="/" className="flex min-w-0 shrink-0 items-center" aria-label="Lavie Home">
          <BrandWordmark />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          <Link className="nav-link" href="/#rooms">
            <BedDouble size={16} /> Khám Phá
          </Link>
          <Link className="nav-link" href="/checking">
            <Search size={16} /> Tra Cứu
          </Link>
          <Link className="nav-link" href="/#guide">
            <CircleHelp size={16} /> Hướng Dẫn
          </Link>
          <Link className="nav-link" href="/contacts">
            <MapPin size={16} /> Chi Nhánh
          </Link>
          <Link className="primary-button ml-2 min-h-11 px-5 py-2.5 text-sm" href="/#booking">
            <Bolt size={16} /> Đặt Phòng Ngay
          </Link>
        </nav>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Mở menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#140a1d] px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-md gap-2 text-sm font-bold">
            <Link className="mobile-link" href="/#rooms" onClick={() => setMobileOpen(false)}>
              Khám Phá Phòng
            </Link>
            <Link className="mobile-link" href="/checking" onClick={() => setMobileOpen(false)}>
              Tra Cứu Đặt Phòng
            </Link>
            <Link className="mobile-link" href="/contacts" onClick={() => setMobileOpen(false)}>
              Hệ Thống Chi Nhánh
            </Link>
            <Link className="mobile-link" href="/#guide" onClick={() => setMobileOpen(false)}>
              Hướng Dẫn Check-in
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
