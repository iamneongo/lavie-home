import PageContainer from '@/starter/components/layout/page-container';
import { Badge } from '@/starter/components/ui/badge';
import { Alert, AlertDescription } from '@/starter/components/ui/alert';
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
import { getPriceBands, getRevenueSummary } from '@/lib/homestay-dashboard';
import { money } from '@/lib/format';

export const metadata = {
  title: 'Dashboard: Doanh thu'
};

export default async function BillingPage() {
  const [revenue, bands] = await Promise.all([getRevenueSummary(12), getPriceBands()]);

  return (
    <PageContainer
      pageTitle='Doanh thu homestay'
      pageDescription='Theo dõi doanh thu thật, giá trung bình và cơ cấu phòng theo dải giá.'
      pageHeaderAction={
        <Badge variant='outline'>
          <Icons.creditCard />
          Doanh thu thật
        </Badge>
      }
    >
      <div className='space-y-6'>
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertDescription>
            Số liệu dưới đây được suy ra từ catalogue phòng hiện tại để làm dashboard thật cho Lavie Home.
          </AlertDescription>
        </Alert>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <Card>
            <CardHeader>
              <CardDescription>Tổng doanh thu</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{money(revenue.total)}đ</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Tổng từ booking gần nhất.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Giá trung bình</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{money(revenue.average)}đ</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Giá trị trung bình theo booking thật.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Booking cao nhất</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{money(revenue.highest)}đ</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Đơn giá lớn nhất trong dữ liệu.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Booking thấp nhất</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{money(revenue.lowest)}đ</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Đơn giá nhỏ nhất trong dữ liệu.</CardFooter>
          </Card>
        </div>

        <div className='grid gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Cơ cấu giá phòng</CardTitle>
              <CardDescription>Kiểm tra dải giá nào đang chiếm tỷ trọng lớn nhất.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {bands.map((band) => (
                <div key={band.label} className='flex items-center justify-between rounded-lg border p-3'>
                  <div>
                    <div className='font-medium'>{band.label}</div>
                    <div className='text-muted-foreground text-sm'>{band.share}% catalogue</div>
                  </div>
                  <Badge variant='outline'>{band.count} phòng</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top booking gần đây</CardTitle>
              <CardDescription>Danh sách đơn thật giúp đọc nhanh doanh thu.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-hidden rounded-lg border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách</TableHead>
                      <TableHead>Chi nhánh</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className='text-right'>Giá</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenue.bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className='font-medium'>{booking.guestName}</TableCell>
                        <TableCell>{booking.branch.name}</TableCell>
                        <TableCell>{booking.status}</TableCell>
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
