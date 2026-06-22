import PageContainer from '@/starter/components/layout/page-container';
import { Badge } from '@/starter/components/ui/badge';
import { Alert, AlertDescription } from '@/starter/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Icons } from '@/starter/components/icons';
import { getOperationalAlerts } from '@/lib/homestay-dashboard';

export const metadata = {
  title: 'Dashboard: Cảnh báo'
};

export default async function NotificationsPage() {
  const alerts = await getOperationalAlerts(8);

  return (
    <PageContainer
      pageTitle='Cảnh báo vận hành'
      pageDescription='Những điểm cần xử lý ngay để nội dung và vận hành homestay không bị lệch.'
      pageHeaderAction={
        <Badge variant='outline'>
          <Icons.warning />
          {alerts.length} mục cần chú ý
        </Badge>
      }
    >
      <div className='space-y-6'>
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertDescription>
            Danh sách này ưu tiên các vấn đề về ảnh, tiện ích và trạng thái chi nhánh để team dễ xử lý.
          </AlertDescription>
        </Alert>

        <div className='grid gap-4 md:grid-cols-2'>
          {alerts.map((alert) => (
            <Card key={alert.title}>
              <CardHeader>
                <div className='flex items-center justify-between gap-3'>
                  <CardTitle className='text-lg'>{alert.title}</CardTitle>
                  <Badge
                    variant={
                      alert.tone === 'critical' ? 'destructive' : alert.tone === 'warning' ? 'secondary' : 'outline'
                    }
                  >
                    {alert.tone}
                  </Badge>
                </div>
                <CardDescription>Mục ưu tiên trong dashboard nội bộ.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm leading-6'>{alert.detail}</p>
              </CardContent>
              <CardFooter className='text-muted-foreground text-xs'>
                Hãy xử lý trước khi cập nhật lên nội dung public.
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
