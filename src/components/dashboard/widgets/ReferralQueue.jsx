// Michael's Resident Services flagship widget — Referral queue + needs.
// Seed data scrubbed for the executive scope demo. Tiles + category cards +
// queue structure remain so the shape is visible; counts and rows are empty
// until the resident-services intake system is wired.

import { Box, Card, Stack, Typography, Chip, Divider } from '@mui/material';
import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
import { motion } from 'framer-motion';

const STATS = {
  activeCaseload: 0,
  newThisWeek: 0,
  avgFirstContactHours: null,
  targetHours: 24,
  rscCount: 0,
  rscCapacity: 0,
};

// Categories remain so executives can see the taxonomy. Each card has an
// AA-safe text color + AA-safe fill color (white-text passes 4.5:1 on fill).
const CATEGORIES = [
  { id: 'mental_health',  label: 'Mental Health',  color: '#1a4a80', text: '#1a4a80', fill: '#1a4a80', count: 0, trend: '—' },
  { id: 'food_security',  label: 'Food Security',  color: '#5eb8a8', text: '#1f5147', fill: '#2c6e63', count: 0, trend: '—' },
  { id: 'employment',     label: 'Employment',     color: '#f1ac49', text: '#8a5a14', fill: '#a06a14', count: 0, trend: '—' },
  { id: 'childcare',      label: 'Childcare',      color: '#db534c', text: '#8a2b27', fill: '#a52a1f', count: 0, trend: '—' },
  { id: 'legal',          label: 'Legal',          color: '#5a6475', text: '#3f4a5c', fill: '#3f4a5c', count: 0, trend: '—' },
  { id: 'senior_support', label: 'Senior Support', color: '#006e5c', text: '#004d40', fill: '#006e5c', count: 0, trend: '—' },
];

const REFERRALS = [];

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
          Awaiting Resident Services intake system
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Caseload, RSC capacity, and the referral queue populate when needs
          assessments start flowing in.
        </Typography>
      </Box>
    </Box>
  );
}

export default function ReferralQueue() {
  const s = STATS;
  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Resident Services</Typography>
          <Typography variant="h3">Referral queue & needs categories</Typography>
        </Box>
        <Chip label="Trauma-informed" size="small" sx={{ bgcolor: 'rgba(94,184,168,0.18)', color: 'secondary.dark' }} />
      </Stack>

      <PendingBanner />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 3 }}>
        <Tile icon={<VolunteerActivismOutlined sx={{ color: 'primary.main' }} />} label="Active caseload" headline={s.activeCaseload} sub={`${s.newThisWeek} new this week`} accent="#072c5e" />
        <Tile icon={<AccessTimeOutlined sx={{ color: '#3f4a5c' }} />} label="Avg first contact" headline="—" sub={`target ${s.targetHours}h`} accent="#3f4a5c" />
        <Tile icon={<FavoriteBorderOutlined sx={{ color: 'secondary.dark' }} />} label="RSC team" headline={s.rscCount} sub="—" accent="#5eb8a8" />
        <Tile icon={<VolunteerActivismOutlined sx={{ color: 'error.dark' }} />} label="Capacity used" headline="—" sub="—" accent="#db534c" />
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
            <Typography variant="h3" sx={{ lineHeight: 1.1, color: c.text }}>{c.count}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.trend}</Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        Today's queue — resident initials only
      </Typography>
      {REFERRALS.length === 0 && (
        <Box sx={{ p: 3, borderRadius: 2, border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No active referrals in the queue.
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(94,184,168,0.08)', borderRadius: 2, borderLeft: '3px solid', borderColor: 'secondary.main' }}>
        <Typography variant="caption" sx={{ color: 'secondary.dark' }}>
          All RSCs trauma-informed certified. Resident details kept to initials at this layer; full records accessible only to the assigned RSC and the property's resident services lead.
        </Typography>
      </Box>
    </Card>
  );
}
