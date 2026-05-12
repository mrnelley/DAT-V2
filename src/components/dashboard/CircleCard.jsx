import { Card, CardActionArea, Box, Stack, Typography, LinearProgress, Chip } from '@mui/material';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import { motion } from 'framer-motion';
import { STAGE_ORDER, STAGE_META } from '../../api/people';
import { formatRelative } from '../../utils/formatters';

function temperatureLabel(avgStageScore) {
  // 0..3 → temperature label
  if (avgStageScore >= 2.5) return { label: 'Hot', dot: STAGE_META.champion.dot, fg: STAGE_META.champion.fg, soft: STAGE_META.champion.soft };
  if (avgStageScore >= 1.5) return { label: 'Warm', dot: STAGE_META.engaged.dot, fg: STAGE_META.engaged.fg, soft: STAGE_META.engaged.soft };
  if (avgStageScore >= 0.5) return { label: 'Cool', dot: STAGE_META.warm.dot, fg: STAGE_META.warm.fg, soft: STAGE_META.warm.soft };
  return { label: 'Cold', dot: STAGE_META.cold.dot, fg: STAGE_META.cold.fg, soft: STAGE_META.cold.soft };
}

export default function CircleCard({ circle, onClick }) {
  const temp = temperatureLabel(circle.averageStageScore ?? 0);
  // Decorative bar fill — used for the LinearProgress only.
  const healthBarColor =
    circle.cadenceHealth >= 80 ? '#006e5c'
      : circle.cadenceHealth >= 50 ? '#f1ac49'
        : '#db534c';
  // AA-safe text variant — used wherever the % renders as text on white.
  const healthTextColor =
    circle.cadenceHealth >= 80 ? '#004d40'  // 9.0:1
      : circle.cadenceHealth >= 50 ? '#8a5a14'  // 7.6:1
        : '#8a2b27';                              // 7.4:1
  return (
    <Card
      component={motion.div}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      sx={{ height: '100%', borderTop: `4px solid ${circle.color}` }}
    >
      <CardActionArea onClick={() => onClick?.(circle)} sx={{ height: '100%', alignItems: 'flex-start' }} component="div">
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
            <GroupOutlined sx={{ color: circle.color }} />
            <Typography variant="body1" sx={{ fontWeight: 700, flex: 1, minWidth: 0 }} noWrap>
              {circle.name}
            </Typography>
            <Chip
              size="small"
              label={temp.label}
              sx={{ bgcolor: temp.soft, color: temp.fg, textTransform: 'none' }}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1.5 }}>
            {circle.description}
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {circle.memberCount} members
            </Typography>
            <Typography variant="caption" sx={{ color: healthTextColor, fontWeight: 700 }}>
              {circle.cadenceHealth}% on-cadence
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={circle.cadenceHealth}
            sx={{
              mt: 0.5,
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(7,44,94,0.06)',
              '& .MuiLinearProgress-bar': { bgcolor: healthBarColor },
            }}
          />
          {circle.lastTouch && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: 'text.secondary' }}>
              Last touch: {formatRelative(circle.lastTouch)}
            </Typography>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
