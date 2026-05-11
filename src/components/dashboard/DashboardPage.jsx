import { useParams } from 'react-router-dom';
import { Box, Typography, Stack, Chip } from '@mui/material';
import PageWrapper from '../layout/PageWrapper';
import CompassCalendar from '../calendar/CompassCalendar';
import AdvocacyCockpit from './AdvocacyCockpit';
import CFOCockpit from './CFOCockpit';
import RealEstateCockpit from './RealEstateCockpit';
import PropertyMgmtCockpit from './PropertyMgmtCockpit';
import HRCockpit from './HRCockpit';
import ImpactCockpit from './ImpactCockpit';
import ResidentServicesCockpit from './ResidentServicesCockpit';
import useAuth from '../../hooks/useAuth';
import { DASHBOARD_VARIANT } from '../../api/users';

const VARIANT_TO_COCKPIT = {
  [DASHBOARD_VARIANT.ADVOCACY]: AdvocacyCockpit,
  [DASHBOARD_VARIANT.CFO]: CFOCockpit,
  [DASHBOARD_VARIANT.REAL_ESTATE_DEV]: RealEstateCockpit,
  [DASHBOARD_VARIANT.PROPERTY_MGMT]: PropertyMgmtCockpit,
  [DASHBOARD_VARIANT.HR]: HRCockpit,
  [DASHBOARD_VARIANT.IMPACT_ADVANCEMENT]: ImpactCockpit,
  [DASHBOARD_VARIANT.RESIDENT_SERVICES]: ResidentServicesCockpit,
};

export default function DashboardPage() {
  const { scope = 'me' } = useParams();
  const isCompany = scope === 'company';
  const { user } = useAuth();

  // /dashboard/me shape depends on user.dashboardVariant.
  // Each persona gets a role-tailored cockpit; the personal calendar
  // always lives as the bottom section inside that cockpit.
  if (!isCompany) {
    const Cockpit = VARIANT_TO_COCKPIT[user?.dashboardVariant];
    if (Cockpit) return <Cockpit />;
  }

  return (
    <PageWrapper>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: 'secondary.dark' }}>
          {isCompany ? 'Company View' : `${user?.name?.split(' ')[0] ?? 'My'}'s view`}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h1">
            {isCompany ? 'Company Dashboard' : 'My Dashboard'}
          </Typography>
          {!isCompany && <Chip size="small" label="Private" sx={{ bgcolor: 'rgba(7,44,94,0.08)' }} />}
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 720 }}>
          {isCompany
            ? 'Operational milestones, departmental hurdles, and community moments. Anyone in the org can see this view.'
            : 'Your personal calendar. Only you see what is here — but you can send items over to the Compass Calendar for org-wide visibility.'}
        </Typography>
      </Stack>

      <Box sx={{ mb: 4 }}>
        <CompassCalendar
          variant={isCompany ? 'org' : 'personal'}
          title={isCompany ? 'Compass Calendar' : 'My Personal Calendar'}
          subtitle={
            isCompany
              ? 'Operational milestones across the org'
              : 'Your private view — send items over for org-wide visibility'
          }
        />
      </Box>
    </PageWrapper>
  );
}
