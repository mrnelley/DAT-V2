import { useMemo, useState } from 'react';
import { Box, Stack, Typography, Button, ToggleButtonGroup, ToggleButton, Skeleton } from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import { motion } from 'framer-motion';
import PageWrapper from '../layout/PageWrapper';
import WorkplanCard from './WorkplanCard';
import EditWorkplanPanel from './EditWorkplanPanel';
import EmptyState from '../shared/EmptyState';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import {
  useWorkplans,
  useCreateWorkplan,
  useUpdateWorkplan,
  useDeleteWorkplan,
} from '../../hooks/useWorkplans';
import { useInitiatives } from '../../hooks/useInitiatives';
import useSnackbar from '../shared/GlobalSnackbar';
import useAuth from '../../hooks/useAuth';

export default function WorkplansPage() {
  const { user } = useAuth();
  const workplansQ = useWorkplans();
  const initiativesQ = useInitiatives();
  const create = useCreateWorkplan();
  const update = useUpdateWorkplan();
  const remove = useDeleteWorkplan();
  const snackbar = useSnackbar();

  const [filter, setFilter] = useState('all'); // all | mine
  const [edit, setEdit] = useState({ open: false, mode: 'create', workplan: null });
  const [confirm, setConfirm] = useState({ open: false, workplan: null });

  const initiativeTitleById = useMemo(() => {
    const map = {};
    (initiativesQ.data ?? []).forEach((i) => { map[i.id] = i.title; });
    return map;
  }, [initiativesQ.data]);

  const filtered = useMemo(() => {
    let list = workplansQ.data ?? [];
    if (filter === 'mine') list = list.filter((w) => w.owner?.id === user?.id);
    return list;
  }, [workplansQ.data, filter, user]);

  const handleSubmit = async (values) => {
    try {
      if (edit.mode === 'edit') {
        await update.mutateAsync({ id: edit.workplan.id, patch: values });
        snackbar.success('Workplan updated.');
      } else {
        await create.mutateAsync(values);
        snackbar.success('Workplan created.');
      }
      setEdit({ open: false, mode: 'create', workplan: null });
    } catch { snackbar.error('Could not save workplan.'); }
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(confirm.workplan.id);
      snackbar.success('Workplan deleted.');
      setConfirm({ open: false, workplan: null });
    } catch { snackbar.error('Could not delete workplan.'); }
  };

  return (
    <PageWrapper>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }} justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Module</Typography>
          <Typography variant="h1">Departmental Workplans</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 720 }}>
            Workplans live between Quarterly Initiatives (above) and Individual Priorities (below). Each workplan rolls up to one initiative and contains the priorities that contribute to it.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setEdit({ open: true, mode: 'create', workplan: null })}>
          Add Workplan
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ToggleButtonGroup exclusive size="small" value={filter} onChange={(_e, v) => v && setFilter(v)}>
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="mine">Mine</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {workplansQ.isLoading ? (
        <Stack spacing={1.5}>{[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={108} />)}</Stack>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={AccountTreeOutlined}
          title="No workplans yet"
          description="Create a workplan to connect departmental work to a quarterly initiative."
          actionLabel="Add Workplan"
          onAction={() => setEdit({ open: true, mode: 'create', workplan: null })}
        />
      ) : (
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
        >
          {filtered.map((w) => (
            <motion.div key={w.id} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}>
              <WorkplanCard
                workplan={w}
                initiativeTitle={w.initiativeId ? initiativeTitleById[w.initiativeId] : null}
                onEdit={(wp) => setEdit({ open: true, mode: 'edit', workplan: wp })}
                onDelete={(wp) => setConfirm({ open: true, workplan: wp })}
              />
            </motion.div>
          ))}
        </Box>
      )}

      <EditWorkplanPanel
        open={edit.open}
        mode={edit.mode}
        workplan={edit.workplan}
        onClose={() => setEdit({ open: false, mode: 'create', workplan: null })}
        onSubmit={handleSubmit}
      />

      <ConfirmationDialog
        open={confirm.open}
        title="Delete this workplan?"
        description={confirm.workplan?.title ? `"${confirm.workplan.title}" will be removed. Linked priorities will lose their parent.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, workplan: null })}
      />
    </PageWrapper>
  );
}
