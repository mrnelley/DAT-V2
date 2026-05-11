import { Box, Card, Stack, Typography, Chip, LinearProgress, Divider } from '@mui/material';
import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import { motion } from 'framer-motion';

const STATS = {
  activeCaseload: 87,
  newThisWeek: 11,
  avgFirstContactHours: 31,
  targetHours: 24,
  rscCount: 8,
  rscCapacity: 12, // cases per RSC
};

const CATEGORIES = [
  { id: 'mental_health', label: 'Mental Health', color: '#1a4a80', count: 23, trend: '+3 this wk' },
  { id: 'food_security', label: 'Food Security', color: '#5eb8a8', count: 18, trend: '+2 this wk' },
  { id: 'employment', label: 'Employment', color: '#f1ac49', count: 14, trend: 'flat' },
  { id: 'childcare', label: 'Childcare', color: '#db534c', count: 12, trend: '+2 this wk' },
  { id: 'legal', label: 'Legal', color: '#5a6475', count: 11, trend: '−1' },
  { id: 'senior_support', label: 'Senior Support', color: '#006e5c', count: 9, trend: '+1' },
];

// PII-light — initials only.
const REFERRALS = [
  { id: 'r_001', resident: 'B.J.', property: 'North Park', category: 'mental_health', rsc: 'Tasha M.', daysOpen: 0, urgency: 'high', summary: 'Crisis response — partner referral coordinated.' },
  { id: 'r_002', resident: 'M.O.', property: 'Lakeside', category: 'food_security', rsc: 'David L.', daysOpen: 1, urgency: 'medium', summary: 'CalFresh enrollment + Bay Area Food Bank delivery.' },
  { id: 'r_003', resident: 'C.R.', property: 'Oak Grove', category: 'employment', rsc: 'Priya R.', daysOpen: 2, urgency: 'medium', summary: 'Job-readiness workshop sign-up + resume review.' },
  { id: 'r_004', resident: 'A.T.', property: 'Riverbend', category: 'childcare', rsc: 'Marcus B.', daysOpen: 3, urgency: 'high', summary: 'Subsidized childcare voucher application in progress.' },
  { id: 'r_005', resident: 'D.K.', property: 'North Park', category: 'legal', rsc: 'Tasha M.', daysOpen: 5, urgency: 'medium', summary: 'BayLegal referral — tenant rights consultation.' },
  { id: 'r_006', resident: 'E.S.', property: 'Lakeside', category: 'senior_support', rsc: 'David L.', daysOpen: 4, urgency: 'low', summary: 'Senior Center transportation + meal program enrollment.' },
  { id: 'r_007', resident: 'R.H.', property: 'Oak Grove', category: 'mental_health', rsc: 'Priya R.', daysOpen: 1, urgency: 'high', summary: 'Therapy referral — telehealth sliding scale.' },
  { id: 'r_008', resident: 'S.V.', property: 'Lakeside', category: 'employment', rsc: 'David L.', daysOpen: 7, urgency: 'low', summary: 'Skill-building course enrollment + transit pass.' },
];

const URGENCY = {
  high: { color: '#db534c', label: 'High' },
  medium: { color: '#f1ac49', label: 'Medium' },
  low: { color: '#5a6475', label: 'Low' },
};

const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

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

export default function ReferralQueue() {
  const s = STATS;
  const rscCapacityTotal = s.rscCount * s.rscCapacity;
  const utilization = (s.activeCaseload / rscCapacityTotal) * 100;
  const overTarget = s.avgFirstContactHours > s.targetHours;

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Resident Services</Typography>
          <Typography variant="h3">Referral queue & needs categories</Typography>
        </Box>
        <Chip label="Trauma-informed" size="small" sx={{ bgcolor: 'rgba(94,184,168,0.18)', color: 'secondary.dark' }} />
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 3 }}>
        <Tile icon={<VolunteerActivismOutlined sx={{ color: 'primary.main' }} />} label="Active caseload" headline={s.activeCaseload} sub={`${s.newThisWeek} new this week`} accent="#072c5e" />
        <Tile icon={<AccessTimeOutlined sx={{ color: overTarget ? 'warning.dark' : 'success.dark' }} />} label="Avg first contact" headline={`${s.avgFirstContactHours}h`} sub={`target ${s.targetHours}h`} accent={overTarget ? '#f1ac49' : '#006e5c'} />
        <Tile icon={<FavoriteBorderOutlined sx={{ color: 'secondary.dark' }} />} label="RSC team" headline={s.rscCount} sub={`avg ${(s.activeCaseload / s.rscCount).toFixed(1)} cases/RSC`} accent="#5eb8a8" />
        <Tile icon={<VolunteerActivismOutlined sx={{ color: 'error.dark' }} />} label="Capacity used" headline={`${utilization.toFixed(0)}%`} sub={`of ${rscCapacityTotal}`} accent="#db534c" />
      </Box>

      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        Active referrals by need category
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, mb: 3 }}>
        {CATEGORIES.map((c) => (
          <Box
            key={c.id}
            sx={{
              p: 1.25, borderRadius: 2,
              border: '1px solid', borderColor: 'divider',
              borderTop: `3px solid ${c.color}`,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{c.label}</Typography>
            <Typography variant="h3" sx={{ lineHeight: 1.1, color: c.color }}>{c.count}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.trend}</Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        Today's queue — resident initials only
      </Typography>
      <Stack spacing={0.75}>
        {REFERRALS.map((r) => {
          const cat = CATEGORY_BY_ID[r.category];
          return (
            <Box
              key={r.id}
              component={motion.div}
              whileHover={{ x: 2 }}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '40px 1fr 1fr 80px 80px 80px' },
                alignItems: 'center', gap: 1.5,
                p: 1.5, borderRadius: 2,
                border: '1px solid', borderColor: 'divider',
                borderLeft: `4px solid ${URGENCY[r.urgency].color}`,
              }}
            >
              <Box sx={{
                width: 36, height: 36, borderRadius: '50%',
                bgcolor: 'rgba(7,44,94,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: 'primary.main',
              }}>
                {r.resident}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.summary}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.property} · RSC: {r.rsc}</Typography>
              </Box>
              <Chip size="small" label={cat.label} sx={{ bgcolor: cat.color, color: 'common.white', justifySelf: 'flex-start' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Days open</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{r.daysOpen}d</Typography>
              </Box>
              <Chip size="small" label={URGENCY[r.urgency].label} sx={{ bgcolor: URGENCY[r.urgency].color, color: 'common.white', justifySelf: 'flex-start' }} />
            </Box>
          );
        })}
      </Stack>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(94,184,168,0.08)', borderRadius: 2, borderLeft: '3px solid', borderColor: 'secondary.main' }}>
        <Typography variant="caption" sx={{ color: 'secondary.dark' }}>
          All RSCs trauma-informed certified. Resident details kept to initials at this layer; full records accessible only to the assigned RSC and the property's resident services lead.
        </Typography>
      </Box>
    </Card>
  );
}
