import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Stack, Typography, Button, Chip, Breadcrumbs, Link, LinearProgress,
  Divider, Skeleton, Card,
} from '@mui/material';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import EventOutlined from '@mui/icons-material/EventOutlined';
import { motion } from 'framer-motion';
import PageWrapper from '../layout/PageWrapper';
import UserAvatar from '../shared/UserAvatar';
import PermissionGate from '../shared/PermissionGate';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import EditInitiativePanel from './EditInitiativePanel';
import EditWorkplanPanel from '../workplans/EditWorkplanPanel';
import WorkplanCard from '../workplans/WorkplanCard';
import TouchpointTimeline from '../touchpoints/TouchpointTimeline';
import AddToCalendarButton from '../shared/AddToCalendarButton';
import { ROLES } from '../../utils/permissions';
import {
  useInitiative,
  useUpdateInitiative,
  useDeleteInitiative,
} from '../../hooks/useInitiatives';
import {
  useWorkplans,
  useCreateWorkplan,
} from '../../hooks/useWorkplans';
import { useTouchpoints } from '../../hooks/useTouchpoints';
import { usePriorities } from '../../hooks/usePriorities';
import useSnackbar from '../shared/GlobalSnackbar';
import { formatDay } from '../../utils/formatters';
import { INITIATIVE_STATUS } from '../../api/initiatives';
import { generalStatusToBadge, priorityStatusToText } from '../../utils/a11yColors';

// Decorative status colors (left rail + progress fill). NOT for text.
const STATUS_DECOR = {
  [INITIATIVE_STATUS.ON_TRACK]: '#006e5c',
  [INITIATIVE_STATUS.AT_RISK]: '#f1ac49',
  [INITIATIVE_STATUS.OFF_TRACK]: '#db534c',
  [INITIATIVE_STATUS.COMPLETED]: '#072c5e',
};

const STATUS_LABEL = {
  on_track: 'On Track', at_risk: 'At Risk', off_track: 'Off Track', completed: 'Completed',
};

