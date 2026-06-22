import { AreaGraph } from '@/starter/features/overview/components/area-graph';
import { getTrendPoints } from '@/lib/homestay-dashboard';

export default async function AreaStats() {
  const data = await getTrendPoints();
  return <AreaGraph data={data} />;
}
