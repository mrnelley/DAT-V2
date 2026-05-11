import {
  Drawer, Box, Stack, Typography, IconButton, Button, Divider, Chip,
  LinearProgress,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { motion } from 'framer-motion';
import UserAvatar from '../shared/UserAvatar';
import TouchpointTimeline from '../touchpoints/TouchpointTimeline';
import useLogTouchpoint from '../touchpoints/TouchpointDialogProvider';
import { useCircle } from '../../hooks/useCircles';
import { useTouchpoints } from '../../hooks/useTouchpoints';
import { STAGE_META } from '../../api/people';
import { formatRelative } from '../../utils/formatters';

export default function CircleDrawer({ circleId, open, onClose }) {
  const circleQ = useCircle(circleId);
  const touchpointsQ = useTouchpoints({ circleId: circleId ?? null });
  const { openLog } = useLogTouchpoint();

  const c = circleQ.data;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        component: motion.div,
        initial: { x: 480 }, animate: { x: 0 }, transition: { type: 'spring', stiffness: 280, damping: 26 },
        sx: { width: { xs: '100%', sm: 480 } },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Circle</Typography>
          <Typography variant="h3" sx={{ mt: 0.25 }} noWrap>{c?.name ?? 'Loading…'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </Box>
      <Divider />

      {c && (
        <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {c.description}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Members ({c.members?.length ?? 0})
            </Typography>
            <Button size="small" variant="outlined" startIcon={<AddOutlined />}
              onClick={() => openLog({ circleIds: [c.id] })}>
              Log Touchpoint
            </Button>
          </Stack>

          <Stack spacing={1} sx={{ mb: 3 }}>
            {(c.members ?? []).map((m) => {
              const stage = STAGE_META[m.stage] ?? STAGE_META.cold;
              const overdue = m.daysSince > m.cadenceDays;
              return (
                <Box
                  key={m.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.25,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: overdue ? 'rgba(219,83,76,0.05)' : 'background.paper',
                  }}
                >
                  <UserAvatar user={{ name: m.name }} size="md" />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{m.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                      {m.title} · {m.org}
                    </Typography>
                  </Box>
                  <Stack alignItems="flex-end" spacing={0.25}>
                    <Chip size="small" label={stage.label} sx={{ bgcolor: stage.soft, color: stage.fg }} />
                    <Typography variant="caption" sx={{ color: overdue ? 'error.main' : 'text.secondary', fontWeight: 600 }}>
                      {overdue ? `${m.daysSince - m.cadenceDays}d overdue` : `${m.daysSince}d ago`}
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Recent touchpoints
          </Typography>
          <TouchpointTimeline items={touchpointsQ.data ?? []} loading={touchpointsQ.isLoading} dense />
        </Box>
      )}
    </Drawer>
  );
}
