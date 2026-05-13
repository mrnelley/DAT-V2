// Meg's Impact & Advancement flagship widget — Fundraising Pipeline.
// Seed data scrubbed for the executive scope demo. Stage columns + tiles
// remain so the pipeline structure is visible; values are empty until the
// fundraising CRM feed is wired.

import { Box, Card, Stack, Typography, Chip, LinearProgress, Divider } from '@mui/material';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined';
import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
import { motion } from 'framer-motion';

const YTD = { raised: 0, goal: null, activeProposals: 0, upcomingDeadlines: 0 };

const STAGES = [
  { id: 'prospect',  label: 'Prospecting',   color: '#5a6475' },
  { id: 'cultivate', label: 'Cultivation',   color: '#1a4a80' },
  { id: 'solicit',   label: 'Solicitation',  color: '#5eb8a8' },
  { id: 'pledged',   label: 'Pledged',       color: '#f1ac49' },
  { id: 'closed',    label: 'Closed',        color: '#006e5c' },
];

const DEALS = [];
const DEADLINES = [];

const fmtMoney = (n) => {
  if (n == null) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
};

function Tile({ icon, label, headline, sub, accent }) {
  return (
    <Box
      component={motion.div}
      whileHover={{ y: -2 }}
      sx={{
        p: 2, borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid', borderColor: 'divider',
        borderTop: `3px solid ${accent}`,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        {icon}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      </Stack>
      <Typography variant="h2" sx={{ lineHeight: 1.1 }}>{headline}</Typography>
      {sub && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{sub}</Typography>}
    </Box>
  );
}

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
          Awaiting fundraising CRM connection
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          YTD progress, donor/grant pipeline, and upcoming deadlines populate
          when the system is wired.
        </Typography>
      </Box>
    </Box>
  );
}

export default function FundraisingPipeline() {
  const pipelineByStage = STAGES.map((stage) => ({
    ...stage,
    deals: DEALS.filter((d) => d.stage === stage.id),
  }));

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Fundraising Hub</Typography>
          <Typography variant="h3">YTD: {fmtMoney(YTD.raised)} / {fmtMoney(YTD.goal)}</Typography>
        </Box>
        <Chip label="No data feed" size="small" sx={{ bgcolor: 'rgba(90,100,117,0.14)', color: '#3f4a5c' }} />
      </Stack>

      <PendingBanner />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 3 }}>
        <Tile icon={<AttachMoneyOutlined sx={{ color: 'success.dark' }} />} label="YTD raised" headline={fmtMoney(YTD.raised)} sub="—" accent="#006e5c" />
        <Tile icon={<VolunteerActivismOutlined sx={{ color: 'primary.main' }} />} label="Active proposals" headline={YTD.activeProposals} sub="—" accent="#072c5e" />
        <Tile icon={<EventNoteOutlined sx={{ color: 'warning.dark' }} />} label="Upcoming deadlines" headline={YTD.upcomingDeadlines} sub="next 45 days" accent="#f1ac49" />
        <Tile icon={<AttachMoneyOutlined sx={{ color: 'secondary.dark' }} />} label="Weighted pipeline" headline="—" sub="probability-adjusted" accent="#5eb8a8" />
      </Box>

      <Box sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Annual goal progress</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#004d40' }}>—</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={0}
          sx={{ height: 12, borderRadius: 6, bgcolor: 'rgba(7,44,94,0.06)',
            '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }}
        />
      </Box>

      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        Pipeline by stage
      </Typography>
      <Box sx={{ overflowX: 'auto', mb: 3 }}>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: `repeat(${STAGES.length}, minmax(200px, 1fr))`, minWidth: STAGES.length * 200 }}>
          {pipelineByStage.map((stage) => (
            <Box key={stage.id}>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1, px: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stage.color }} />
                <Typography variant="overline" sx={{ fontWeight: 700 }}>{stage.label}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>· {stage.deals.length}</Typography>
              </Stack>
              <Box sx={{
                p: 2, bgcolor: '#f9fafc', borderRadius: 2,
                border: '1px dashed', borderColor: 'divider',
                minHeight: 140,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>—</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Upcoming deadlines
      </Typography>
      {DEADLINES.length === 0 && (
        <Box sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>No deadlines tracked yet.</Typography>
        </Box>
      )}
    </Card>
  );
}
