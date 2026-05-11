import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tabs,
  Tab,
  Typography,
  Skeleton,
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import AddOutlined from '@mui/icons-material/AddOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import MonthView from './MonthView';
import WeekView from './WeekView';
import UpcomingView from './UpcomingView';
import PendingApprovalTray from './PendingApprovalTray';
import CalendarItemDetailDrawer from './CalendarItemDetailDrawer';
import {
  useOrgCalendarItems,
  usePendingOrgItems,
  usePersonalCalendarItems,
} from '../../hooks/useCalendar';
import useAddToCalendar from '../shared/CalendarDialogProvider';
import usePermissions from '../../hooks/usePermissions';
import { ROLES } from '../../utils/permissions';
import { SCOPE } from '../../utils/calendarTokens';

const VIEWS = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'upcoming', label: 'Upcoming' },
];

export default function CompassCalendar({
  variant = 'org', // 'org' | 'personal'
  title = 'Compass Calendar',
  subtitle = 'Operational milestones across the org',
}) {
  const isPersonal = variant === 'personal';
  const [anchor, setAnchor] = useState(dayjs());
  const [view, setView] = useState('month');
  const [selected, setSelected] = useState(null);

  const { can } = usePermissions();
  const { openCreate } = useAddToCalendar();

  const orgQuery = useOrgCalendarItems();
  const personalQuery = usePersonalCalendarItems();
  const pendingQuery = usePendingOrgItems();

  const baseItems = isPersonal ? personalQuery.data ?? [] : orgQuery.data ?? [];
  const pendingItems = pendingQuery.data ?? [];
  const isLoading = isPersonal ? personalQuery.isLoading : orgQuery.isLoading;

  // For the org calendar, admins also see pending items rendered ghosted.
  const displayItems = useMemo(() => {
    if (isPersonal) return baseItems;
    if (can([ROLES.ELT])) {
      return [...baseItems, ...pendingItems];
    }
    return baseItems;
  }, [isPersonal, baseItems, pendingItems, can]);

  const periodLabel = useMemo(() => {
    if (view === 'month') return anchor.format('MMMM YYYY');
    if (view === 'week') {
      const start = anchor.startOf('week');
      const end = anchor.endOf('week');
      return `${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`;
    }
    return 'Next 30 days';
  }, [view, anchor]);

  const step = (dir) => {
    if (view === 'month') setAnchor((a) => a.add(dir, 'month'));
    else if (view === 'week') setAnchor((a) => a.add(dir, 'week'));
    else setAnchor((a) => a.add(dir * 30, 'day'));
  };

  const today = () => setAnchor(dayjs());

  const visibleItems = useMemo(() => {
    if (view === 'month') {
      const s = anchor.startOf('month').startOf('week');
      const e = anchor.endOf('month').endOf('week');
      return displayItems.filter((it) => {
        const d = dayjs(it.startsAt);
        return d.isAfter(s.subtract(1, 'day')) && d.isBefore(e.add(1, 'day'));
      });
    }
    if (view === 'week') {
      const s = anchor.startOf('week');
      const e = anchor.endOf('week');
      return displayItems.filter((it) => {
        const d = dayjs(it.startsAt);
        return d.isAfter(s.subtract(1, 'minute')) && d.isBefore(e.add(1, 'minute'));
      });
    }
    // upcoming
    return displayItems.filter((it) => {
      const d = dayjs(it.startsAt);
      return d.isAfter(dayjs().subtract(1, 'day')) && d.isBefore(dayjs().add(30, 'day'));
    });
  }, [view, anchor, displayItems]);

  const handleDayClick = (day) => {
    openCreate({
      seed: {
        startsAt: day.hour(9).minute(0).toISOString(),
        endsAt: day.hour(10).minute(0).toISOString(),
      },
      defaultScope: isPersonal ? SCOPE.PERSONAL : SCOPE.ORG,
    });
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ md: 'flex-end' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <EventOutlined sx={{ color: 'secondary.main' }} />
            <Typography variant="overline" sx={{ color: 'secondary.dark' }}>
              {isPersonal ? 'Personal' : 'Org-wide'}
            </Typography>
          </Stack>
          <Typography variant="h2" sx={{ mt: 0.25 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {!isPersonal && can([ROLES.ELT]) && (
            <PendingApprovalTray items={pendingItems} onSelect={setSelected} />
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlined />}
            onClick={() =>
              openCreate({ defaultScope: isPersonal ? SCOPE.PERSONAL : SCOPE.ORG })
            }
          >
            Add New
          </Button>
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Tabs
          value={view}
          onChange={(_e, v) => setView(v)}
          sx={{ minHeight: 36 }}
          TabIndicatorProps={{ sx: { bgcolor: 'primary.main', height: 3 } }}
        >
          {VIEWS.map((v) => (
            <Tab key={v.id} value={v.id} label={v.label} sx={{ minHeight: 36 }} />
          ))}
        </Tabs>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" onClick={() => step(-1)}>
            <ChevronLeft />
          </IconButton>
          <Box
            onClick={today}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              minWidth: 200,
              textAlign: 'center',
              fontWeight: 600,
              color: 'primary.main',
              '&:hover': { bgcolor: 'rgba(7,44,94,0.04)' },
            }}
          >
            {periodLabel}
          </Box>
          <IconButton size="small" onClick={() => step(1)}>
            <ChevronRight />
          </IconButton>
        </Stack>
      </Stack>

      <AnimatePresence mode="wait">
        <motion.div
          key={view + isLoading}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {isLoading ? (
            <Skeleton variant="rounded" height={view === 'upcoming' ? 320 : 560} />
          ) : view === 'month' ? (
            <MonthView
              anchor={anchor}
              items={visibleItems}
              onItemClick={setSelected}
              onDayClick={handleDayClick}
            />
          ) : view === 'week' ? (
            <WeekView
              anchor={anchor}
              items={visibleItems}
              onItemClick={setSelected}
              onDayClick={handleDayClick}
            />
          ) : (
            <UpcomingView items={visibleItems} onItemClick={setSelected} />
          )}
        </motion.div>
      </AnimatePresence>

      <CalendarItemDetailDrawer
        open={Boolean(selected)}
        item={selected}
        onClose={() => setSelected(null)}
      />
    </Box>
  );
}
