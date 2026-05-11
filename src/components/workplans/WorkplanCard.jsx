import { Card, CardActionArea, Box, Stack, Typography, LinearProgress, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../shared/UserAvatar';
import { WORKPLAN_STATUS } from '../../api/workplans';
import { PROPERTY_LABEL } from '../../utils/calendarTokens';
import { priorityStatusToText } from '../../utils/a11yColors';

// Decorative — left-rail accent + progress fill only. NOT for text.
const STATUS_DECOR = {
  [WORKPLAN_STATUS.ON_TRACK]: '#006e5c',
  [WORKPLAN_STATUS.AT_RISK]: '#f1ac49',
  [WORKPLAN_STATUS.OFF_TRACK]: '#db534c',
  [WORKPLAN_STATUS.COMPLETED]: '#072c5e',
};

export default function WorkplanCard({ workplan, initiativeTitle, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const color = STATUS_DECOR[workplan.status] ?? '#5a6475';
  const textColor = priorityStatusToText(workplan.status);

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      sx={{ borderLeft: `4px solid ${color}`, overflow: 'hidden' }}
    >
      <CardActionArea onClick={() => navigate(`/workplans/${workplan.id}`)} component="div">
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="flex-start" spacing={2}>
            <UserAvatar user={workplan.owner} size="md" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{workplan.title}</Typography>
                <Chip size="small" label={PROPERTY_LABEL[workplan.departmentId] ?? workplan.departmentId} />
              </Stack>
              {initiativeTitle && (
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  ↗ {initiativeTitle}
                </Typography>
              )}
              {workplan.description && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }} noWrap>
                  {workplan.description}
                </Typography>
              )}
              <LinearProgress
                variant="determinate"
                value={workplan.rollupPct ?? 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(7,44,94,0.06)',
                  '& .MuiLinearProgress-bar': { bgcolor: color },
                }}
              />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Owner: {workplan.owner?.name}</Typography>
                <Typography variant="caption" sx={{ color, fontWeight: 700 }}>{workplan.rollupPct ?? 0}%</Typography>
              </Stack>
            </Box>
            <Stack direction="column" spacing={0.5} alignItems="center">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/workplans/${workplan.id}`); }}>
                <OpenInNewOutlined fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); setMenu(e.currentTarget); }}>
                <MoreHorizOutlined />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </CardActionArea>

      <Menu anchorEl={menu} open={Boolean(menu)} onClose={() => setMenu(null)}>
        <MenuItem onClick={() => { setMenu(null); onEdit?.(workplan); }}>
          <EditOutlined fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { setMenu(null); onDelete?.(workplan); }} sx={{ color: 'error.main' }}>
          <DeleteOutlined fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
