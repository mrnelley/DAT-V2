import { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  Button,
  TextField,
  Chip,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import { motion } from 'framer-motion';
import UserAvatar from '../shared/UserAvatar';
import SubtypeChip from './SubtypeChip';
import CalendarStatusChip from './CalendarStatusChip';
import {
  SCOPE,
  APPROVAL_STATUS,
  PROPERTY_LABEL,
  SOURCE_LABEL,
} from '../../utils/calendarTokens';
import { formatDateTime, formatDay } from '../../utils/formatters';
import useAddToCalendar from '../shared/CalendarDialogProvider';
import {
  useApproveItem,
  useDeleteCalendarItem,
  useRejectItem,
  useSubmitItemToOrg,
} from '../../hooks/useCalendar';
import useSnackbar from '../shared/GlobalSnackbar';
import usePermissions from '../../hooks/usePermissions';
import { ROLES } from '../../utils/permissions';

function MeaningRow({ label, value }) {
  if (!value) return null;
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-line' }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function CalendarItemDetailDrawer({ open, item, onClose }) {
  const { openEdit } = useAddToCalendar();
  const approve = useApproveItem();
  const reject = useRejectItem();
  const submit = useSubmitItemToOrg();
  const remove = useDeleteCalendarItem();
  const snackbar = useSnackbar();
  const { can } = usePermissions();

  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState('');

  if (!item) return null;

  const isPending = item.scope === SCOPE.PERSONAL && item.approvalStatus === APPROVAL_STATUS.PENDING;
  const isRejected = item.scope === SCOPE.PERSONAL && item.approvalStatus === APPROVAL_STATUS.REJECTED;
  const canApprove = can([ROLES.ELT]) && isPending;
  const canSubmit = item.scope === SCOPE.PERSONAL && item.approvalStatus !== APPROVAL_STATUS.PENDING;

  const dateLine = item.allDay
    ? formatDay(item.startsAt)
    : `${formatDateTime(item.startsAt)} → ${formatDateTime(item.endsAt)}`;

  const sourceLabel = item.source ? SOURCE_LABEL[item.source.type] : null;

  const handleApprove = async () => {
    try {
      await approve.mutateAsync(item.id);
      snackbar.success('Approved — now visible on the Compass Calendar.');
      onClose?.();
    } catch {
      snackbar.error('Could not approve.');
    }
  };

  const handleReject = async () => {
    try {
      await reject.mutateAsync({ id: item.id, reason: reason.trim() || null });
      snackbar.info('Sent back to submitter with a note.');
      setRejectMode(false);
      setReason('');
      onClose?.();
    } catch {
      snackbar.error('Could not reject.');
    }
  };

  const handleSubmit = async () => {
    try {
      await submit.mutateAsync(item.id);
      snackbar.success('Sent to Compass Calendar for approval.');
      onClose?.();
    } catch {
      snackbar.error('Could not submit.');
    }
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(item.id);
      snackbar.success('Deleted.');
      onClose?.();
    } catch {
      snackbar.error('Could not delete.');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        component: motion.div,
        initial: { x: 420 },
        animate: { x: 0 },
        transition: { type: 'spring', stiffness: 280, damping: 26 },
        sx: {
          width: { xs: '100%', sm: 440 },
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Details
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            {item.title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
          <SubtypeChip subtype={item.subtype} />
          <CalendarStatusChip status={item.status} />
          {isPending && (
            <Chip
              size="small"
              label="Pending org approval"
              sx={{ bgcolor: 'rgba(241,172,73,0.18)', color: 'warning.dark', textTransform: 'none' }}
            />
          )}
          {isRejected && (
            <Chip
              size="small"
              label="Returned"
              sx={{ bgcolor: 'rgba(219,83,76,0.15)', color: 'error.dark', textTransform: 'none' }}
            />
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
          <strong>When:</strong> {dateLine}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', mb: 2 }}>
          <strong>Where:</strong> {PROPERTY_LABEL[item.propertyOrDepartment] ?? item.propertyOrDepartment}
        </Typography>

        {item.owner && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <UserAvatar user={item.owner} size="sm" />
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Owner
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.owner.name}
              </Typography>
            </Box>
          </Box>
        )}

        {sourceLabel && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(94,184,168,0.12)',
              border: '1px solid rgba(94,184,168,0.35)',
              borderRadius: 2,
              px: 1.5,
              py: 1,
              mb: 2,
            }}
          >
            <LinkOutlined fontSize="small" sx={{ color: 'secondary.dark' }} />
            <Typography variant="body2" sx={{ color: 'secondary.dark' }}>
              {sourceLabel}:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.source.label}
            </Typography>
          </Box>
        )}

        {isRejected && item.rejectionReason && (
          <Box
            sx={{
              bgcolor: 'rgba(219,83,76,0.08)',
              border: '1px solid rgba(219,83,76,0.25)',
              borderRadius: 2,
              p: 1.5,
              mb: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: 'error.dark', display: 'block', mb: 0.5 }}>
              Note from admin
            </Typography>
            <Typography variant="body2">{item.rejectionReason}</Typography>
          </Box>
        )}

        {item.description && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <MeaningRow label="Why It Matters" value={item.whyItMatters} />
          <MeaningRow label="Who It Impacts" value={item.whoItImpacts} />
          <MeaningRow label="Support Needed" value={item.supportNeeded} />
          <MeaningRow label="Outcome Expected" value={item.outcomeExpected} />
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {canApprove && !rejectMode && (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleOutlined />}
              onClick={handleApprove}
              fullWidth
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelOutlined />}
              onClick={() => setRejectMode(true)}
              fullWidth
            >
              Send Back
            </Button>
          </Stack>
        )}

        {canApprove && rejectMode && (
          <Stack spacing={1}>
            <TextField
              label="Note to submitter (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              minRows={2}
              fullWidth
              autoFocus
            />
            <Stack direction="row" spacing={1}>
              <Button variant="text" onClick={() => { setRejectMode(false); setReason(''); }} fullWidth>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleReject} fullWidth>
                Send back
              </Button>
            </Stack>
          </Stack>
        )}

        {canSubmit && !canApprove && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<SendOutlined />}
            onClick={handleSubmit}
            fullWidth
          >
            {isRejected ? 'Resubmit to Compass Calendar' : 'Send to Compass Calendar'}
          </Button>
        )}

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<EditOutlined />}
            onClick={() => openEdit(item)}
            fullWidth
          >
            Edit
          </Button>
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteOutlined />}
            onClick={handleDelete}
            fullWidth
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
