import { useParams } from 'react-router-dom';
import PlaceholderPage from '../shared/PlaceholderPage';

export default function DashboardPage() {
  const { scope = 'me' } = useParams();
  const isCompany = scope === 'company';
  return (
    <PlaceholderPage
      eyebrow={isCompany ? 'Company View' : 'Personal View'}
      title={isCompany ? 'Company Dashboard' : 'My Dashboard'}
      description={
        isCompany
          ? 'All departments rolled up. Critical Numbers, KPI gauges, and team filters land here.'
          : 'Critical Numbers and your owned KPIs. Quarter range selector, team filter, and edit-mode card reordering live here.'
      }
      tags={['KPI Gauge Cards', 'Critical Numbers', 'My KPIs']}
    />
  );
}
