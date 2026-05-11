import { useMemo } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import {
  SUBTYPE_META,
  APPROVAL_STATUS,
  SCOPE,
  PROPERTY_LABEL,
} from '../../utils/calendarTokens';
import { formatRelative, formatTime } from '../../utils/formatters';
import EmptyState from '../shared/EmptyState';
import EventBusyOutlined from '@mui/icons-material/EventBusyOutlined';

function groupByDay(items) {
  const sorted = [...items].sort(
    (a, b) => dayjs(a.startsAt).valueOf() - dayjs(b.startsAt).valueOf(),
  );
  const map = new Map();
  sorted.forEach((it) => {
    const key = dayjs(it.startsAt).format('YYYY-MM-DD');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  });
  return Array.from(map.entries());
}

export default function UpcomingView({ items, onItemClick }) {
  const groups = useMemo(() => groupByDay(items), [items]);

  if (!items?.length) {
    return (
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <EmptyState
          icon={EventBusyOutlined}
          title="Nothing for this period."
          description="Add something with the Add New button, or send a personal item over for org-wide visibility."
        />
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {groups.map(([day, dayItems]) => {
        const d = dayjs(day);
        return (
          <Box
            key={day}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: '#f0f4f8',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'baseline',
                gap: 1.5,
              }}
            >
              <Typography variant="h4" sx={{ color: 'primary.main' }}>
                {formatRelative(d)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {d.format('dddd, MMM D')}
              </Typography>
            </Box>
            <Box sx={{ p: 1 }}>
              {dayItems.map((it) => {
                const meta = SUBTYPE_META[it.subtype] ?? SUBTYPE_META.waypoint;
                const isGhost =
                  it.scope === SCOPE.PERSONAL &&
                  it.approvalStatus === APPROVAL_STATUS.PENDING;
                return (
                  <Box
                    key={it.id}
                    component={motion.div}
                    whileHover={{ x: 2 }}
                    onClick={() => onItemClick?.(it)}
                    sx={{
                      cursor: 'pointer',
                      px: 1.5,
                      py: 1.25,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      borderRadius: 2,
                      opacity: isGhost ? 0.55 : 1,
                      '&:hover': { bgcolor: 'rgba(94,184,168,0.06)' },
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 76,
                        textAlign: 'center',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1.5,
                        bgcolor: meta.soft,
                        color: meta.fg,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                        {it.allDay ? 'All day' : formatTime(it.startsAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                        {it.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {PROPERTY_LABEL[it.propertyOrDepartment] ?? '—'}
                        {it.owner ? ` · ${it.owner.name}` : ''}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 4,
                        alignSelf: 'stretch',
                        borderRadius: 4,
                        bgcolor: meta.dot,
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
