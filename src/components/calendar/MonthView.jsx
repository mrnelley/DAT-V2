import { useMemo } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { SUBTYPE_META, APPROVAL_STATUS, SCOPE } from '../../utils/calendarTokens';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildGrid(anchor) {
  const startOfMonth = anchor.startOf('month');
  const gridStart = startOfMonth.startOf('week'); // Sunday by default
  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const day = gridStart.add(i, 'day');
    days.push({
      date: day,
      iso: day.format('YYYY-MM-DD'),
      inMonth: day.month() === anchor.month(),
      isToday: day.isSame(dayjs(), 'day'),
    });
  }
  return days;
}

function indexEvents(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = dayjs(item.startsAt).format('YYYY-MM-DD');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return map;
}

function EventChip({ item, onClick }) {
  const meta = SUBTYPE_META[item.subtype] ?? SUBTYPE_META.waypoint;
  const isGhost =
    item.scope === SCOPE.PERSONAL && item.approvalStatus === APPROVAL_STATUS.PENDING;
  return (
    <Tooltip title={item.title} placement="top" arrow>
      <Box
        component={motion.div}
        whileHover={{ x: 2 }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(item);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          borderLeft: `3px solid ${meta.dot}`,
          bgcolor: meta.soft,
          color: meta.fg,
          px: 0.75,
          py: 0.25,
          borderRadius: '4px',
          fontSize: 11.5,
          fontWeight: 600,
          cursor: 'pointer',
          opacity: isGhost ? 0.55 : 1,
          borderStyle: isGhost ? 'dashed' : 'solid',
          borderColor: isGhost ? meta.dot : 'transparent',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            minWidth: 0,
          }}
        >
          {item.title}
        </Box>
      </Box>
    </Tooltip>
  );
}

export default function MonthView({ anchor, items, onItemClick, onDayClick }) {
  const grid = useMemo(() => buildGrid(anchor), [anchor]);
  const byDay = useMemo(() => indexEvents(items), [items]);
  const MAX_PER_CELL = 3;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          bgcolor: '#f0f4f8',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {WEEKDAYS.map((d) => (
          <Box key={d} sx={{ py: 1, px: 1.5, textAlign: 'left' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
              {d.toUpperCase()}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {grid.map((cell, idx) => {
          const dayItems = byDay.get(cell.iso) ?? [];
          const overflow = dayItems.length - MAX_PER_CELL;
          return (
            <Box
              key={cell.iso}
              onClick={() => onDayClick?.(cell.date)}
              sx={{
                position: 'relative',
                minHeight: { xs: 96, md: 124 },
                borderRight: (idx + 1) % 7 === 0 ? 'none' : '1px solid',
                borderBottom: idx < 35 ? '1px solid' : 'none',
                borderColor: 'divider',
                bgcolor: cell.inMonth ? 'background.paper' : '#fafbfc',
                p: 0.75,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                cursor: 'pointer',
                transition: 'background 120ms ease',
                '&:hover': { bgcolor: 'rgba(94,184,168,0.06)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: cell.inMonth ? 'text.primary' : 'text.secondary',
                    bgcolor: cell.isToday ? 'primary.main' : 'transparent',
                    color: cell.isToday ? 'primary.contrastText' : (cell.inMonth ? 'text.primary' : 'text.secondary'),
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cell.date.date()}
                </Typography>
              </Box>

              {dayItems.slice(0, MAX_PER_CELL).map((it) => (
                <EventChip key={it.id} item={it} onClick={onItemClick} />
              ))}
              {overflow > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600, pl: 0.5 }}
                >
                  +{overflow} more
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
