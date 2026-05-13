// Kim's Real Estate Development flagship widget — Development Pipeline kanban.
// Seed data scrubbed for the executive scope demo. Phase columns remain so the
// pipeline structure is visible; each column shows an empty state until the
// projects data source is wired.

import { Box, Card, Stack, Typography, Chip } from '@mui/material';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';

const PHASES = [
  { id: 'predev',       label: 'Predevelopment', color: '#5a6475' },
  { id: 'design',       label: 'Design',         color: '#1a4a80' },
  { id: 'construction', label: 'Construction',   color: '#f1ac49' },
  { id: 'leaseup',      label: 'Lease-up',       color: '#5eb8a8' },
  { id: 'stabilized',   label: 'Stabilized',     color: '#006e5c' },
];

const PROJECTS = [];

function PendingBanner() {
  return (
    <Box
      sx={{
        p: 1.5, mb: 2, borderRadius: 2,
        border: '1px dashed', borderColor: 'divider',
        bgcolor: 'rgba(7,44,94,0.03)',
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}
    >
      <HourglassEmptyOutlined sx={{ color: 'text.secondary' }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Awaiting project pipeline data
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Project cards land in their current phase column once the development
          pipeline is connected.
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

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Development Pipeline</Typography>
          <Typography variant="h3">0 projects in flight · 0 units · $0.0M cap stack</Typography>
        </Box>
        <Chip label="No data feed" size="small" sx={{ bgcolor: 'rgba(90,100,117,0.14)', color: '#3f4a5c' }} />
      </Stack>

      <PendingBanner />

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
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  bgcolor: '#f9fafc',
                  minHeight: 180,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>—</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
