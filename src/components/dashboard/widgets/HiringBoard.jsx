// Michele's HR flagship widget — Hiring & retention.
// Seed data scrubbed for the executive scope demo. Tiles + funnel structure
// remain so the shape of the view is visible; counts and rows are empty until
// the HRIS feed is wired.

import { Box, Card, Stack, Typography, Chip, LinearProgress, Divider, Tooltip } from '@mui/material';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import WorkOutlineOutlined from '@mui/icons-material/WorkOutlineOutlined';
import TrendingUp from '@mui/icons-material/TrendingUp';
import SentimentSatisfiedOutlined from '@mui/icons-material/SentimentSatisfiedOutlined';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
import { motion } from 'framer-motion';

const HEADCOUNT_STATS = {
  total: 0,
  open: 0,
  turnoverYtd: null,
  enpsCurrent: null,
  enpsTarget: 30,
  retentionTrend: [],
};

const POSITIONS = [];

// AA-safe brand-fill colors so white funnel labels pass 4.5:1.
const FUNNEL = [
  { id: 'sourcing',   label: 'Sourcing',   count: 0, color: '#5a6475' },
  { id: 'screening',  label: 'Screening',  count: 0, color: '#1a4a80' },
  { id: 'interviews', label: 'Interview',  count: 0, color: '#2c6e63' },
  { id: 'offer',      label: 'Offer',      count: 0, color: '#a06a14' },
  { id: 'onboarding', label: 'Onboarding', count: 0, color: '#006e5c' },
];

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
          Awaiting HRIS connection
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Headcount, open requisitions, retention, and the hiring funnel populate
          when the HR system is wired.
        </Typography>
      </Box>
    </Box>
  );
}

export default function HiringBoard() {
  const s = HEADCOUNT_STATS;

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>People Operations</Typography>
          <Typography variant="h3">Hiring & retention</Typography>
        </Box>
        <Chip label="No data feed" size="small" sx={{ bgcolor: 'rgba(90,100,117,0.14)', color: '#3f4a5c' }} />
      </Stack>

      <PendingBanner />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 3 }}>
        <Tile icon={<PeopleAltOutlined sx={{ color: 'primary.main' }} />} label="Headcount" headline={s.total} sub="—" accent="#072c5e" />
        <Tile icon={<WorkOutlineOutlined sx={{ color: 'warning.dark' }} />} label="Open reqs" headline={s.open} sub="—" accent="#f1ac49" />
        <Tile icon={<TrendingUp sx={{ color: 'error.main' }} />} label="YTD turnover" headline="—" sub="—" accent="#db534c" />
        <Tile icon={<SentimentSatisfiedOutlined sx={{ color: 'success.dark' }} />} label="eNPS" headline="—" sub={`target +${s.enpsTarget}`} accent="#006e5c" />
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>eNPS path</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>—</Typography>
          <LinearProgress
            variant="determinate"
            value={0}
            sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(7,44,94,0.06)',
              '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }}
          />
        </Box>
        <Box sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Retention trend (6 mo)</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>—</Typography>
        </Box>
      </Stack>

      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Open positions
      </Typography>
      <Box
        sx={{
          p: 3, mb: 3,
          border: '1px dashed', borderColor: 'divider',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {POSITIONS.length === 0 ? 'No open positions tracked yet.' : null}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        Hiring funnel
      </Typography>
      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: `repeat(${FUNNEL.length}, 1fr)` }}>
        {FUNNEL.map((stage, idx) => (
          <Tooltip key={stage.id} title={`${stage.count} in ${stage.label}`} arrow>
            <Box>
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: stage.color, color: 'common.white',
                textAlign: 'center', position: 'relative',
                clipPath: idx < FUNNEL.length - 1
                  ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)'
                  : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)',
              }}>
                <Typography variant="caption" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.4, opacity: 0.9 }}>
                  {stage.label}
                </Typography>
                <Typography variant="h3" sx={{ color: 'inherit', lineHeight: 1 }}>{stage.count}</Typography>
              </Box>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Card>
  );
}
