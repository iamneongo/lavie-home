import Link from 'next/link';
import { ArrowRight, BedDouble, MapPin, MessageCircle, Phone } from 'lucide-react';

import { SiteHeader } from '@/components/site-header';
import { getPublicBranches, getPublicRooms } from '@/lib/homestay-dashboard';
import { compactPhone } from '@/lib/format';

export default async function ContactsPage() {
  const [branches, rooms] = await Promise.all([getPublicBranches(), getPublicRooms()]);

  return (
    <main className='site-shell min-h-dvh text-white'>
      <SiteHeader />
      <div className='mx-auto w-[min(100%-2rem,1360px)] pb-16 pt-32'>
        <section className='mb-8'>
          <p className='eyebrow'>Thông tin liên hệ</p>
          <h1 className='mt-2 text-3xl font-extrabold leading-tight tracking-[-0.025em] md:text-5xl'>Hệ thống chi nhánh</h1>
          <p className='mt-3 max-w-[62ch] text-sm font-semibold leading-6 text-white/62 md:text-[0.95rem]'>
            Chọn một cơ sở bên dưới để xem hotline, số lượng phòng và liên kết bản đồ của từng chi nhánh Lavie Home.
          </p>
        </section>

        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {branches.map((branch) => {
            const branchRooms = rooms.filter((room) => room.branch_id === branch.id);
            const parts = branch.name.split(' - ');
            const city = parts[0];
            const address = parts.slice(1).join(' - ') || 'Chi nhánh';

            return (
              <article
                key={branch.id}
                className='glass-panel flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-pink-200/40 hover:bg-white/7'
              >
                <div>
                  <p className='eyebrow'>{city}</p>
                  <h2 className='mt-2 text-lg font-extrabold'>{address}</h2>
                </div>
                <div className='space-y-3 text-sm font-semibold text-white/72'>
                  <div className='flex items-start gap-3'>
                    <MapPin size={18} className='mt-0.5 shrink-0 text-pink-200' />
                    <span>
                      {branch.name}
                    </span>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Phone size={18} className='mt-0.5 shrink-0 text-pink-200' />
                    <span>{branch.hotline}</span>
                  </div>
                  <div className='flex items-start gap-3'>
                    <BedDouble size={18} className='mt-0.5 shrink-0 text-pink-200' />
                    <span>{branchRooms.length} phòng đang hoạt động</span>
                  </div>
                </div>
                <div className='mt-auto flex flex-wrap gap-3 pt-2'>
                  <a
                    className='primary-button px-5 py-3 text-sm'
                    href={`tel:${compactPhone(branch.hotline)}`}
                  >
                    <Phone size={16} /> Gọi hotline
                  </a>
                  <a
                    className='primary-button bg-blue-600/20 border border-blue-500/30 px-5 py-3 text-sm text-blue-100 hover:bg-blue-600/30'
                    href={`https://zalo.me/${compactPhone(branch.hotline)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <MessageCircle size={16} /> Nhắn Zalo
                  </a>
                  <a
                    className='primary-button bg-white/5 border border-white/10 px-5 py-3 text-sm text-white hover:bg-white/10'
                    href={branch.google_maps_link}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Chỉ đường <ArrowRight size={16} className='ml-1' />
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
