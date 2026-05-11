import { Box, Stack, Typography, Chip, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { TYPE_META, TOUCHPOINT_STATUS } from '../../api/touchpoints';
import { formatRelative, formatTime } from '../../utils/formatters';

const STATUS_COLOR = {
  [TOUCHPOINT_STATUS.COMPLETED]: '#006e5c',
  [TOUCHPOINT_STATUS.SCHEDULED]: '#072c5e',
  [TOUCHPOINT_STATUS.NO_SHOW]: '#db534c',
};

const STATUS_LABEL = {
  completed: 'Completed', scheduled: 'Scheduled', no_show: 'No-show',
};

export default function TouchpointTimeline({ items = [], loading = false, dense = false }) {
  if (loading) {
    return (
      <Stack spacing={1.25}>
        {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={72} />)}
      </Stack>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No touchpoints logged yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1.25}>
      <AnimatePresence initial={false}>
        {items.map((t) => {
          const meta = TYPE_META[t.type] ?? { label: t.type };
          const color = STATUS_COLOR[t.status] ?? '#5a6475';
          const when = dayjs(t.occurredAt);
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: dense ? 1 : 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'rgba(94,184,168,0.05)' },
                }}
              >
                <Box sx={{ minWidth: 88, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>
                    {formatRelative(t.occurredAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatTime(t.occurredAt)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={0.75} sx={{ mb: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Chip size="small" label={meta.label} sx={{ bgcolor: 'rgba(7,44,94,0.08)', color: 'primary.main' }} />
                    <Chip size="small" label={STATUS_LABEL[t.status]} sx={{ bgcolor: color, color: 'common.white' }} />
                    {t.durationMin > 0 && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t.durationMin} min
                      </Typography>
                    )}
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {t.subject}
                  </Typography>
                  {t.outcome && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                      {t.outcome}
                    </Typography>
                  )}
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Stack>
  );
}
