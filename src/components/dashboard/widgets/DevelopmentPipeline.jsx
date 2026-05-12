import { Box, Card, Stack, Typography, Chip, LinearProgress, Tooltip } from '@mui/material';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import { motion } from 'framer-motion';

const PHASES = [
  { id: 'predev', label: 'Predevelopment', color: '#5a6475' },
  { id: 'design', label: 'Design', color: '#1a4a80' },
  { id: 'construction', label: 'Construction', color: '#f1ac49' },
  { id: 'leaseup', label: 'Lease-up', color: '#5eb8a8' },
  { id: 'stabilized', label: 'Stabilized', color: '#006e5c' },
];

// Mock project pipeline.
const PROJECTS = [
  {
    id: 'p_riv2', name: 'Riverbend Phase 2', city: 'Oakland, CA', phase: 'predev',
    units: 38, capStack: 7.2, daysInPhase: 45, criticalPath: true,
    nextMilestone: 'LIHTC reservation', milestoneDays: 18, status: 'on_track',
  },
  {
    id: 'p_og2', name: 'Oak Grove Phase 2', city: 'San Leandro, CA', phase: 'design',
    units: 24, capStack: 4.8, daysInPhase: 92, criticalPath: false,
    nextMilestone: 'City design review', milestoneDays: 28, status: 'at_risk',
  },
  {
    id: 'p_marina', name: 'Marina Place', city: 'Richmond, CA', phase: 'design',
    units: 42, capStack: 9.1, daysInPhase: 60, criticalPath: false,
    nextMilestone: 'DD set complete', milestoneDays: 42, status: 'on_track',
  },
  {
    id: 'p_pine', name: 'Pine Crossing', city: 'Hayward, CA', phase: 'construction',
    units: 56, capStack: 13.4, daysInPhase: 138, criticalPath: true,
    nextMilestone: 'Building C TCO', milestoneDays: 21, status: 'at_risk',
  },
  {
    id: 'p_lakeside', name: 'Lakeside Roof Replacement', city: 'Alameda, CA', phase: 'construction',
    units: 64, capStack: 1.6, daysInPhase: 35, criticalPath: false,
    nextMilestone: 'Phase 1 complete', milestoneDays: 30, status: 'on_track',
  },
  {
    id: 'p_np', name: 'North Park', city: 'San Pablo, CA', phase: 'leaseup',
    units: 32, capStack: 7.9, daysInPhase: 72, criticalPath: false,
    nextMilestone: '95% occupancy', milestoneDays: 40, status: 'on_track',
  },
  {
    id: 'p_riv1', name: 'Riverbend Phase 1', city: 'Oakland, CA', phase: 'stabilized',
    units: 48, capStack: 8.6, daysInPhase: 210, criticalPath: false,
    nextMilestone: 'Year-2 review', milestoneDays: 90, status: 'on_track',
  },
];

const STATUS_DOT = { on_track: '#006e5c', at_risk: '#f1ac49', off_track: '#db534c' };

function ProjectCard({ p }) {
  return (
    <Box
      component={motion.div}
      whileHover={{ y: -3 }}
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {p.criticalPath && (
        <Tooltip title="On the critical path" arrow>
          <Box
            sx={{
              position: 'absolute', top: -6, right: -6,
              width: 18, height: 18, borderRadius: '50%',
              bgcolor: '#a52a1f', color: 'common.white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800,
            }}
          >
            !
          </Box>
        </Tooltip>
      )}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.25 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: STATUS_DOT[p.status] }} />
        <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{p.name}</Typography>
      </Stack>
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
        <LocationOnOutlined sx={{ fontSize: 12, color: 'text.secondary' }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{p.city}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Chip size="small" label={`${p.units} units`} sx={{ bgcolor: 'rgba(7,44,94,0.06)' }} />
        <Chip size="small" label={`$${p.capStack}M`} sx={{ bgcolor: 'rgba(94,184,168,0.12)', color: 'secondary.dark' }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <AccessTimeOutlined sx={{ fontSize: 12, color: 'text.secondary' }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {p.daysInPhase}d in phase
        </Typography>
      </Stack>
      <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          Next:
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {p.nextMilestone} · {p.milestoneDays}d
        </Typography>
      </Box>
    </Box>
  );
}

export default function DevelopmentPipeline() {
  const grouped = PHASES.map((phase) => ({
    ...phase,
    projects: PROJECTS.filter((p) => p.phase === phase.id),
  }));

  const totalUnits = PROJECTS.reduce((sum, p) => sum + p.units, 0);
  const totalCap = PROJECTS.reduce((sum, p) => sum + p.capStack, 0);
  const inFlight = PROJECTS.filter((p) => p.phase !== 'stabilized').length;
  const critical = PROJECTS.filter((p) => p.criticalPath).length;

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Development Pipeline</Typography>
          <Typography variant="h3">{inFlight} projects in flight · {totalUnits} units · ${totalCap.toFixed(1)}M cap stack</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip label={`${critical} on critical path`} sx={{ bgcolor: 'rgba(219,83,76,0.18)', color: '#8a2b27', fontWeight: 700 }} />
        </Stack>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: `repeat(${PHASES.length}, minmax(220px, 1fr))`, minWidth: PHASES.length * 220 }}>
          {grouped.map((phase) => (
            <Box key={phase.id}>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1, px: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: phase.color }} />
                <Typography variant="overline" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {phase.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>· {phase.projects.length}</Typography>
              </Stack>
              <Stack
                spacing={1}
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  bgcolor: '#f9fafc',
                  minHeight: 200,
                }}
              >
                {phase.projects.length === 0 ? (
                  <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>—</Typography>
                ) : (
                  phase.projects.map((p) => <ProjectCard key={p.id} p={p} />)
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
