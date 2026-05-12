import { Box, Stack, Typography, Skeleton, Button, Chip, Card } from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { motion } from 'framer-motion';
import UserAvatar from '../shared/UserAvatar';
import useLogTouchpoint from '../touchpoints/TouchpointDialogProvider';
import { useOverduePeople } from '../../hooks/usePeople';
import { STAGE_META } from '../../api/people';

export default function TopContactsList({ limit = 6 }) {
  const overdueQ = useOverduePeople();
  const { openLog } = useLogTouchpoint();
  const items = (overdueQ.data ?? []).slice(0, limit);

  if (overdueQ.isLoading) {
    return <Skeleton variant="rounded" height={280} />;
  }

  if (items.length === 0) {
    return (
      <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,110,92,0.05)', border: '1px dashed', borderColor: 'success.main' }}>
        <Typography variant="h4" sx={{ color: 'success.dark' }}>All cadences healthy</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Every contact has been touched within their target window.
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 0 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline" sx={{ color: 'error.dark' }}>
          Needs follow-up
        </Typography>
        <Typography variant="h3">Overdue contacts</Typography>
      </Box>
      <Stack divider={<Box sx={{ height: '1px', bgcolor: 'divider' }} />}>
        {items.map((p) => {
          const stage = STAGE_META[p.stage] ?? STAGE_META.cold;
          const daysOver = p.daysSince - p.cadenceDays;
          return (
            <Box
              key={p.id}
              component={motion.div}
              whileHover={{ x: 2 }}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}
            >
              <UserAvatar user={{ name: p.name }} size="md" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{p.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                  {p.title} · {p.org}
                </Typography>
              </Box>
              <Stack alignItems="flex-end" spacing={0.25}>
                <Chip size="small" label={stage.label} sx={{ bgcolor: stage.soft, color: stage.fg }} />
                <Typography variant="caption" sx={{ color: '#8a2b27', fontWeight: 700 }}>
                  {daysOver}d overdue
                </Typography>
              </Stack>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddOutlined />}
                onClick={() => openLog({ peopleIds: [p.id], circleIds: p.circles })}
              >
                Log
              </Button>
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}
