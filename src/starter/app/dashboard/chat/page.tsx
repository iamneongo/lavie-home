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
import { Avatar, AvatarFallback } from '@/starter/components/ui/avatar';
import { Icons } from '@/starter/components/icons';
import { getBookingSnapshots } from '@/lib/homestay-dashboard';
import { money } from '@/lib/format';

export const metadata = {
  title: 'Dashboard: Hộp thư'
};

export default async function ChatPage() {
  const snapshots = await getBookingSnapshots(8);

  return (
    <PageContainer
      pageTitle='Hộp thư khách hàng'
      pageDescription='Tổng hợp tin nhắn, yêu cầu đặt phòng và các trao đổi cần phản hồi nhanh.'
      pageHeaderAction={
        <Badge variant='outline'>
          <Icons.chat />
          {snapshots.length} hội thoại
        </Badge>
      }
    >
      <div className='grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Danh sách hội thoại</CardTitle>
            <CardDescription>Các yêu cầu đặt phòng gần đây lấy trực tiếp từ booking thật.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {snapshots.map((snapshot) => {
              const initials = snapshot.guestName
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('');

              return (
                <div key={snapshot.id} className='flex items-center gap-4 rounded-lg border p-3'>
                  <Avatar className='h-10 w-10'>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-3'>
                      <div className='font-medium'>{snapshot.guestName}</div>
                      <Badge variant='outline'>{snapshot.status}</Badge>
                    </div>
                    <div className='text-muted-foreground truncate text-sm'>
                      {snapshot.room.card_name} · {snapshot.branch.name}
                    </div>
                    <div className='text-muted-foreground mt-1 text-xs'>
                      Kênh: {snapshot.channel} · {snapshot.dateLabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gợi ý phản hồi</CardTitle>
            <CardDescription>Các câu trả lời mẫu để chăm sóc khách nhanh hơn.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 text-sm'>
            <div className='rounded-lg border p-3'>
              <div className='font-medium'>Xác nhận phòng</div>
              <div className='text-muted-foreground mt-1'>
                Cảm ơn anh/chị đã chọn Lavie Home. Phòng đã được giữ chỗ và tổng phí hiện tại là {money(snapshots[0]?.amount ?? 0)}đ.
              </div>
            </div>
            <div className='rounded-lg border p-3'>
              <div className='font-medium'>Nhắc cọc</div>
              <div className='text-muted-foreground mt-1'>
                Em xin phép gửi thông tin cọc để giữ phòng cho booking sắp tới.
              </div>
            </div>
            <div className='rounded-lg border p-3'>
              <div className='font-medium'>Hướng dẫn check-in</div>
              <div className='text-muted-foreground mt-1'>
                Quý khách sẽ nhận hướng dẫn check-in chi tiết trước giờ đến từ 2 đến 3 tiếng.
              </div>
            </div>
          </CardContent>
          <CardFooter className='text-muted-foreground text-xs'>
            Gắn các kịch bản này vào CRM hoặc Zalo OA sau.
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
