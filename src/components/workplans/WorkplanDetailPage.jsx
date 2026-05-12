import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  Breadcrumbs,
  Link,
  LinearProgress,
  Divider,
  IconButton,
  Skeleton,
} from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import { motion } from 'framer-motion';
import PageWrapper from '../layout/PageWrapper';
import UserAvatar from '../shared/UserAvatar';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import EditWorkplanPanel from './EditWorkplanPanel';
import EditPriorityPanel from '../priorities/EditPriorityPanel';
import PriorityRow from '../priorities/PriorityRow';
import { useWorkplan, useUpdateWorkplan, useDeleteWorkplan } from '../../hooks/useWorkplans';
import { useInitiative } from '../../hooks/useInitiatives';
import { usePriorities, useCreatePriority, useUpdatePriority, useDeletePriority } from '../../hooks/usePriorities';
import { useTouchpoints } from '../../hooks/useTouchpoints';
import useSnackbar from '../shared/GlobalSnackbar';
import { PROPERTY_LABEL } from '../../utils/calendarTokens';
import { WORKPLAN_STATUS } from '../../api/workplans';
import { formatDay } from '../../utils/formatters';
import TouchpointTimeline from '../touchpoints/TouchpointTimeline';
import AddToCalendarButton from '../shared/AddToCalendarButton';
import { generalStatusToBadge, priorityStatusToText } from '../../utils/a11yColors';

const STATUS_DECOR = {
  on_track: '#006e5c', at_risk: '#f1ac49', off_track: '#db534c', completed: '#072c5e',
};

const STATUS_LABEL = {
  on_track: 'On Track', at_risk: 'At Risk', off_track: 'Off Track', completed: 'Completed',
};

