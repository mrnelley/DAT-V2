import { Card, CardActionArea, Box, Stack, Typography, LinearProgress, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../shared/UserAvatar';
import PermissionGate from '../shared/PermissionGate';
import { ROLES } from '../../utils/permissions';
import { INITIATIVE_STATUS } from '../../api/initiatives';
import { generalStatusToBadge, priorityStatusToText } from '../../utils/a11yColors';

// Decorative status colors — used ONLY for left-rail accents + progress fills,
// not as text. AA-safe text variants come from a11yColors.
const STATUS_DECOR = {
  [INITIATIVE_STATUS.ON_TRACK]: '#006e5c',
  [INITIATIVE_STATUS.AT_RISK]: '#f1ac49',
  [INITIATIVE_STATUS.OFF_TRACK]: '#db534c',
  [INITIATIVE_STATUS.COMPLETED]: '#072c5e',
};

const STATUS_LABEL = {
  on_track: 'On Track', at_risk: 'At Risk', off_track: 'Off Track', completed: 'Completed',
};

export default function InitiativeCard({ initiative, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const color = STATUS_DECOR[initiative.status] ?? '#5a6475';
  const badge = generalStatusToBadge(initiative.status);
  const textColor = priorityStatusToText(initiative.status);

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardActionArea
        onClick={() => navigate(`/initiatives/${initiative.id}`)}
        component="div"
        sx={{ flex: 1, alignItems: 'flex-start' }}
      >
        <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
            <Chip size="small" label={`Q${initiative.quarter} ${initiative.year}`} sx={{ bgcolor: 'primary.main', color: 'common.white' }} />
            {initiative.theme && <Chip size="small" label={initiative.theme} variant="outlined" />}
            <Chip
              size="small"
              label={STATUS_LABEL[initiative.status]}
              sx={{ bgcolor: badge.soft, color: badge.fg, fontWeight: 700 }}
            />
          </Stack>

          <Typography variant="h3" sx={{ mb: 1 }}>{initiative.title}</Typography>

          {initiative.narrative && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary', mb: 2, flex: 1,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}
            >
              {initiative.narrative}
            </Typography>
          )}

          <Box sx={{ mt: 'auto' }}>
            <LinearProgress
              variant="determinate"
              value={initiative.rollupPct ?? 0}
              sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(7,44,94,0.06)', '& .MuiLinearProgress-bar': { bgcolor: color } }}
            />
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                {initiative.primaryAdvocate && (
                  <>
                    <UserAvatar user={initiative.primaryAdvocate} size="sm" />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Primary Advocate
                    </Typography>
                  </>
                )}
              </Stack>
              <Typography variant="caption" sx={{ color: textColor, fontWeight: 700 }}>
                {initiative.rollupPct ?? 0}%
              </Typography>
            </Stack>
          </Box>
        </Box>
      </CardActionArea>

      <PermissionGate roles={[ROLES.ELT]}>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setMenu(e.currentTarget); }}>
            <MoreHorizOutlined />
          </IconButton>
          <Menu anchorEl={menu} open={Boolean(menu)} onClose={() => setMenu(null)}>
            <MenuItem onClick={() => { setMenu(null); onEdit?.(initiative); }}>
              <EditOutlined fontSize="small" sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => { setMenu(null); onDelete?.(initiative); }} sx={{ color: 'error.main' }}>
              <DeleteOutlined fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      </PermissionGate>
    </Card>
  );
}
