import Link from 'next/link';

import PageContainer from '@/starter/components/layout/page-container';
import { Badge } from '@/starter/components/ui/badge';
import { Button, buttonVariants } from '@/starter/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Icons } from '@/starter/components/icons';
import { cn } from '@/starter/lib/utils';
import { getBranchSummaries } from '@/lib/homestay-dashboard';
import { money } from '@/lib/format';

export const metadata = {
  title: 'Dashboard: Chi nhánh'
};

export default async function WorkspacesPage() {
  const branches = await getBranchSummaries(12);
  const active = branches.filter((branch) => branch.status === 'Đang mở').length;

  return (
    <PageContainer
      pageTitle='Chi nhánh Lavie Home'
      pageDescription='Quản lý danh sách cơ sở, số phòng từng chi nhánh và trạng thái booking classic.'
      pageHeaderAction={
        <Link href='/dashboard/forms/basic' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.add className='mr-2 h-4 w-4' />
          Thêm chi nhánh
        </Link>
      }
    >
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <Card>
            <CardHeader>
              <CardDescription>Chi nhánh đang mở</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{active}</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Cơ sở sẵn sàng nhận booking.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Chi nhánh đang theo dõi</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>{branches.length}</CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Đồng bộ thông tin toàn hệ thống.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Giá trung bình</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>
                {branches.length ? `${money(Math.round(branches.reduce((sum, item) => sum + item.averageFrom, 0) / branches.length))}đ` : '0đ'}
              </CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Mức khởi điểm theo từng cơ sở.</CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Booking classic</CardDescription>
              <CardTitle className='text-2xl tabular-nums'>
                {branches.filter((branch) => branch.classic).length}
              </CardTitle>
            </CardHeader>
            <CardFooter className='text-muted-foreground text-sm'>Chi nhánh bật đặt phòng theo giờ.</CardFooter>
          </Card>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {branches.map((branch) => (
            <Card key={branch.branch.id}>
              <CardHeader>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <CardTitle className='text-lg'>{branch.branch.name}</CardTitle>
                    <CardDescription>{branch.address}</CardDescription>
                  </div>
                  <Badge variant={branch.status === 'Đang mở' ? 'default' : 'secondary'}>{branch.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Số phòng</span>
                  <span className='font-medium'>{branch.roomCount}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Giá từ</span>
                  <span className='font-medium'>{branch.averageFrom ? `${money(branch.averageFrom)}đ` : 'Chưa có dữ liệu'}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Mẫu nổi bật</span>
                  <span className='font-medium'>{branch.topRoom?.card_name ?? 'Chưa có phòng'}</span>
                </div>
              </CardContent>
              <CardFooter className='flex items-center justify-between gap-2'>
                <span className='text-muted-foreground text-xs'>
                  {branch.classic ? 'Đang hỗ trợ booking classic' : 'Chưa bật booking classic'}
                </span>
                <Button variant='outline' size='sm' asChild>
                  <Link href={branch.branch.google_maps_link} target='_blank' rel='noreferrer'>
                    <Icons.externalLink className='mr-2 h-4 w-4' />
                    Bản đồ
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
