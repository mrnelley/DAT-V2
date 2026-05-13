// Sam's CFO flagship widget — Financial Snapshot.
// Seed data scrubbed for the executive scope demo. Structure remains so the
// shape of the widget is visible; values render as "—" until the financial
// data source is wired.

import { Box, Card, Stack, Typography, LinearProgress, Chip, Divider } from '@mui/material';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import RequestQuoteOutlined from '@mui/icons-material/RequestQuoteOutlined';
import LocalAtmOutlined from '@mui/icons-material/LocalAtmOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
import { motion } from 'framer-motion';

// All values null until a real financial data feed is connected.
const SNAPSHOT = {
  cashOnHand: null,
  cashRunwayDays: null,
  arAging: { current: 0, d30: 0, d60: 0, d90: 0 },
  arTotal: null,
  monthlyBurn: null,
  daysToClose: null,
  closeTaskCount: { done: 0, total: 0 },
  cashTrend: [],
};

const fmtMoney = (n) => {
  if (n == null) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
};

function Tile({ icon, label, headline, sublabel, accent }) {
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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
        {icon}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      </Stack>
      <Typography variant="h2" sx={{ lineHeight: 1.1 }}>{headline}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{sublabel}</Typography>
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
          Awaiting financial data integration
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Tiles + AR aging + cash trend populate when this is wired to the financial system.
        </Typography>
      </Box>
    </Box>
  );
}

export default function FinancialSnapshot() {
  const s = SNAPSHOT;
  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Financial Snapshot</Typography>
          <Typography variant="h3">Cash position & close health</Typography>
        </Box>
        <Chip label="No data feed" size="small" sx={{ bgcolor: 'rgba(90,100,117,0.14)', color: '#3f4a5c' }} />
      </Stack>

      <PendingBanner />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 2 }}>
        <Tile
          icon={<AccountBalanceWalletOutlined sx={{ color: 'primary.main' }} />}
          label="Cash on Hand"
          headline={fmtMoney(s.cashOnHand)}
          sublabel="—"
          accent="#072c5e"
        />
        <Tile
          icon={<ReceiptLongOutlined sx={{ color: 'secondary.dark' }} />}
          label="Runway"
          headline={s.cashRunwayDays != null ? `${s.cashRunwayDays}d` : '—'}
          sublabel="operating"
          accent="#5eb8a8"
        />
        <Tile
          icon={<LocalAtmOutlined sx={{ color: 'warning.dark' }} />}
          label="Monthly burn"
          headline={fmtMoney(s.monthlyBurn)}
          sublabel="vs. budget"
          accent="#f1ac49"
        />
        <Tile
          icon={<RequestQuoteOutlined sx={{ color: 'error.dark' }} />}
          label="Days to Q-close"
          headline={s.daysToClose != null ? `${s.daysToClose}d` : '—'}
          sublabel={`${s.closeTaskCount.done}/${s.closeTaskCount.total} tasks`}
          accent="#db534c"
        />
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
            AR Aging Mix
          </Typography>
          <Box sx={{ height: 14, borderRadius: 1.5, bgcolor: 'rgba(7,44,94,0.06)', mb: 0.75 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Awaiting AR data
          </Typography>
        </Box>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            6-month cash trend
          </Typography>
          <Box sx={{
            height: 64,
            border: '1px dashed', borderColor: 'divider',
            borderRadius: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>—</Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Close progress
      </Typography>
      <LinearProgress
        variant="determinate"
        value={0}
        sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(7,44,94,0.06)', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
        0 of 0 close tasks tracked.
      </Typography>
    </Card>
  );
}
