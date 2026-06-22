import Link from 'next/link';

import PageContainer from '@/starter/components/layout/page-container';
import { Badge } from '@/starter/components/ui/badge';
import { Button, buttonVariants } from '@/starter/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Icons } from '@/starter/components/icons';
import { cn } from '@/starter/lib/utils';
import { getRoomSummaries } from '@/lib/homestay-dashboard';
import { money } from '@/lib/format';

export const metadata = {
  title: 'Dashboard: Phòng'
};

export default async function ProductPage() {
  const rooms = await getRoomSummaries(8);
  const featured = rooms.filter((room) => room.isFeatured).length;

  return (
    <PageContainer
      pageTitle='Quản lý phòng'
      pageDescription='Cập nhật nội dung, mức giá, tiện ích và chi nhánh cho từng phòng trong catalogue.'
      pageHeaderAction={
        <Link href='/dashboard/forms/basic' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.add className='mr-2 h-4 w-4' />
          Thêm nội dung phòng
        </Link>
      }
    >
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <Card>
            <CardHeader>
              <CardDescription>Phòng nổi bật</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{featured}</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Giá cao hoặc tiện ích dày.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Phòng đang bán</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{rooms.length}</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Đang hiển thị trên site public.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Giá thấp nhất</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>
                {rooms.length ? `${money(Math.min(...rooms.map((room) => room.room.price_from)))}đ` : '0đ'}
              </CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Mức khởi điểm của catalogue.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Trạng thái nội dung</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>Đồng bộ</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Kiểm tra ảnh, tiện ích và mô tả.</CardFooter>
          </Card>
        </div>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {rooms.map((room) => (
            <Card key={room.room.id} className='overflow-hidden'>
              <div className='bg-muted aspect-[16/9] w-full overflow-hidden'>
                <img src={room.room.main_image} alt={room.room.card_name} className='h-full w-full object-cover' />
              </div>
              <CardHeader>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <CardTitle className='text-lg'>{room.room.card_name}</CardTitle>
                    <CardDescription>{room.branch.name}</CardDescription>
                  </div>
                  {room.isFeatured ? <Badge>Featured</Badge> : <Badge variant='outline'>{room.priceBand}</Badge>}
                </div>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Giá</span>
                  <span className='font-medium'>{`${money(room.room.price_from)}đ - ${money(room.room.price_to)}đ`}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Tiện ích</span>
                  <span className='font-medium'>{room.amenityCount}</span>
                </div>
                <div className='text-muted-foreground line-clamp-2'>{room.highlight}</div>
              </CardContent>
              <CardFooter className='flex items-center justify-between gap-2'>
                <span className='text-muted-foreground text-xs'>Đã đồng bộ với PostgreSQL</span>
                <Button variant='outline' size='sm' asChild>
                  <Link href='/dashboard/workspaces'>
                    <Icons.workspace className='mr-2 h-4 w-4' />
                    Xem chi nhánh
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
