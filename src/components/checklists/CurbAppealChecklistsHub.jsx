// Jaime's review hub for the Q-by-Q Curb Appeal Checklists across all 71
// communities. Top: portfolio progress + pending review queue. Bottom: full
// portfolio matrix grouped by status.
import { useMemo, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, Stack, Typography, Chip, Button, Divider, ToggleButtonGroup,
  ToggleButton, LinearProgress, TextField, Skeleton, IconButton, Tooltip,
} from '@mui/material';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import PageWrapper from '../layout/PageWrapper';
import UserAvatar from '../shared/UserAvatar';
import ChecklistStatusChip from './ChecklistStatusChip';
import {
  STATUS, STATUS_LABEL, STATUS_META, TOTAL_ITEM_COUNT, countRated,
  flaggedItems, currentQuarter, currentYear,
} from '../../api/curbAppealChecklists';
import {
  useChecklistsForAllProperties, useApproveChecklist, useReturnChecklist,
} from '../../hooks/useChecklists';
import useSnackbar from '../shared/GlobalSnackbar';
import { STATE_LABEL } from '../../api/properties';

function ReviewCard({ row, onApprove, onReturn }) {
  const navigate = useNavigate();
  const { property, submission } = row;
  const [showReturn, setShowReturn] = useState(false);
  const [note, setNote] = useState('');
  const flagged = flaggedItems(submission);

  const handleApprove = async () => {
    onApprove({ id: submission.id, note: note.trim() || null });
  };
  const handleReturn = async () => {
    if (!note.trim()) return;
    onReturn({ id: submission.id, note: note.trim() });
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <LocationOnOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {property.city ? `${property.city}, ${property.state}` : STATE_LABEL[property.state]}
            </Typography>
          </Stack>
          <Typography variant="h4">{property.name}</Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
            {submission.submittedBy && (
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <UserAvatar user={submission.submittedBy} size="sm" />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {submission.submittedBy.name}
                </Typography>
              </Stack>
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Submitted {dayjs(submission.submittedAt).format('MMM D')}
            </Typography>
            <Chip
              size="small"
              label={`${flagged.length} flagged`}
              sx={{
                bgcolor: flagged.length > 0 ? 'rgba(219,83,76,0.18)' : 'rgba(0,110,92,0.14)',
                color: flagged.length > 0 ? '#8a2b27' : '#004d40',
                fontWeight: 700,
              }}
            />
          </Stack>
        </Box>
        <Button
          size="small"
          variant="outlined"
          endIcon={<OpenInNewOutlined fontSize="small" />}
          onClick={() => navigate(`/checklists/curb-appeal/${property.id}?quarter=${submission.quarter}&year=${submission.year}`)}
        >
          Open
        </Button>
      </Stack>

      {flagged.length > 0 && (
        <Box sx={{ mt: 1.5, p: 1, borderRadius: 1.5, bgcolor: 'rgba(219,83,76,0.05)', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ color: '#8a2b27', fontWeight: 700, display: 'block', mb: 0.5 }}>
            Items flagged for correction
          </Typography>
          <Stack spacing={0.25}>
            {flagged.slice(0, 4).map((f, i) => (
              <Typography key={i} variant="caption" sx={{ color: 'text.primary' }}>
                <strong>{f.sectionLabel}:</strong> {f.itemLabel}
                {f.dateOfCorrection && ` · by ${dayjs(f.dateOfCorrection).format('MMM D')}`}
              </Typography>
            ))}
            {flagged.length > 4 && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                + {flagged.length - 4} more
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      {showReturn ? (
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <TextField
            label="Note to submitter (required for Return)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline minRows={2} fullWidth autoFocus
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="text" onClick={() => { setShowReturn(false); setNote(''); }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleReturn} disabled={!note.trim()}>
              Send back to submitter
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} justifyContent="flex-end">
          <Button
            variant="outlined" color="error"
            startIcon={<CancelOutlined />}
            onClick={() => setShowReturn(true)}
          >
            Return
          </Button>
          <Button
            variant="contained" color="success"
            startIcon={<CheckCircleOutlined />}
            onClick={handleApprove}
          >
            Approve
          </Button>
        </Stack>
      )}
    </Card>
  );
}

function PortfolioRow({ row }) {
  const navigate = useNavigate();
  const { property, submission } = row;
  const completed = countRated(submission);

  return (
    <Box
      component={motion.div}
      whileHover={{ x: 2 }}
      onClick={() => navigate(`/checklists/curb-appeal/${property.id}?quarter=${submission.quarter}&year=${submission.year}`)}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 100px' },
        alignItems: 'center', gap: 1.5,
        p: 1.25, borderRadius: 2,
        border: '1px solid', borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'rgba(94,184,168,0.06)' },
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{property.name}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          {property.city ? `${property.city}, ${property.state}` : STATE_LABEL[property.state]} · {property.units ?? '?'} units
        </Typography>
      </Box>
      <ChecklistStatusChip status={submission.status} />
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.25 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{completed}/{TOTAL_ITEM_COUNT}</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(completed / TOTAL_ITEM_COUNT) * 100}
          sx={{
            height: 4, borderRadius: 2,
            bgcolor: 'rgba(7,44,94,0.06)',
            '& .MuiLinearProgress-bar': { bgcolor: STATUS_META[submission.status]?.dot ?? '#5a6475' },
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'right' }}>
        {submission.submittedAt ? dayjs(submission.submittedAt).format('MMM D') : '—'}
      </Typography>
    </Box>
  );
}

const QUARTER_OPTIONS = [1, 2, 3, 4];

export default function CurbAppealChecklistsHub() {
  const [quarter, setQuarter] = useState(currentQuarter());
  const [year] = useState(currentYear());
  const [statusFilter, setStatusFilter] = useState('all');

  const rowsQ = useChecklistsForAllProperties({ quarter, year });
  const approve = useApproveChecklist();
  const returnIt = useReturnChecklist();
  const snackbar = useSnackbar();

  const rows = rowsQ.data ?? [];
  const stats = useMemo(() => {
    const acc = { total: rows.length, not_started: 0, draft: 0, submitted: 0, approved: 0, returned: 0 };
    rows.forEach((r) => { acc[r.submission.status] += 1; });
    return acc;
  }, [rows]);

  const pendingReview = rows.filter((r) => r.submission.status === STATUS.SUBMITTED);
  const filtered = statusFilter === 'all' ? rows : rows.filter((r) => r.submission.status === statusFilter);

  const pctApproved = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  const handleApprove = async ({ id, note }) => {
    try {
      await approve.mutateAsync({ id, note });
      snackbar.success('Checklist approved.');
    } catch { snackbar.error('Could not approve.'); }
  };
  const handleReturn = async ({ id, note }) => {
    try {
      await returnIt.mutateAsync({ id, note });
      snackbar.info('Sent back to the submitter.');
    } catch { snackbar.error('Could not return.'); }
  };

  if (rowsQ.isLoading) {
    return (
      <PageWrapper>
        <Skeleton variant="rounded" height={140} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={400} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* HEADER */}
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Compass Quarterly Commitment</Typography>
          <Typography variant="h1">Curb Appeal Checklists</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 720 }}>
            Quarterly portfolio-wide commitment. Community managers complete a 38-item walkthrough; you review + approve.
          </Typography>
        </Box>
        <ToggleButtonGroup exclusive size="small" value={quarter} onChange={(_e, v) => v && setQuarter(v)}>
          {QUARTER_OPTIONS.map((q) => (
            <ToggleButton key={q} value={q}>Q{q} {year}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {/* PROGRESS STRIP */}
      <Card sx={{ p: { xs: 2, md: 2.5 }, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>Portfolio progress</Typography>
            <Typography variant="h2">
              {stats.approved} of {stats.total} approved · {pctApproved}%
            </Typography>
          </Box>
          <Box sx={{ minWidth: 220 }}>
            <LinearProgress
              variant="determinate"
              value={pctApproved}
              sx={{
                height: 12, borderRadius: 6,
                bgcolor: 'rgba(7,44,94,0.06)',
                '& .MuiLinearProgress-bar': { bgcolor: '#006e5c' },
              }}
            />
          </Box>
        </Stack>

        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' } }}>
          {Object.entries(STATUS_LABEL).map(([k, label]) => (
            <Tooltip key={k} title={`${stats[k]} of ${stats.total}`} arrow>
              <Box
                onClick={() => setStatusFilter(statusFilter === k ? 'all' : k)}
                sx={{
                  p: 1.25, borderRadius: 1.5, cursor: 'pointer',
                  border: '1px solid', borderColor: statusFilter === k ? STATUS_META[k].dot : 'divider',
                  bgcolor: statusFilter === k ? STATUS_META[k].soft : 'background.paper',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_META[k].dot }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
                </Stack>
                <Typography variant="h3">{stats[k] ?? 0}</Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Card>

      {/* PENDING REVIEW QUEUE */}
      {pendingReview.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <Typography variant="h3">Pending your review</Typography>
            <Chip size="small" label={pendingReview.length} sx={{ bgcolor: '#a06a14', color: 'common.white', fontWeight: 700 }} />
          </Stack>
          <Stack spacing={1.25}>
            {pendingReview.map((row) => (
              <ReviewCard key={row.submission.id} row={row} onApprove={handleApprove} onReturn={handleReturn} />
            ))}
          </Stack>
        </Box>
      )}

      {/* PORTFOLIO MATRIX */}
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="h3">
            {statusFilter === 'all' ? 'All communities' : STATUS_LABEL[statusFilter]}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
              ({filtered.length})
            </Typography>
          </Typography>
          {statusFilter !== 'all' && (
            <Button size="small" variant="text" onClick={() => setStatusFilter('all')}>
              Clear filter
            </Button>
          )}
        </Stack>
        <Stack spacing={0.75}>
          {filtered.map((row) => (
            <PortfolioRow key={row.property.id} row={row} />
          ))}
        </Stack>
      </Box>
    </PageWrapper>
  );
}
