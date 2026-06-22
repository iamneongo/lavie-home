'use client';

import { LabelList, Pie, PieChart } from 'recharts';

import { Badge } from '@/starter/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Icons } from '@/starter/components/icons';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/starter/components/ui/chart';
import type { BookingStatusPoint } from '@/lib/homestay-dashboard';

const statusColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

const chartConfig = {
  count: {
    label: 'Booking'
  },
  'Đã xác nhận': {
    label: 'Đã xác nhận',
    color: 'var(--chart-1)'
  },
  'Chờ cọc': {
    label: 'Chờ cọc',
    color: 'var(--chart-2)'
  },
  'Đang ở': {
    label: 'Đang ở',
    color: 'var(--chart-3)'
  },
  'Hoàn tất': {
    label: 'Hoàn tất',
    color: 'var(--chart-4)'
  }
} satisfies ChartConfig;

export function PieGraph({ data }: { data: BookingStatusPoint[] }) {
  const chartData = data.map((item, index) => ({
    status: item.status,
    count: item.count,
    fill: statusColors[index] ?? 'var(--chart-5)'
  }));
  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  const confirmed = chartData.find((item) => item.status === 'Đã xác nhận')?.count ?? 0;
  const confirmedShare = total ? Math.round((confirmed / total) * 100) : 0;

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>
          Trạng thái booking
          <Badge variant='outline'>
            <Icons.badgeCheck />
            {confirmedShare}%
          </Badge>
        </CardTitle>
        <CardDescription>Phân bổ booking theo trạng thái trong dữ liệu hiện tại.</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        <ChartContainer
          config={chartConfig}
          className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px] min-h-[250px]'
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey='status' hideLabel />} />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='status'
              innerRadius={30}
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey='count'
                stroke='none'
                fontSize={12}
                fontWeight={500}
                fill='currentColor'
                formatter={(value: number) => value.toString()}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
