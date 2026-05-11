// Generic cockpit shell used by every non-CEO persona dashboard.
// Composition: header → period switcher → flagship widget → my priorities
// (period-scoped) → my workplans → personal calendar.
import { useMemo, useState } from 'react';
import { Box, Stack, Typography, Skeleton, Button, Divider, Chip } from '@mui/material';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import PageWrapper from '../layout/PageWrapper';
import UserAvatar from '../shared/UserAvatar';
import useAuth from '../../hooks/useAuth';
import PeriodSwitcher, { PERIOD, periodLabel } from './PeriodSwitcher';
import PriorityRow from '../priorities/PriorityRow';
import WorkplanCard from '../workplans/WorkplanCard';
import CompassCalendar from '../calendar/CompassCalendar';
import { usePriorities } from '../../hooks/usePriorities';
import { useWorkplans } from '../../hooks/useWorkplans';
import { useInitiatives } from '../../hooks/useInitiatives';
import { TIME_SCOPE } from '../../api/priorities';

const PERIOD_TO_SCOPE = {
  [PERIOD.DAY]: TIME_SCOPE.WEEK,
  [PERIOD.WEEK]: TIME_SCOPE.WEEK,
  [PERIOD.MONTH]: TIME_SCOPE.MONTH,
  [PERIOD.QUARTER]: TIME_SCOPE.QUARTER,
  [PERIOD.YEAR]: TIME_SCOPE.QUARTER,
};

function SectionHeader({ icon, title, subtitle, action }) {
  return (
    <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Box>
          <Typography variant="h3">{title}</Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{subtitle}</Typography>
          )}
        </Box>
      </Stack>
      {action}
    </Stack>
  );
}

export default function RoleCockpit({
  flagship,                  // ReactNode — the persona's flagship widget
  flagshipTitle,             // optional eyebrow under the persona name
  flagshipSubtitle,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState(PERIOD.WEEK);
  const anchor = dayjs();

  const prioritiesQ = usePriorities();
  const workplansQ = useWorkplans({ ownerId: user?.id });
  const initiativesQ = useInitiatives();

  const scope = PERIOD_TO_SCOPE[period];

  const myPriorities = useMemo(() => {
    const mine = (prioritiesQ.data ?? []).filter((p) => p.owner?.id === user?.id);
    if (period === PERIOD.YEAR) return mine;
    return mine.filter((p) => !p.timeScope || p.timeScope === scope);
  }, [prioritiesQ.data, user, period, scope]);

  const myWorkplans = workplansQ.data ?? [];

  return (
    <PageWrapper>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <UserAvatar user={user} size="xl" sx={{ bgcolor: user?.accent }} />
          <Box>
            <Typography variant="overline" sx={{ color: 'secondary.dark' }}>
              {user?.tagline} · {user?.title}
            </Typography>
            <Typography variant="h1" sx={{ lineHeight: 1.1 }}>
              {user?.name?.split(' ')[0]}'s Helm
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user?.department} · {periodLabel(period, anchor)}
            </Typography>
          </Box>
        </Stack>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: { md: 'right' } }}>
            Time scope
          </Typography>
          <PeriodSwitcher value={period} onChange={setPeriod} />
        </Box>
      </Stack>

      {/* Flagship widget for this persona */}
      {flagship && (
        <Box sx={{ mb: 4 }}>
          {(flagshipTitle || flagshipSubtitle) && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <Chip
                label={user?.department}
                size="small"
                sx={{ bgcolor: user?.accent, color: 'common.white', fontWeight: 700 }}
              />
              {flagshipTitle && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {flagshipTitle}
                </Typography>
              )}
            </Stack>
          )}
          {flagship}
        </Box>
      )}

      {/* My priorities (period-scoped) */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader
          icon={<FlagOutlined sx={{ color: 'secondary.main' }} />}
          title={`My priorities · ${period === PERIOD.YEAR ? 'all scopes' : `scoped to ${period === PERIOD.DAY ? 'this week' : 'this ' + period}`}`}
          subtitle={`${myPriorities.length} active`}
          action={
            <Button size="small" variant="outlined" endIcon={<OpenInNewOutlined fontSize="small" />} onClick={() => navigate('/priorities')}>
              Open Priorities
            </Button>
          }
        />
        {prioritiesQ.isLoading ? (
          <Stack spacing={1.25}>{[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={84} />)}</Stack>
        ) : myPriorities.length === 0 ? (
          <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No priorities at this scope. Try a different time scope.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.25}>
            {myPriorities.map((p) => (
              <PriorityRow key={p.id} priority={p} onEdit={() => navigate('/priorities')} onDelete={() => navigate('/priorities')} />
            ))}
          </Stack>
        )}
      </Box>

      {/* My workplans */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader
          icon={<AccountTreeOutlined sx={{ color: 'secondary.main' }} />}
          title="Workplans I own"
          subtitle="Mid-tier — between initiatives and priorities"
          action={
            <Button size="small" variant="outlined" endIcon={<OpenInNewOutlined fontSize="small" />} onClick={() => navigate('/workplans')}>
              Open Workplans
            </Button>
          }
        />
        {workplansQ.isLoading ? (
          <Stack spacing={1.25}>{[1, 2].map((i) => <Skeleton key={i} variant="rounded" height={108} />)}</Stack>
        ) : myWorkplans.length === 0 ? (
          <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No workplans owned at this time.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.25}>
            {myWorkplans.map((w) => {
              const init = (initiativesQ.data ?? []).find((i) => i.id === w.initiativeId);
              return <WorkplanCard key={w.id} workplan={w} initiativeTitle={init?.title} />;
            })}
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Personal calendar — always lives beneath dashboard/me */}
      <Box sx={{ mb: 2 }}>
        <SectionHeader
          icon={<EventOutlined sx={{ color: 'secondary.main' }} />}
          title="My Personal Calendar"
          subtitle="Private to you — send any item to Compass Calendar for org visibility"
        />
        <CompassCalendar
          variant="personal"
          title="My Personal Calendar"
          subtitle="Private events you own; promote to org with one click."
        />
      </Box>
    </PageWrapper>
  );
}
