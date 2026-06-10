import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lavie Home - Đặt Phòng Tự Check-in Tự Động 24/7",
  description:
    "Website đặt phòng Lavie Home với chọn chi nhánh, xem phòng, lịch đặt phòng demo và thông tin liên hệ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
