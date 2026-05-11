import { Box, Card, Stack, Typography, Chip, LinearProgress, Divider, Tooltip } from '@mui/material';
import PeopleAltOutlined from '@mui/icons-material/PeopleAltOutlined';
import WorkOutlineOutlined from '@mui/icons-material/WorkOutlineOutlined';
import TrendingUp from '@mui/icons-material/TrendingUp';
import SentimentSatisfiedOutlined from '@mui/icons-material/SentimentSatisfiedOutlined';
import { motion } from 'framer-motion';

const HEADCOUNT_STATS = {
  total: 47,
  open: 4,
  turnoverYtd: 0.082, // 8.2%
  enpsCurrent: 24,
  enpsTarget: 30,
  retentionTrend: [86.4, 86.9, 87.1, 87.8, 88.2, 88.7],
};

const POSITIONS = [
  { id: 'pos_pm', title: 'Property Manager', dept: 'Property Management', daysOpen: 14, candidates: 18, stage: 'interviews', urgency: 'high', manager: 'Jaime Shillady' },
  { id: 'pos_rsc', title: 'Resident Services Coordinator', dept: 'Resident Services', daysOpen: 22, candidates: 11, stage: 'offer', urgency: 'medium', manager: 'Michael Sedoti' },
  { id: 'pos_maint', title: 'Maintenance Technician', dept: 'Property Management', daysOpen: 9, candidates: 7, stage: 'screening', urgency: 'medium', manager: 'Jaime Shillady' },
  { id: 'pos_comp', title: 'Compliance Analyst', dept: 'Compliance', daysOpen: 31, candidates: 4, stage: 'sourcing', urgency: 'high', manager: 'Sam Jordan' },
];

const FUNNEL = [
  { id: 'sourcing', label: 'Sourcing', count: 14, color: '#5a6475' },
  { id: 'screening', label: 'Screening', count: 9, color: '#1a4a80' },
  { id: 'interviews', label: 'Interview', count: 6, color: '#5eb8a8' },
  { id: 'offer', label: 'Offer', count: 2, color: '#f1ac49' },
  { id: 'onboarding', label: 'Onboarding', count: 1, color: '#006e5c' },
];

const URGENCY = {
  high: { color: '#db534c', label: 'High' },
  medium: { color: '#f1ac49', label: 'Medium' },
  low: { color: '#5a6475', label: 'Low' },
};

const STAGE_LABEL = {
  sourcing: 'Sourcing', screening: 'Screening', interviews: 'Interviews',
  offer: 'Offer', onboarding: 'Onboarding',
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

function Sparkline({ values, color = '#5eb8a8' }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 120;
  const H = 32;
  const step = W / (values.length - 1);
  const pts = values.map((v, i) => `${i * step},${H - ((v - min) / range) * (H - 4) - 2}`).join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function HiringBoard() {
  const s = HEADCOUNT_STATS;
  const enpsPct = Math.min(100, Math.round(((s.enpsCurrent + 100) / (s.enpsTarget + 100)) * 100));

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>People Operations</Typography>
          <Typography variant="h3">Hiring & retention</Typography>
        </Box>
        <Chip label="Live (mock)" size="small" sx={{ bgcolor: 'rgba(0,110,92,0.12)', color: 'success.dark' }} />
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 3 }}>
        <Tile icon={<PeopleAltOutlined sx={{ color: 'primary.main' }} />} label="Headcount" headline={s.total} sub={`${s.total - s.open} filled · ${s.open} open`} accent="#072c5e" />
        <Tile icon={<WorkOutlineOutlined sx={{ color: 'warning.dark' }} />} label="Open reqs" headline={s.open} sub="across 3 departments" accent="#f1ac49" />
        <Tile icon={<TrendingUp sx={{ color: 'error.main' }} />} label="YTD turnover" headline={`${(s.turnoverYtd * 100).toFixed(1)}%`} sub="vs 12% sector avg" accent="#db534c" />
        <Tile icon={<SentimentSatisfiedOutlined sx={{ color: 'success.dark' }} />} label="eNPS" headline={`+${s.enpsCurrent}`} sub={`target +${s.enpsTarget}`} accent="#006e5c" />
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>eNPS path</Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h3" sx={{ color: 'success.dark' }}>+{s.enpsCurrent}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>→ +{s.enpsTarget}</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={enpsPct}
            sx={{ mt: 1, height: 8, borderRadius: 4, bgcolor: 'rgba(7,44,94,0.06)',
              '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }}
          />
        </Box>
        <Box sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Retention trend (6 mo)</Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h3">{HEADCOUNT_STATS.retentionTrend[HEADCOUNT_STATS.retentionTrend.length - 1]}%</Typography>
            <Sparkline values={HEADCOUNT_STATS.retentionTrend} />
          </Stack>
        </Box>
      </Stack>

      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Open positions
      </Typography>
      <Stack spacing={0.75} sx={{ mb: 3 }}>
        {POSITIONS.map((p) => (
          <Box
            key={p.id}
            component={motion.div}
            whileHover={{ x: 2 }}
            sx={{
              p: 1.5, borderRadius: 2,
              border: '1px solid', borderColor: 'divider',
              display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr 1fr' },
              alignItems: 'center', gap: 1,
              borderLeft: `4px solid ${URGENCY[p.urgency].color}`,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.title}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{p.dept} · Hiring mgr: {p.manager}</Typography>
            </Box>
            <Chip size="small" label={STAGE_LABEL[p.stage]} sx={{ justifySelf: 'flex-start', bgcolor: 'rgba(7,44,94,0.08)', color: 'primary.main' }} />
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Days open</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: p.daysOpen > 21 ? 'warning.dark' : 'text.primary' }}>{p.daysOpen}d</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Candidates</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.candidates}</Typography>
            </Box>
            <Chip size="small" label={URGENCY[p.urgency].label} sx={{ justifySelf: 'flex-start', bgcolor: URGENCY[p.urgency].color, color: 'common.white' }} />
          </Box>
        ))}
      </Stack>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        Hiring funnel
      </Typography>
      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: `repeat(${FUNNEL.length}, 1fr)` }}>
        {FUNNEL.map((stage, idx) => (
          <Tooltip key={stage.id} title={`${stage.count} candidate${stage.count === 1 ? '' : 's'} in ${stage.label}`} arrow>
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