export default function WorkplanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const workplanQ = useWorkplan(id);
  const initiativeQ = useInitiative(workplanQ.data?.initiativeId);
  const prioritiesQ = usePriorities();
  const touchpointsQ = useTouchpoints({ workplanId: id });
  const update = useUpdateWorkplan();
  const remove = useDeleteWorkplan();
  const createPriority = useCreatePriority();
  const updatePriority = useUpdatePriority();
  const deletePriority = useDeletePriority();
  const snackbar = useSnackbar();

  const [editOpen, setEditOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [editPriority, setEditPriority] = useState({ open: false, mode: 'create', priority: null });

  const wp = workplanQ.data;
  const childPriorities = useMemo(
    () => (prioritiesQ.data ?? []).filter((p) => p.workplanId === id),
    [prioritiesQ.data, id],
  );
  const color = STATUS_DECOR[wp?.status] ?? '#5a6475';
  const badge = generalStatusToBadge(wp?.status);
  const textColor = priorityStatusToText(wp?.status);

  if (workplanQ.isLoading) {
    return (
      <PageWrapper>
        <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={300} />
      </PageWrapper>
    );
  }

  if (!wp) {
    return (
      <PageWrapper>
        <Typography variant="h3">Workplan not found.</Typography>
        <Button onClick={() => navigate('/workplans')}>← Back to Workplans</Button>
      </PageWrapper>
    );
  }

  const handleUpdate = async (values) => {
    try {
      await update.mutateAsync({ id, patch: values });
      snackbar.success('Workplan updated.');
      setEditOpen(false);
    } catch { snackbar.error('Could not update workplan.'); }
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(id);
      snackbar.success('Workplan deleted.');
      navigate('/workplans');
    } catch { snackbar.error('Could not delete workplan.'); }
  };

  const handlePrioritySubmit = async (values) => {
    try {
      const next = { ...values, workplanId: id, initiativeId: wp.initiativeId ?? null };
      if (editPriority.mode === 'edit') {
        await updatePriority.mutateAsync({ id: editPriority.priority.id, patch: next });
        snackbar.success('Priority updated.');
      } else {
        await createPriority.mutateAsync(next);
        snackbar.success('Priority added.');
      }
      setEditPriority({ open: false, mode: 'create', priority: null });
    } catch { snackbar.error('Could not save priority.'); }
  };

  return (
    <PageWrapper>
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <Link component={RouterLink} to="/initiatives" underline="hover" color="text.secondary">
          Initiatives
        </Link>
        {initiativeQ.data && (
          <Link component={RouterLink} to={`/initiatives/${initiativeQ.data.id}`} underline="hover" color="text.secondary">
            {initiativeQ.data.title}
          </Link>
        )}
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {wp.title}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ borderLeft: `4px solid ${color}`, bgcolor: 'background.paper', borderRadius: 3, p: 3, mb: 3, boxShadow: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ md: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Departmental Workplan</Typography>
            <Typography variant="h1" sx={{ mb: 1 }}>{wp.title}</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1.5 }}>
              <Chip size="small" label={STATUS_LABEL[wp.status]} sx={{ bgcolor: badge.soft, color: badge.fg, fontWeight: 700 }} />
              <Chip size="small" label={PROPERTY_LABEL[wp.departmentId] ?? wp.departmentId} />
              <Chip size="small" label={`${formatDay(wp.startDate)} → ${formatDay(wp.endDate)}`} />
            </Stack>
            {wp.description && (
              <Typography variant="body2" sx={{ color: 'text.primary', mb: 1.5, maxWidth: 720 }}>
                {wp.description}
              </Typography>
            )}
            <Box sx={{ maxWidth: 480, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={wp.rollupPct ?? 0}
                sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(7,44,94,0.06)', '& .MuiLinearProgress-bar': { bgcolor: color } }}
              />
              <Typography variant="caption" sx={{ color: textColor, fontWeight: 700, mt: 0.5, display: 'block' }}>
                Rollup: {wp.rollupPct ?? 0}%
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <AddToCalendarButton
              seed={{
                title: wp.title,
                whyItMatters: wp.description,
                propertyOrDepartment: wp.departmentId,
                startsAt: wp.endDate,
                endsAt: wp.endDate,
                source: { type: 'workplan', id: wp.id, label: wp.title, url: `/workplans/${wp.id}` },
              }}
            />
            <Button variant="outlined" startIcon={<EditOutlined />} onClick={() => setEditOpen(true)}>Edit</Button>
            <Button variant="text" color="error" startIcon={<DeleteOutlined />} onClick={() => setConfirm(true)}>Delete</Button>
          </Stack>
        </Stack>

        {wp.owner && (
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 1 }}>
            <UserAvatar user={wp.owner} size="sm" />
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Owner</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1 }}>{wp.owner.name}</Typography>
            </Box>
          </Stack>
        )}

        {wp.keyActivities?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Key Activities
            </Typography>
            <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {wp.keyActivities.map((a, i) => <Chip key={i} label={a} size="small" />)}
            </Stack>
          </>
        )}
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="h3">Contributing Priorities</Typography>
        <Button size="small" variant="outlined" startIcon={<AddOutlined />} onClick={() => setEditPriority({ open: true, mode: 'create', priority: null })}>
          Add priority under this workplan
        </Button>
      </Stack>

      {childPriorities.length === 0 ? (
        <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 3, textAlign: 'center', mb: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No priorities under this workplan yet. Add one to start tracking.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.25} sx={{ mb: 4 }}>
          {childPriorities.map((p) => (
            <PriorityRow
              key={p.id}
              priority={p}
              onEdit={(pr) => setEditPriority({ open: true, mode: 'edit', priority: pr })}
              onDelete={async (pr) => {
                try {
                  await deletePriority.mutateAsync(pr.id);
                  snackbar.success('Priority deleted.');
                } catch { snackbar.error('Could not delete priority.'); }
              }}
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <EventOutlined sx={{ color: 'secondary.main' }} />
        <Typography variant="h3">Touchpoints contributing to this workplan</Typography>
      </Stack>
      <TouchpointTimeline items={touchpointsQ.data ?? []} loading={touchpointsQ.isLoading} />

      <EditWorkplanPanel
        open={editOpen}
        mode="edit"
        workplan={wp}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      <EditPriorityPanel
        open={editPriority.open}
        mode={editPriority.mode}
        priority={editPriority.priority}
        presetWorkplanId={id}
        onClose={() => setEditPriority({ open: false, mode: 'create', priority: null })}
        onSubmit={handlePrioritySubmit}
      />

      <ConfirmationDialog
        open={confirm}
        title="Delete this workplan?"
        description={`"${wp.title}" will be removed. Its child priorities will lose their parent link.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirm(false)}
      />
    </PageWrapper>
  );
}
