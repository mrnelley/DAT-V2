import { useState } from 'react';
import {
  Card,
  CardActionArea,
  Box,
  Stack,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Collapse,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import { motion } from 'framer-motion';
import UserAvatar from '../shared/UserAvatar';
import AddToCalendarButton from '../shared/AddToCalendarButton';
import PriorityHeatmap from './PriorityHeatmap';
import { calculatePercent, MEASUREMENT, PRIORITY_STATUS } from '../../api/priorities';
import { priorityToSeed } from '../../utils/calendarSeeds';
import { formatRelative } from '../../utils/formatters';

const STATUS_TO_COLOR = {
  [PRIORITY_STATUS.ON_TRACK]: '#006e5c',
  [PRIORITY_STATUS.AT_RISK]: '#f1ac49',
  [PRIORITY_STATUS.OFF_TRACK]: '#db534c',
};

const MEASUREMENT_LABEL = {
  [MEASUREMENT.NUMBER]: { label: 'NUMBER', color: 'primary' },
  [MEASUREMENT.TASK]: { label: 'TASK', color: 'secondary' },
  [MEASUREMENT.ROLLUP]: { label: 'ROLLUP', color: 'warning' },
};

export default function PriorityRow({ priority, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [tab, setTab] = useState('heatmap');

  const pct = calculatePercent(priority);
  const statusColor = STATUS_TO_COLOR[priority.status] ?? '#5a6475';
  const measurement = MEASUREMENT_LABEL[priority.measurement] ?? { label: priority.measurement?.toUpperCase(), color: 'default' };
  const seed = priorityToSeed(priority);

  return (
    <Card
      component={motion.div}
      layout
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      sx={{ overflow: 'hidden', borderLeft: `4px solid ${statusColor}` }}
    >
      <CardActionArea onClick={() => setExpanded((e) => !e)} component="div">
        <Box sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ md: 'center' }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
              <UserAvatar user={priority.owner} size="md" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {priority.title}
                  </Typography>
                  {priority.isCompany && (
                    <Chip
                      label="COMPANY PRIORITY"
                      size="small"
                      sx={{ bgcolor: 'rgba(7,44,94,0.12)', color: 'primary.main' }}
                    />
                  )}
                  {priority.isMine && (
                    <Chip
                      label="MY PRIORITY"
                      size="small"
                      sx={{ bgcolor: 'rgba(94,184,168,0.18)', color: 'secondary.dark' }}
                    />
                  )}
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {priority.owner?.name} · Due {formatRelative(priority.dueAt)}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip
                label={measurement.label}
                size="small"
                variant="outlined"
                color={measurement.color === 'default' ? undefined : measurement.color}
              />
              <Box sx={{ minWidth: { xs: 160, md: 220 } }}>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: 'rgba(7,44,94,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: statusColor },
                  }}
                />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {priority.start}{priority.unit}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700 }}>
                    {priority.current}{priority.unit}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {priority.target}{priority.unit}
                  </Typography>
                </Stack>
              </Box>
              <Typography variant="h4" sx={{ color: statusColor, minWidth: 48, textAlign: 'right' }}>
                {pct}%
              </Typography>
              <Tooltip title="Add to Calendar">
                <span onClick={(e) => e.stopPropagation()}>
                  <AddToCalendarButton seed={seed} variant="icon" />
                </span>
              </Tooltip>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuAnchor(e.currentTarget);
                }}
              >
                <MoreHorizOutlined />
              </IconButton>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
                <ExpandMoreOutlined sx={{ color: 'text.secondary' }} />
              </motion.div>
            </Stack>
          </Stack>
        </Box>
      </CardActionArea>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2.5, pb: 2.5, pt: 1, bgcolor: '#f9fafc' }}>
          {priority.context && (
            <Box
              sx={{
                bgcolor: '#f5f7fa',
                p: 1.5,
                borderRadius: 2,
                mb: 2,
                borderLeft: '3px solid',
                borderColor: 'secondary.main',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.25 }}>
                Why this priority exists
              </Typography>
              <Typography variant="body2">{priority.context}</Typography>
            </Box>
          )}

          <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2, minHeight: 36 }}>
            <Tab value="heatmap" label="Heatmap" sx={{ minHeight: 36 }} />
            <Tab value="graph" label="Graph" sx={{ minHeight: 36 }} disabled />
          </Tabs>

          {tab === 'heatmap' && <PriorityHeatmap heatmap={priority.heatmap} />}
        </Box>
      </Collapse>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onEdit?.(priority);
          }}
        >
          <EditOutlined fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onDelete?.(priority);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteOutlined fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}
