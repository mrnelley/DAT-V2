import { Box, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const STATUS_COLOR = {
  on_track: '#006e5c',
  at_risk: '#f1ac49',
  off_track: '#db534c',
  no_data: '#e0e4ea',
};

const STATUS_LABEL = {
  on_track: 'On Track',
  at_risk: 'At Risk',
  off_track: 'Off Track',
  no_data: 'No Data',
};

export default function PriorityHeatmap({ heatmap = [] }) {
  return (
    <Box>
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.03 } },
        }}
        sx={{
          display: 'flex',
          gap: 0.75,
          overflowX: 'auto',
          pb: 1,
        }}
      >
        {heatmap.map((cell) => {
          const weekStart = dayjs(cell.weekStart);
          const tooltip = `Week ${cell.week} — ${STATUS_LABEL[cell.status]} · ${weekStart.format('MMM D')}–${weekStart.add(6, 'day').format('MMM D')}`;
          return (
            <Tooltip key={cell.week} title={tooltip} arrow placement="top">
              <Box
                component={motion.div}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400 } },
                }}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: STATUS_COLOR[cell.status],
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cell.status === 'no_data' ? 'text.secondary' : 'common.white',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                W{cell.week}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: STATUS_COLOR[key] }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
