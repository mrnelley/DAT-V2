import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import ExploreOutlined from '@mui/icons-material/ExploreOutlined';
import PageWrapper from '../layout/PageWrapper';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <EmptyState
        icon={ExploreOutlined}
        title="Off the map"
        description="That route does not exist. Use the side navigation or return to your dashboard."
        actionLabel="Back to Dashboard"
        onAction={() => navigate('/dashboard/me')}
      />
    </PageWrapper>
  );
}
