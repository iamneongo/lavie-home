'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Badge } from '@/starter/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/starter/components/ui/card';
import { Icons } from '@/starter/components/icons';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/starter/components/ui/chart';
import type { TrendPoint } from '@/lib/homestay-dashboard';

const chartConfig = {
  bookings: {
    label: 'Booking',
    color: 'var(--chart-1)'
  },
  premium: {
    label: 'Phòng premium',
    color: 'var(--chart-2)'
  },
  occupancy: {
    label: 'Tỷ lệ lấp đầy',
    color: 'var(--chart-3)'
  }
} satisfies ChartConfig;

export function AreaGraph({ data }: { data: TrendPoint[] }) {
  const chartData = data;
  const first = chartData[0];
  const last = chartData[chartData.length - 1];
  const growth = first && last ? Math.max(0, Math.round(((last.bookings - first.bookings) / Math.max(first.bookings, 1)) * 100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Xu hướng booking 6 tháng
          <Badge variant='outline'>
            <Icons.trendingUp />
            +{growth}%
          </Badge>
        </CardTitle>
        <CardDescription>Theo dõi booking, phòng premium và độ lấp đầy của hệ thống.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <DottedBackgroundPattern config={chartConfig} />
            </defs>
            <Area
              dataKey='bookings'
              type='natural'
              fill='url(#dotted-background-pattern-bookings)'
              fillOpacity={0.35}
              stroke='var(--color-bookings)'
              stackId='a'
              strokeWidth={1.5}
            />
            <Area
              dataKey='premium'
              type='natural'
              fill='url(#dotted-background-pattern-premium)'
              fillOpacity={0.35}
              stroke='var(--color-premium)'
              stackId='a'
              strokeWidth={1.5}
            />
            <Area
              dataKey='occupancy'
              type='natural'
              fill='url(#dotted-background-pattern-occupancy)'
              fillOpacity={0.2}
              stroke='var(--color-occupancy)'
              stackId='a'
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const DottedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.fromEntries(Object.entries(config).map(([key, value]) => [key, value.color]));

  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <pattern
          key={key}
          id={`dotted-background-pattern-${key}`}
          x='0'
          y='0'
          width='7'
          height='7'
          patternUnits='userSpaceOnUse'
        >
          <circle cx='5' cy='5' r='1.5' fill={value} opacity={0.5} />
        </pattern>
      ))}
    </>
  );
};
