import { Box, Card, Stack, Typography, LinearProgress, Chip, Divider } from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import RequestQuoteOutlined from '@mui/icons-material/RequestQuoteOutlined';
import LocalAtmOutlined from '@mui/icons-material/LocalAtmOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import { motion } from 'framer-motion';

// Mock financial data — replace with real Supabase queries when wired.
const SNAPSHOT = {
  cashOnHand: 4_280_000,
  cashRunwayDays: 96,
  cashDelta: 0.034, // +3.4% MoM
  arAging: { current: 71, d30: 14, d60: 7, d90: 8 }, // % of total receivables
  arTotal: 1_185_000,
  monthlyBurn: 920_000,
  budgetVarianceMo: -0.027, // -2.7% under
  daysToClose: 14,
  closeTaskCount: { done: 5, total: 9 },
  cashTrend: [3.9, 4.0, 4.05, 4.1, 4.18, 4.28], // millions
};

const fmtMoney = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n}`;
};

function Tile({ icon, label, headline, sublabel, accent, trend }) {
  const isUp = trend != null && trend > 0;
  return (
    <Box
      component={motion.div}
      whileHover={{ y: -2 }}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderTop: `3px solid ${accent}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
        {icon}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      </Stack>
      <Typography variant="h2" sx={{ lineHeight: 1.1 }}>{headline}</Typography>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
        {trend != null && (
          <>
            {isUp
              ? <TrendingUp fontSize="small" sx={{ color: 'success.dark' }} />
              : <TrendingDown fontSize="small" sx={{ color: 'error.main' }} />}
            <Typography variant="caption" sx={{ color: isUp ? 'success.dark' : 'error.main', fontWeight: 700 }}>
              {Math.abs(trend * 100).toFixed(1)}%
            </Typography>
          </>
        )}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{sublabel}</Typography>
      </Stack>
    </Box>
  );
}

function ArAgingBar({ buckets, total }) {
  const segments = [
    { key: 'current', label: 'Current', color: '#006e5c', value: buckets.current },
    { key: 'd30', label: '0–30', color: '#5eb8a8', value: buckets.d30 },
    { key: 'd60', label: '31–60', color: '#f1ac49', value: buckets.d60 },
    { key: 'd90', label: '60+', color: '#db534c', value: buckets.d90 },
  ];
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>AR Aging Mix</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{fmtMoney(total)} total</Typography>
      </Stack>
      <Box sx={{ display: 'flex', height: 14, borderRadius: 1.5, overflow: 'hidden', mb: 0.75 }}>
        {segments.map((s) => (
          <Box key={s.key} sx={{ width: `${s.value}%`, bgcolor: s.color }} />
        ))}
      </Box>
      <Stack direction="row" spacing={1.5} flexWrap="wrap">
        {segments.map((s) => (
          <Stack key={s.key} direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: s.color }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {s.label}: <strong>{s.value}%</strong>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function CashTrend({ values }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 320;
  const H = 64;
  const stepX = W / (values.length - 1);
  const pts = values.map((v, i) => `${i * stepX},${H - ((v - min) / range) * (H - 10) - 5}`).join(' ');
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        6-month cash trend
      </Typography>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <polyline points={pts} fill="none" stroke="#072c5e" strokeWidth="2.5" strokeLinecap="round" />
        {values.map((v, i) => (
          <circle key={i} cx={i * stepX} cy={H - ((v - min) / range) * (H - 10) - 5} r="3" fill="#5eb8a8" />
        ))}
      </svg>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.25 }}>
        {values.map((_, i) => (
          <Typography key={i} variant="caption" sx={{ color: 'text.secondary' }}>
            M{i + 1}
          </Typography>
        ))}
      </Stack>
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
        <Chip label="Live (mock)" size="small" sx={{ bgcolor: 'rgba(0,110,92,0.12)', color: 'success.dark' }} />
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mb: 2 }}>
        <Tile
          icon={<AccountBalanceWalletOutlined sx={{ color: 'primary.main' }} />}
          label="Cash on Hand"
          headline={fmtMoney(s.cashOnHand)}
          sublabel="MoM"
          trend={s.cashDelta}
          accent="#072c5e"
        />
        <Tile
          icon={<ReceiptLongOutlined sx={{ color: 'secondary.dark' }} />}
          label="Runway"
          headline={`${s.cashRunwayDays}d`}
          sublabel="operating"
          accent="#5eb8a8"
        />
        <Tile
          icon={<LocalAtmOutlined sx={{ color: 'warning.dark' }} />}
          label="Monthly burn"
          headline={fmtMoney(s.monthlyBurn)}
          sublabel="vs. budget"
          trend={s.budgetVarianceMo}
          accent="#f1ac49"
        />
        <Tile
          icon={<RequestQuoteOutlined sx={{ color: 'error.dark' }} />}
          label="Days to Q-close"
          headline={`${s.daysToClose}d`}
          sublabel={`${s.closeTaskCount.done}/${s.closeTaskCount.total} tasks`}
          accent="#db534c"
        />
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <ArAgingBar buckets={s.arAging} total={s.arTotal} />
        <CashTrend values={s.cashTrend} />
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Close progress
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(s.closeTaskCount.done / s.closeTaskCount.total) * 100}
        sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(7,44,94,0.06)', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
        {s.closeTaskCount.done} of {s.closeTaskCount.total} Q2 close tasks complete · {s.daysToClose} days remain
      </Typography>
    </Card>
  );
}
