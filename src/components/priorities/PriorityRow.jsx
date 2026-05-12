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
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import UserAvatar from '../shared/UserAvatar';
import AddToCalendarButton from '../shared/AddToCalendarButton';
import PriorityHeatmap from './PriorityHeatmap';
import { calculatePercent, MEASUREMENT, PRIORITY_STATUS, TIME_SCOPE_LABEL } from '../../api/priorities';
import { priorityToSeed } from '../../utils/calendarSeeds';
import { formatRelative } from '../../utils/formatters';
import { useWorkplans } from '../../hooks/useWorkplans';
import { useInitiatives } from '../../hooks/useInitiatives';
import { useProperties } from '../../hooks/useProperties';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';

// Brand status palette — used for left-rail accents and progress-bar fills.
// These are decorative/structural colors; do not use directly as TEXT on white.
const STATUS_TO_COLOR = {
  [PRIORITY_STATUS.ON_TRACK]: '#006e5c',
  [PRIORITY_STATUS.AT_RISK]: '#f1ac49',
  [PRIORITY_STATUS.OFF_TRACK]: '#db534c',
};

// Accessible (WCAG AA, 4.5:1+ vs white) text variants of each status color.
// Use these whenever a status color needs to render as readable text.
const STATUS_TO_TEXT = {
  [PRIORITY_STATUS.ON_TRACK]: '#004d40',  // 9.0:1
  [PRIORITY_STATUS.AT_RISK]:  '#8a5a14',  // 7.6:1
  [PRIORITY_STATUS.OFF_TRACK]:'#8a2b27',  // 7.4:1
};

// Accessible dark teal used for "MY PRIORITY" chip + workplan breadcrumb chip.
// secondary.dark (#3d9585) renders ~3.4:1 on the brand soft-teal tint, which
// fails AA. #1f5147 hits 8.0:1 on the same tint.
const ACCESSIBLE_TEAL = '#1f5147';

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
  const statusTextColor = STATUS_TO_TEXT[priority.status] ?? '#3f4a5c';
  const measurement = MEASUREMENT_LABEL[priority.measurement] ?? { label: priority.measurement?.toUpperCase(), color: 'default' };
  const seed = priorityToSeed(priority);
  const workplansQ = useWorkplans();
  const initiativesQ = useInitiatives();
  const propertiesQ = useProperties();
  const parentWorkplan = (workplansQ.data ?? []).find((w) => w.id === priority.workplanId);
  const parentInitiative = (initiativesQ.data ?? []).find(
    (i) => i.id === priority.initiativeId || (parentWorkplan && i.id === parentWorkplan.initiativeId),
  );
  // Optional property link — surfaces as a chip when set.
  const linkedProperty = priority.propertyId
    ? (propertiesQ.data ?? []).find((p) => p.id === priority.propertyId)
    : null;

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
                      sx={{ bgcolor: 'rgba(94,184,168,0.22)', color: ACCESSIBLE_TEAL, fontWeight: 700 }}
                    />
                  )}
                  {priority.timeScope && (
                    <Chip
                      label={TIME_SCOPE_LABEL[priority.timeScope]}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: ACCESSIBLE_TEAL, color: ACCESSIBLE_TEAL, fontWeight: 700 }}
                    />
                  )}
                </Stack>
                {linkedProperty && (
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                    <LocationOnOutlined sx={{ fontSize: 14, color: '#1a4a80' }} />
                    <Chip
                      size="small"
                      label={`${linkedProperty.name}${linkedProperty.city ? ` · ${linkedProperty.city}, ${linkedProperty.state}` : ` · ${linkedProperty.state}`}`}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        bgcolor: 'rgba(26,74,128,0.14)',
                        color: '#1a4a80',
                        fontWeight: 700,
                        textTransform: 'none',
                        maxWidth: 320,
                        '& .MuiChip-label': { textOverflow: 'ellipsis', overflow: 'hidden' },
                      }}
                    />
                  </Stack>
                )}
                {(parentWorkplan || parentInitiative) && (
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                    <AccountTreeOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
                    {parentInitiative && (
                      <Chip
                        component={RouterLink}
                        to={`/initiatives/${parentInitiative.id}`}
                        clickable
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                        label={parentInitiative.title}
                        sx={{
                          bgcolor: 'rgba(7,44,94,0.06)',
                          textTransform: 'none',
                          maxWidth: 240,
                          '& .MuiChip-label': { textOverflow: 'ellipsis', overflow: 'hidden' },
                        }}
                      />
                    )}
                    {parentWorkplan && (
                      <>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>→</Typography>
                        <Chip
                          component={RouterLink}
                          to={`/workplans/${parentWorkplan.id}`}
                          clickable
                          onClick={(e) => e.stopPropagation()}
                          size="small"
                          label={parentWorkplan.title}
                          sx={{
                            bgcolor: 'rgba(94,184,168,0.18)',
                            color: ACCESSIBLE_TEAL,
                            fontWeight: 700,
                            textTransform: 'none',
                            maxWidth: 240,
                            '& .MuiChip-label': { textOverflow: 'ellipsis', overflow: 'hidden' },
                          }}
                        />
                      </>
                    )}
                  </Stack>
                )}
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
              <Typography
                variant="h4"
                sx={{
                  color: statusTextColor,
                  minWidth: 48,
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
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
