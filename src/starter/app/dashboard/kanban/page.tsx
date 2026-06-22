import PageContainer from '@/starter/components/layout/page-container';
import { Badge } from '@/starter/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Icons } from '@/starter/components/icons';
import { getBookingSnapshots, getBookingStatusSummary } from '@/lib/homestay-dashboard';

export const metadata = {
  title: 'Dashboard: Vận hành'
};

export default async function KanbanPage() {
  const [bookings, statuses] = await Promise.all([getBookingSnapshots(12), getBookingStatusSummary(12)]);

  return (
    <PageContainer
      pageTitle='Bảng vận hành'
      pageDescription='Chia booking theo trạng thái để đội vận hành xử lý nhanh hơn.'
      pageHeaderAction={
        <Badge variant='outline'>
          <Icons.kanban />
          {bookings.length} booking
        </Badge>
      }
    >
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {statuses.map((status) => (
            <Card key={status.status}>
              <CardHeader>
                <CardDescription>{status.status}</CardDescription>
                <CardTitle className='text-2xl tabular-nums'>{status.count}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className='grid gap-4 xl:grid-cols-4'>
          {statuses.map((status) => {
            const laneBookings = bookings.filter((booking) => booking.status === status.status);

            return (
              <Card key={status.status} className='flex h-full flex-col'>
                <CardHeader>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <CardTitle className='text-lg'>{status.status}</CardTitle>
                      <CardDescription>{status.share}% tổng booking</CardDescription>
                    </div>
                    <Badge variant='outline'>{laneBookings.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {laneBookings.map((booking) => (
                    <div key={booking.id} className='rounded-lg border p-3 text-sm'>
                      <div className='font-medium'>{booking.guestName}</div>
                      <div className='text-muted-foreground'>{booking.room.card_name}</div>
                      <div className='text-muted-foreground mt-1 text-xs'>
                        {booking.branch.name} · {booking.dateLabel}
                      </div>
                    </div>
                  ))}
                  {laneBookings.length === 0 && (
                    <div className='text-muted-foreground text-sm'>Chưa có booking trong lane này.</div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
