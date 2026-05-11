import { useState, useMemo } from 'react';
import { Box, Stack, Typography, Button, ToggleButtonGroup, ToggleButton, Skeleton } from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import { motion } from 'framer-motion';
import PageWrapper from '../layout/PageWrapper';
import InitiativeCard from './InitiativeCard';
import EditInitiativePanel from './EditInitiativePanel';
import EmptyState from '../shared/EmptyState';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import PermissionGate from '../shared/PermissionGate';
import { ROLES } from '../../utils/permissions';
import {
  useInitiatives,
  useCreateInitiative,
  useUpdateInitiative,
  useDeleteInitiative,
} from '../../hooks/useInitiatives';
import useSnackbar from '../shared/GlobalSnackbar';
import useAuth from '../../hooks/useAuth';

export default function InitiativesPage() {
  const { user } = useAuth();
  const initiativesQ = useInitiatives();
  const create = useCreateInitiative();
  const update = useUpdateInitiative();
  const remove = useDeleteInitiative();
  const snackbar = useSnackbar();

  const [filter, setFilter] = useState('all');
  const [edit, setEdit] = useState({ open: false, mode: 'create', initiative: null });
  const [confirm, setConfirm] = useState({ open: false, initiative: null });

  const filtered = useMemo(() => {
    let list = initiativesQ.data ?? [];
    if (filter === 'mine') {
      list = list.filter((i) => i.primaryAdvocate?.id === user?.id);
    }
    return list;
  }, [initiativesQ.data, filter, user]);

  const handleSubmit = async (values) => {
    try {
      if (edit.mode === 'edit') {
        await update.mutateAsync({ id: edit.initiative.id, patch: values });
        snackbar.success('Initiative updated.');
      } else {
        await create.mutateAsync(values);
        snackbar.success('Initiative created.');
      }
      setEdit({ open: false, mode: 'create', initiative: null });
    } catch { snackbar.error('Could not save initiative.'); }
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(confirm.initiative.id);
      snackbar.success('Initiative deleted.');
      setConfirm({ open: false, initiative: null });
    } catch { snackbar.error('Could not delete initiative.'); }
  };

  return (
    <PageWrapper>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }} justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Module</Typography>
          <Typography variant="h1">Annual & Quarterly Initiatives</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 720 }}>
            The top of the hierarchy. Each initiative names a Primary Advocate and rolls up workplans and priorities feeding the outcome.
          </Typography>
        </Box>
        <PermissionGate roles={[ROLES.ELT]}>
          <Button variant="contained" startIcon={<AddOutlined />} onClick={() => setEdit({ open: true, mode: 'create', initiative: null })}>
            Add Initiative
          </Button>
        </PermissionGate>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <ToggleButtonGroup exclusive size="small" value={filter} onChange={(_e, v) => v && setFilter(v)}>
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="mine">I'm Primary Advocate</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {initiativesQ.isLoading ? (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} variant="rounded" height={220} />)}
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FlagOutlined}
          title="No initiatives yet"
          description="Set the quarter's initiatives to give workplans + priorities something to roll up to."
        />
      ) : (
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          }}
        >
          {filtered.map((i) => (
            <motion.div
              key={i.id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
              style={{ position: 'relative' }}
            >
              <InitiativeCard
                initiative={i}
                onEdit={(it) => setEdit({ open: true, mode: 'edit', initiative: it })}
                onDelete={(it) => setConfirm({ open: true, initiative: it })}
              />
            </motion.div>
          ))}
        </Box>
      )}

      <EditInitiativePanel
        open={edit.open}
        mode={edit.mode}
        initiative={edit.initiative}
        onClose={() => setEdit({ open: false, mode: 'create', initiative: null })}
        onSubmit={handleSubmit}
      />

      <ConfirmationDialog
        open={confirm.open}
        title="Delete this initiative?"
        description={confirm.initiative?.title ? `"${confirm.initiative.title}" will be removed.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, initiative: null })}
      />
    </PageWrapper>
  );
}
