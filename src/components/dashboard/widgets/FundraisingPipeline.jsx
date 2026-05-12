import { Box, Card, Stack, Typography, Chip, LinearProgress, Divider, Tooltip } from '@mui/material';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined';
import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined';
import EventNoteOutlined from '@mui/icons-material/EventNoteOutlined';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const YTD = {
  raised: 2_430_000,
  goal: 4_500_000,
  activeProposals: 6,
  upcomingDeadlines: 3,
};

const STAGES = [
  { id: 'prospect', label: 'Prospecting', color: '#5a6475' },
  { id: 'cultivate', label: 'Cultivation', color: '#1a4a80' },
  { id: 'solicit', label: 'Solicitation', color: '#5eb8a8' },
  { id: 'pledged', label: 'Pledged', color: '#f1ac49' },
  { id: 'closed', label: 'Closed', color: '#006e5c' },
];

const DEALS = [
  { id: 'd_ford', funder: 'Ford Foundation', type: 'Grant', amount: 2_000_000, stage: 'pledged', probability: 0.85, lead: 'Meg Struck', closeDate: 'Jul 12, 2026' },
  { id: 'd_jpmc', funder: 'JPMorgan Chase Foundation', type: 'Grant', amount: 750_000, stage: 'solicit', probability: 0.65, lead: 'Meg Struck', closeDate: 'Aug 30, 2026' },
  { id: 'd_wells', funder: 'Wells Fargo CDF', type: 'PRI', amount: 1_500_000, stage: 'cultivate', probability: 0.35, lead: 'Meg Struck', closeDate: 'Sep 28, 2026' },
  { id: 'd_navarro', funder: 'Navarro Family Foundation', type: 'Grant', amount: 250_000, stage: 'closed', probability: 1.0, lead: 'Meg Struck', closeDate: 'Apr 18, 2026' },
  { id: 'd_kapoor', funder: 'Kapoor Trust', type: 'Major Gift', amount: 100_000, stage: 'solicit', probability: 0.5, lead: 'Meg Struck', closeDate: 'Jun 22, 2026' },
  { id: 'd_local', funder: 'Bay Area Community Fund', type: 'Grant', amount: 180_000, stage: 'prospect', probability: 0.2, lead: 'Meg Struck', closeDate: 'Oct 14, 2026' },
  { id: 'd_gala', funder: 'Annual Gala (sponsors)', type: 'Event', amount: 400_000, stage: 'cultivate', probability: 0.6, lead: 'Meg Struck', closeDate: 'Aug 02, 2026' },
];

const DEADLINES = [
  { id: 'dl_ford', label: 'Ford Q3 expansion proposal', date: dayjs().add(8, 'day'), urgency: 'high' },
  { id: 'dl_jpmc', label: 'JPMC outcomes packet refresh', date: dayjs().add(21, 'day'), urgency: 'medium' },
  { id: 'dl_bacf', label: 'Bay Area Community Fund LOI', date: dayjs().add(38, 'day'), urgency: 'low' },
];

