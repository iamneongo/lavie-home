import { BarGraph } from '@/starter/features/overview/components/bar-graph';
import { getPriceBands } from '@/lib/homestay-dashboard';

export default async function BarStats() {
  const data = await getPriceBands();
  return <BarGraph data={data} />;
}
