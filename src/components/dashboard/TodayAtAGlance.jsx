import { useMemo } from 'react';
import { Box, Card, Stack, Typography, Button, Chip } from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import TrendingUp from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useTouchpoints } from '../../hooks/useTouchpoints';
import { useOverduePeople } from '../../hooks/usePeople';
import useLogTouchpoint from '../touchpoints/TouchpointDialogProvider';
import { periodLabel, periodRange, PERIOD } from './PeriodSwitcher';
import { TYPE_META } from '../../api/touchpoints';
import { formatTime, formatRelative } from '../../utils/formatters';

const PERIOD_NOUN = {
  [PERIOD.DAY]: 'Today',
  [PERIOD.WEEK]: 'This week',
  [PERIOD.MONTH]: 'This month',
  [PERIOD.QUARTER]: 'This quarter',
  [PERIOD.YEAR]: 'This year',
};

export default function TodayAtAGlance({ period, anchor }) {
  const [start, end] = periodRange(period, anchor);
  const tpQ = useTouchpoints({
    from: start.toISOString(),
    to: end.toISOString(),
  });
  const overdueQ = useOverduePeople();
  const { openLog } = useLogTouchpoint();

  const items = tpQ.data ?? [];
  const scheduled = items.filter((t) => t.status === 'scheduled');
  const completed = items.filter((t) => t.status === 'completed');

  const overdueCount = (overdueQ.data ?? []).length;
  const noun = PERIOD_NOUN[period] ?? 'Period';

  return (
    <Card sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>
            {noun} · {periodLabel(period, anchor)}
          </Typography>
          <Typography variant="h2" sx={{ mt: 0.25 }}>
            {scheduled.length === 0
              ? `${completed.length} touchpoint${completed.length === 1 ? '' : 's'} logged`
              : `${scheduled.length} scheduled · ${completed.length} logged`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddOutlined />}
          onClick={() => openLog()}
          sx={{ alignSelf: { md: 'center' } }}
        >
          Log Touchpoint
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' } }}>
        <StatTile
          icon={<EventOutlined sx={{ color: 'primary.main' }} />}
          headline={scheduled.length}
          label="Scheduled"
          subtext={scheduled[0] ? `Next: ${scheduled[0].subject}` : 'Nothing scheduled'}
        />
        <StatTile
          icon={<TrendingUp sx={{ color: 'success.dark' }} />}
          headline={completed.length}
          label="Completed"
          subtext={completed[0] ? `Last: ${completed[0].subject}` : 'No logs yet'}
        />
        <StatTile
          icon={<WarningAmberOutlined sx={{ color: overdueCount > 0 ? 'error.main' : 'text.secondary' }} />}
          headline={overdueCount}
          label="Overdue contacts"
          subtext={
            overdueCount > 0
              ? `${(overdueQ.data ?? [])[0]?.name} is ${(overdueQ.data ?? [])[0]?.daysSince - (overdueQ.data ?? [])[0]?.cadenceDays}d overdue`
              : 'All cadences healthy'
          }
          accent={overdueCount > 0 ? 'rgba(219,83,76,0.06)' : null}
        />
      </Box>

      {scheduled.length > 0 && period === PERIOD.DAY && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Today's schedule
          </Typography>
          <Stack spacing={1}>
            {scheduled
              .slice()
              .sort((a, b) => dayjs(a.occurredAt).valueOf() - dayjs(b.occurredAt).valueOf())
              .map((t) => (
                <Box
                  key={t.id}
                  component={motion.div}
                  whileHover={{ x: 2 }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.25,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ minWidth: 64 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatTime(t.occurredAt)}</Typography>
                  </Box>
                  <Chip size="small" label={TYPE_META[t.type]?.label ?? t.type} sx={{ bgcolor: 'rgba(7,44,94,0.08)', color: 'primary.main' }} />
                  <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }} noWrap>{t.subject}</Typography>
                </Box>
              ))}
          </Stack>
        </Box>
      )}
    </Card>
  );
}

function StatTile({ icon, headline, label, subtext, accent }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: accent ?? 'background.paper',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
        {icon}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="h2">{headline}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }} noWrap>
        {subtext}
      </Typography>
    </Box>
  );
}
