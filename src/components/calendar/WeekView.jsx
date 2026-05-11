import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { SUBTYPE_META, APPROVAL_STATUS, SCOPE } from '../../utils/calendarTokens';
import { formatTime } from '../../utils/formatters';

function buildWeek(anchor) {
  const start = anchor.startOf('week');
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
}

function indexEvents(items) {
  const map = new Map();
  items.forEach((it) => {
    const key = dayjs(it.startsAt).format('YYYY-MM-DD');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  });
  map.forEach((arr) =>
    arr.sort((a, b) => dayjs(a.startsAt).valueOf() - dayjs(b.startsAt).valueOf()),
  );
  return map;
}

export default function WeekView({ anchor, items, onItemClick, onDayClick }) {
  const week = useMemo(() => buildWeek(anchor), [anchor]);
  const byDay = useMemo(() => indexEvents(items), [items]);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(7, 1fr)' },
        }}
      >
        {week.map((day, idx) => {
          const items = byDay.get(day.format('YYYY-MM-DD')) ?? [];
          const isToday = day.isSame(dayjs(), 'day');
          return (
            <Box
              key={day.toString()}
              sx={{
                borderRight: { md: idx < 6 ? '1px solid' : 'none' },
                borderBottom: { xs: '1px solid', md: 'none' },
                borderColor: 'divider',
                minHeight: 220,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                onClick={() => onDayClick?.(day)}
                sx={{
                  px: 1.5,
                  py: 1,
                  bgcolor: isToday ? 'rgba(94,184,168,0.12)' : '#f0f4f8',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
                  {day.format('ddd').toUpperCase()}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    bgcolor: isToday ? 'primary.main' : 'transparent',
                    color: isToday ? 'primary.contrastText' : 'text.primary',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {day.date()}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {items.length === 0 ? (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}>
                    —
                  </Typography>
                ) : (
                  items.map((it) => {
                    const meta = SUBTYPE_META[it.subtype] ?? SUBTYPE_META.waypoint;
                    const isGhost =
                      it.scope === SCOPE.PERSONAL &&
                      it.approvalStatus === APPROVAL_STATUS.PENDING;
                    return (
                      <Box
                        key={it.id}
                        component={motion.div}
                        whileHover={{ y: -1 }}
                        onClick={() => onItemClick?.(it)}
                        sx={{
                          cursor: 'pointer',
                          p: 0.75,
                          borderRadius: 1.5,
                          borderLeft: `3px solid ${meta.dot}`,
                          bgcolor: meta.soft,
                          color: meta.fg,
                          opacity: isGhost ? 0.55 : 1,
                          borderStyle: isGhost ? 'dashed' : 'solid',
                          borderColor: isGhost ? meta.dot : 'transparent',
                        }}
                      >
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                          {it.allDay ? 'All day' : formatTime(it.startsAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {it.title}
                        </Typography>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
