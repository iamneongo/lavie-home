import React from 'react';

import PageContainer from '@/starter/components/layout/page-container';
import { Badge } from '@/starter/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Icons } from '@/starter/components/icons';
import { getBookingStatusSummary, getBranchSummaries, getDashboardMetrics } from '@/lib/homestay-dashboard';

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const [metrics, bookingSummary, branchSummaries] = await Promise.all([
    getDashboardMetrics(),
    getBookingStatusSummary(12),
    getBranchSummaries(1)
  ]);
  const featuredBranch = branchSummaries[0];

  return (
    <PageContainer
      pageTitle='Bảng điều khiển homestay'
      pageDescription='Tổng hợp booking, phòng, chi nhánh, giá bán và chất lượng nội dung của Lavie Home.'
    >
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight md:text-3xl'>Tổng quan vận hành Lavie Home</h2>
            <p className='text-muted-foreground mt-1 max-w-3xl text-sm leading-6'>
              Đây là nơi nhìn nhanh tình trạng chi nhánh, phòng đang bán, mức giá và booking thật để đồng bộ với nội dung
              public site.
            </p>
          </div>
          <div className='hidden items-center gap-2 md:flex'>
            <Badge variant='outline'>
              <Icons.sparkles />
              Nội dung homestay
            </Badge>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {metrics.map((metric, index) => {
            const summary = bookingSummary[index % bookingSummary.length];
            const Icon =
              index === 0 ? Icons.dashboard : index === 1 ? Icons.product : index === 2 ? Icons.creditCard : Icons.badgeCheck;
            const note =
              index === 0 ? 'Booking đang theo dõi' : index === 1 ? 'Phân bổ theo chi nhánh' : index === 2 ? 'Giá khởi điểm trung bình' : 'Nội dung đủ dùng';

            return (
              <Card key={metric.label} className='@container/card'>
                <CardHeader>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                    {metric.value}
                  </CardTitle>
                  <CardAction>
                    <Badge variant='outline'>
                      <Icon />
                      {note}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                  <div className='line-clamp-1 flex gap-2 font-medium'>
                    {index === 0 ? (
                      <>
                        Booking đang theo dõi <Icons.calendar className='size-4' />
                      </>
                    ) : index === 1 ? (
                      <>
                        Phân bố theo chi nhánh <Icons.workspace className='size-4' />
                      </>
                    ) : index === 2 ? (
                      <>
                        Giá khởi điểm trung bình <Icons.trendingUp className='size-4' />
                      </>
                    ) : (
                      <>
                        Phòng có ảnh thật <Icons.check className='size-4' />
                      </>
                    )}
                  </div>
                  <div className='text-muted-foreground'>
                    {metric.note}
                    {summary ? ` · Trạng thái mẫu: ${summary.status}` : ''}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>{sales}</div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            <Card className='h-full'>
              <CardHeader>
                <CardDescription>Chi nhánh nổi bật</CardDescription>
                <CardTitle>{featuredBranch?.branch.name ?? 'Chưa có dữ liệu'}</CardTitle>
              </CardHeader>
              <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='font-medium'>{featuredBranch?.city ?? 'Đang cập nhật'}</div>
                <div className='text-muted-foreground'>
                  {featuredBranch
                    ? `${featuredBranch.roomCount} phòng · Giá từ ${featuredBranch.averageFrom.toLocaleString('vi-VN')}đ`
                    : 'Chưa xác định chi nhánh trọng tâm'}
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
