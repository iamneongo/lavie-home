import PageContainer from '@/starter/components/layout/page-container';
import { Button } from '@/starter/components/ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/starter/components/ui/tabs';
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { RecentSales } from './recent-sales';
import { Icons } from '@/starter/components/icons';
import { Badge } from '@/starter/components/ui/badge';
import {
  getBookingStatusSummary,
  getDashboardMetrics,
  getPriceBands,
  getTrendPoints
} from '@/lib/homestay-dashboard';

export default async function OverViewPage() {
  const [metrics, barData, pieData, areaData] = await Promise.all([
    getDashboardMetrics(),
    getPriceBands(),
    getBookingStatusSummary(12),
    getTrendPoints()
  ]);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Tổng quan Lavie Home</h2>
          <div className='hidden items-center space-x-2 md:flex'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics' disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
              {metrics.map((metric, index) => (
                <Card key={metric.label} className='@container/card'>
                  <CardHeader>
                    <CardDescription>{metric.label}</CardDescription>
                    <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                      {metric.value}
                    </CardTitle>
                    <CardAction>
                      <Badge variant='outline'>
                        {index === 0 ? <Icons.dashboard /> : index === 1 ? <Icons.product /> : index === 2 ? <Icons.creditCard /> : <Icons.badgeCheck />}
                        {index === 0 ? 'Cơ sở' : index === 1 ? 'Phòng' : index === 2 ? 'Giá' : 'Nội dung'}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                    <div className='line-clamp-1 flex gap-2 font-medium'>
                      {metric.label}
                      <Icons.trendingUp className='size-4' />
                    </div>
                    <div className='text-muted-foreground'>{metric.note}</div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <div className='col-span-4'>
                <BarGraph data={barData} />
              </div>
              <Card className='col-span-4 md:col-span-3'>
                <RecentSales />
              </Card>
              <div className='col-span-4'>
                <AreaGraph data={areaData} />
              </div>
              <div className='col-span-4 md:col-span-3'>
                <PieGraph data={pieData} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
