import PageContainer from '@/starter/components/layout/page-container';
import { Badge } from '@/starter/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/starter/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/starter/components/ui/table';
import { Icons } from '@/starter/components/icons';
import { getBookingSnapshots, getGuestSummaries } from '@/lib/homestay-dashboard';
import { money } from '@/lib/format';

export const metadata = {
  title: 'Dashboard: Khách lưu trú'
};

export default async function UsersPage() {
  const [guests, bookings] = await Promise.all([getGuestSummaries(8), getBookingSnapshots(8)]);

  return (
    <PageContainer
      pageTitle='Khách lưu trú'
      pageDescription='Theo dõi khách quay lại, tổng chi tiêu và lịch lưu trú gần đây.'
      pageHeaderAction={
        <Badge variant='outline'>
          <Icons.teams />
          {guests.length} khách mẫu
        </Badge>
      }
    >
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <Card>
            <CardHeader>
              <CardDescription>Khách mẫu</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{guests.length}</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Danh sách khách đã từng đặt phòng.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Booking gần nhất</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{bookings.length}</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Cần xử lý chăm sóc tiếp theo.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Tổng chi tiêu</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>
                {money(guests.reduce((sum, guest) => sum + guest.totalSpent, 0))}đ
              </CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Từ dữ liệu booking thật.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Khách quay lại</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>
                {guests.filter((guest) => guest.bookings > 1).length}
              </CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Khách có hơn một lần lưu trú.</CardFooter>
          </Card>
        </div>

        <div className='grid gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Top khách theo chi tiêu</CardTitle>
              <CardDescription>Ưu tiên chăm sóc lại những khách có tần suất cao.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {guests.map((guest) => (
                <div key={guest.guestName} className='flex items-center justify-between gap-4 rounded-lg border p-3'>
                  <div>
                    <div className='font-medium'>{guest.guestName}</div>
                    <div className='text-muted-foreground text-sm'>
                      {guest.bookings} booking · {guest.branches.join(', ')}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium'>{money(guest.totalSpent)}đ</div>
                    <div className='text-muted-foreground text-xs'>Lần cuối: {guest.latestStay}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lịch lưu trú gần đây</CardTitle>
              <CardDescription>Các booking gần nhất kèm chi nhánh và giá trị đơn.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-hidden rounded-lg border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách</TableHead>
                      <TableHead>Phòng</TableHead>
                      <TableHead>Chi nhánh</TableHead>
                      <TableHead className='text-right'>Giá</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className='font-medium'>{booking.guestName}</TableCell>
                        <TableCell>{booking.room.card_name}</TableCell>
                        <TableCell>{booking.branch.name}</TableCell>
                        <TableCell className='text-right'>{money(booking.amount)}đ</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
