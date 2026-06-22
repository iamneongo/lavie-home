'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Badge } from '@/starter/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Icons } from '@/starter/components/icons';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/starter/components/ui/chart';
import type { PriceBandPoint } from '@/lib/homestay-dashboard';

const chartConfig = {
  count: {
    label: 'Số phòng',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function BarGraph({ data }: { data: PriceBandPoint[] }) {
  const chartData = data;
  const topBand = [...chartData].sort((a, b) => b.count - a.count)[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Cơ cấu phòng theo mức giá
          <Badge variant='outline'>
            <Icons.trendingUp />
            {topBand ? `${topBand.share}%` : '0%'}
          </Badge>
        </CardTitle>
        <CardDescription>Cho biết dải giá nào đang chiếm nhiều phòng nhất trong catalogue.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='label' tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dashed' hideLabel />} />
            <Bar dataKey='count' fill='var(--color-count)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