export default function InitiativeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const initiativeQ = useInitiative(id);
  const workplansQ = useWorkplans({ initiativeId: id });
  const prioritiesQ = usePriorities();
  const touchpointsQ = useTouchpoints({ initiativeId: id });
  const update = useUpdateInitiative();
  const remove = useDeleteInitiative();
  const createWorkplan = useCreateWorkplan();
  const snackbar = useSnackbar();

  const [editOpen, setEditOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [newWorkplan, setNewWorkplan] = useState(false);

  const init = initiativeQ.data;
  const workplans = workplansQ.data ?? [];

  const priorityCountByWorkplan = useMemo(() => {
    const map = {};
    (prioritiesQ.data ?? []).forEach((p) => {
      if (p.workplanId) map[p.workplanId] = (map[p.workplanId] || 0) + 1;
    });
    return map;
  }, [prioritiesQ.data]);

  if (initiativeQ.isLoading) {
    return (
      <PageWrapper>
        <Skeleton variant="rounded" height={140} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={300} />
      </PageWrapper>
    );
  }

  if (!init) {
    return (
      <PageWrapper>
        <Typography variant="h3">Initiative not found.</Typography>
        <Button onClick={() => navigate('/initiatives')}>← Back to Initiatives</Button>
      </PageWrapper>
    );
  }

  const color = STATUS_DECOR[init.status] ?? '#5a6475';
  const badge = generalStatusToBadge(init.status);
  const textColor = priorityStatusToText(init.status);

  const handleUpdate = async (values) => {
    try {
      await update.mutateAsync({ id, patch: values });
      snackbar.success('Initiative updated.');
      setEditOpen(false);
    } catch { snackbar.error('Could not update.'); }
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(id);
      snackbar.success('Initiative deleted.');
      navigate('/initiatives');
    } catch { snackbar.error('Could not delete.'); }
  };

  const handleCreateWorkplan = async (values) => {
    try {
      await createWorkplan.mutateAsync({ ...values, initiativeId: id });
      snackbar.success('Workplan created under this initiative.');
      setNewWorkplan(false);
    } catch { snackbar.error('Could not create workplan.'); }
  };

  return (
    <PageWrapper>
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <Link component={RouterLink} to="/initiatives" underline="hover" color="text.secondary">
          Initiatives
        </Link>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {init.title}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ borderLeft: `4px solid ${color}`, bgcolor: 'background.paper', borderRadius: 3, p: 3, mb: 3, boxShadow: 1 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ md: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" sx={{ color: 'secondary.dark' }}>
              Quarterly Initiative
            </Typography>
            <Typography variant="h1" sx={{ mb: 1 }}>{init.title}</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1.5 }}>
              <Chip size="small" label={`Q${init.quarter} ${init.year}`} sx={{ bgcolor: 'primary.main', color: 'common.white' }} />
              {init.theme && <Chip size="small" label={init.theme} variant="outlined" />}
              <Chip size="small" label={STATUS_LABEL[init.status]} sx={{ bgcolor: badge.soft, color: badge.fg, fontWeight: 700 }} />
              <Chip size="small" label={`${formatDay(init.startDate)} → ${formatDay(init.endDate)}`} />
            </Stack>
            {init.narrative && (
              <Typography variant="body2" sx={{ color: 'text.primary', mb: 2, maxWidth: 720 }}>
                {init.narrative}
              </Typography>
            )}

            <Box sx={{ maxWidth: 480, mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={init.rollupPct ?? 0}
                sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(7,44,94,0.06)', '& .MuiLinearProgress-bar': { bgcolor: color } }}
              />
              <Typography variant="caption" sx={{ color: textColor, fontWeight: 700, mt: 0.5, display: 'block' }}>
                Rollup: {init.rollupPct ?? 0}%
              </Typography>
            </Box>

            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {init.primaryAdvocate && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <UserAvatar user={init.primaryAdvocate} size="md" />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Primary Advocate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1 }}>{init.primaryAdvocate.name}</Typography>
                  </Box>
                </Stack>
              )}
              {init.owners?.length > 1 && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Co-owners</Typography>
                  <Stack direction="row" spacing={-1} sx={{ mt: 0.25 }}>
                    {init.owners.filter((o) => o.id !== init.primaryAdvocate?.id).map((o) => (
                      <UserAvatar key={o.id} user={o} size="sm" sx={{ border: '2px solid white' }} />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <AddToCalendarButton
              seed={{
                title: init.title,
                whyItMatters: init.narrative,
                startsAt: init.endDate,
                endsAt: init.endDate,
                source: { type: 'initiative', id: init.id, label: init.title, url: `/initiatives/${init.id}` },
              }}
            />
            <PermissionGate roles={[ROLES.ELT]}>
              <Button variant="outlined" startIcon={<EditOutlined />} onClick={() => setEditOpen(true)}>Edit</Button>
              <Button variant="text" color="error" startIcon={<DeleteOutlined />} onClick={() => setConfirm(true)}>Delete</Button>
            </PermissionGate>
          </Stack>
        </Stack>

        {init.successMeasures?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Success measures
            </Typography>
            <Stack spacing={0.5}>
              {init.successMeasures.map((m, i) => (
                <Typography key={i} variant="body2" sx={{ pl: 1.5, borderLeft: '3px solid', borderColor: 'secondary.main' }}>
                  {m}
                </Typography>
              ))}
            </Stack>
          </>
        )}
      </Box>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <AccountTreeOutlined sx={{ color: 'secondary.main' }} />
        <Typography variant="h3" sx={{ flex: 1 }}>Contributing Workplans</Typography>
        <Button size="small" variant="outlined" startIcon={<AddOutlined />} onClick={() => setNewWorkplan(true)}>
          Add Workplan
        </Button>
      </Stack>

      {workplans.length === 0 ? (
        <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 3, textAlign: 'center', mb: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No workplans under this initiative yet. Add one to start the rollup chain.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.25} sx={{ mb: 4 }}>
          {workplans.map((w) => (
            <Box key={w.id}>
              <WorkplanCard workplan={w} />
              {priorityCountByWorkplan[w.id] > 0 && (
                <Typography variant="caption" sx={{ color: 'text.secondary', pl: 2.5, display: 'block', mt: 0.5 }}>
                  ↳ {priorityCountByWorkplan[w.id]} priorit{priorityCountByWorkplan[w.id] === 1 ? 'y' : 'ies'} contributing
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      )}

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <EventOutlined sx={{ color: 'secondary.main' }} />
        <Typography variant="h3">Touchpoints feeding this initiative</Typography>
      </Stack>
      <TouchpointTimeline items={touchpointsQ.data ?? []} loading={touchpointsQ.isLoading} />

      <EditInitiativePanel
        open={editOpen}
        mode="edit"
        initiative={init}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      <EditWorkplanPanel
        open={newWorkplan}
        mode="create"
        presetInitiativeId={id}
        onClose={() => setNewWorkplan(false)}
        onSubmit={handleCreateWorkplan}
      />

      <ConfirmationDialog
        open={confirm}
        title="Delete this initiative?"
        description={`"${init.title}" will be removed. Workplans and priorities will lose their parent links.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirm(false)}
      />
    </PageWrapper>
  );
}