const fmtMoney = (n) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1_000)}k`;

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

function DealCard({ d }) {
  const expected = d.amount * d.probability;
  return (
    <Box
      component={motion.div}
      whileHover={{ y: -2 }}
      sx={{
        p: 1.25, borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid', borderColor: 'divider',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>{d.funder}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{d.type}</Typography>
      <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ mt: 0.5 }}>
        <Typography variant="h4">{fmtMoney(d.amount)}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          ({(d.probability * 100).toFixed(0)}%)
        </Typography>
      </Stack>
      <Typography variant="caption" sx={{ color: 'success.dark' }}>
        Expected: {fmtMoney(expected)}
      </Typography>
      <Box sx={{ mt: 0.5, pt: 0.5, borderTop: '1px dashed', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Close: {d.closeDate}</Typography>
      </Box>
    </Box>
  );
}

export default function FundraisingPipeline() {
  const ytdPct = (YTD.raised / YTD.goal) * 100;
  const pipelineByStage = STAGES.map((stage) => ({
    ...stage,
    deals: DEALS.filter((d) => d.stage === stage.id),
    total: DEALS.filter((d) => d.stage === stage.id).reduce((s, d) => s + d.amount, 0),
    weightedTotal: DEALS.filter((d) => d.stage === stage.id).reduce((s, d) => s + d.amount * d.probability, 0),
  }));
  const pipelineWeighted = pipelineByStage.reduce((s, p) => s + p.weightedTotal, 0);

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Fundraising Hub</Typography>
          <Typography variant="h3">YTD: {fmtMoney(YTD.raised)} / {fmtMoney(YTD.goal)}</Typography>
        </Box>
        <Chip label="Live (mock)" size="small" sx={{ bgcolor: 'rgba(0,110,92,0.12)', color: 'success.dark' }} />
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 3 }}>
        <Tile icon={<AttachMoneyOutlined sx={{ color: 'success.dark' }} />} label="YTD raised" headline={fmtMoney(YTD.raised)} sub={`${ytdPct.toFixed(0)}% of goal`} accent="#006e5c" />
        <Tile icon={<VolunteerActivismOutlined sx={{ color: 'primary.main' }} />} label="Active proposals" headline={YTD.activeProposals} sub="3 in writing · 3 submitted" accent="#072c5e" />
        <Tile icon={<EventNoteOutlined sx={{ color: 'warning.dark' }} />} label="Upcoming deadlines" headline={YTD.upcomingDeadlines} sub="next 45 days" accent="#f1ac49" />
        <Tile icon={<AttachMoneyOutlined sx={{ color: 'secondary.dark' }} />} label="Weighted pipeline" headline={fmtMoney(pipelineWeighted)} sub="probability-adjusted" accent="#5eb8a8" />
      </Box>

      <Box sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Annual goal progress</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.dark' }}>
            {ytdPct.toFixed(0)}% · {fmtMoney(YTD.goal - YTD.raised)} to go
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={ytdPct}
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
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  · {fmtMoney(stage.total)}
                </Typography>
              </Stack>
              <Stack spacing={1} sx={{ p: 1, bgcolor: '#f9fafc', borderRadius: 2, border: '1px dashed', borderColor: 'divider', minHeight: 180 }}>
                {stage.deals.length === 0 ? (
                  <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>—</Typography>
                ) : (
                  stage.deals.map((d) => <DealCard key={d.id} d={d} />)
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Upcoming deadlines
      </Typography>
      <Stack spacing={0.75}>
        {DEADLINES.map((d) => {
          const daysOut = d.date.diff(dayjs(), 'day');
          // AA-safe pairs: rail/icon hit 3:1 non-text contrast; chip hits 4.5:1 text contrast.
          const urgencyMeta =
            d.urgency === 'high'   ? { rail: '#a52a1f', soft: 'rgba(219,83,76,0.18)',  fg: '#8a2b27' }
            : d.urgency === 'medium' ? { rail: '#a06a14', soft: 'rgba(241,172,73,0.22)', fg: '#8a5a14' }
            :                          { rail: '#5a6475', soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c' };
          return (
            <Box
              key={d.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: 1.25, borderRadius: 2,
                border: '1px solid', borderColor: 'divider',
                borderLeft: `4px solid ${urgencyMeta.rail}`,
              }}
            >
              <EventNoteOutlined sx={{ color: urgencyMeta.rail }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.label}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{d.date.format('MMM D, YYYY')}</Typography>
              </Box>
              <Chip
                size="small"
                label={`${daysOut}d`}
                sx={{ bgcolor: urgencyMeta.soft, color: urgencyMeta.fg, fontWeight: 700 }}
              />
            </Box>
          );
        })}
      </Stack>
    </Card>
  );
}
