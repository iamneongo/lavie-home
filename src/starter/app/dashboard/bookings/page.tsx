import Link from 'next/link';

import PageContainer from '@/starter/components/layout/page-container';
import { Badge } from '@/starter/components/ui/badge';
import { Button, buttonVariants } from '@/starter/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/starter/components/ui/table';
import { Icons } from '@/starter/components/icons';
import { cn } from '@/starter/lib/utils';
import { getBookingSnapshots, getBookingStatusSummary, getRevenueSummary } from '@/lib/homestay-dashboard';
import { money } from '@/lib/format';

export const metadata = {
  title: 'Dashboard: Booking'
};

export default async function BookingsPage() {
  const [bookings, statuses, revenue] = await Promise.all([
    getBookingSnapshots(12),
    getBookingStatusSummary(12),
    getRevenueSummary(12)
  ]);

  return (
    <PageContainer
      pageTitle='Quản lý booking'
      pageDescription='Theo dõi booking thật, trạng thái xác nhận và doanh thu ước tính cho Lavie Home.'
      pageHeaderAction={
        <Link href='/dashboard/overview' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.calendar className='mr-2 h-4 w-4' />
          Xem tổng quan
        </Link>
      }
    >
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <Card>
            <CardHeader>
              <CardDescription>Tổng booking</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{bookings.length}</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Dữ liệu lưu trong PostgreSQL.</CardFooter>
          </Card>
          {statuses.map((item) => (
            <Card key={item.status}>
              <CardHeader>
                <CardDescription>{item.status}</CardDescription>
                <CardTitle className='text-2xl tabular-nums'>{item.count}</CardTitle>
              </CardHeader>
              <CardFooter className='text-muted-foreground text-sm'>{item.share}% tổng booking</CardFooter>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách booking gần đây</CardTitle>
            <CardDescription>{`Tổng doanh thu: ${money(revenue.total)}đ`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-hidden rounded-lg border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách</TableHead>
                    <TableHead>Phòng</TableHead>
                    <TableHead>Chi nhánh</TableHead>
                    <TableHead>Ngày ở</TableHead>
                    <TableHead>Kênh</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className='text-right'>Giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className='font-medium'>{booking.guestName}</TableCell>
                      <TableCell>{booking.room.card_name}</TableCell>
                      <TableCell>{booking.branch.name}</TableCell>
                      <TableCell>
                        <div>
                          <div>{booking.dateLabel}</div>
                          <div className='text-muted-foreground text-xs'>{booking.timeRange}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.channel}</TableCell>
                      <TableCell>
                        <Badge variant='outline'>{booking.status}</Badge>
                      </TableCell>
                      <TableCell className='text-right font-medium'>{money(booking.amount)}đ</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className='flex items-center justify-between gap-3 text-sm'>
            <div className='text-muted-foreground'>Giá trung bình: {money(revenue.average)}đ</div>
            <Button variant='outline' size='sm' asChild>
              <Link href='/dashboard/billing'>
                <Icons.creditCard className='mr-2 h-4 w-4' />
                Xem doanh thu
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
