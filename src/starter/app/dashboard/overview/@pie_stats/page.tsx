import { PieGraph } from '@/starter/features/overview/components/pie-graph';
import { getBookingStatusSummary } from '@/lib/homestay-dashboard';

export default async function Stats() {
  const data = await getBookingStatusSummary(12);
  return <PieGraph data={data} />;
}
