import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Skeleton,
} from '@mui/material';
import AddOutlined from '@mui/icons-material/AddOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { motion } from 'framer-motion';
import PageWrapper from '../layout/PageWrapper';
import PriorityRow from './PriorityRow';
import EditPriorityPanel from './EditPriorityPanel';
import EmptyState from '../shared/EmptyState';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import {
  usePriorities,
  useCreatePriority,
  useUpdatePriority,
  useDeletePriority,
} from '../../hooks/usePriorities';
import useSnackbar from '../shared/GlobalSnackbar';

export default function PrioritiesPage() {
  const { data, isLoading } = usePriorities();
  const createPriority = useCreatePriority();
  const updatePriority = useUpdatePriority();
  const deletePriority = useDeletePriority();
  const snackbar = useSnackbar();

  const [filter, setFilter] = useState('all'); // all | company | mine
  const [search, setSearch] = useState('');
  const [edit, setEdit] = useState({ open: false, mode: 'create', priority: null });
  const [confirm, setConfirm] = useState({ open: false, priority: null });

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (filter === 'company') list = list.filter((p) => p.isCompany);
    if (filter === 'mine') list = list.filter((p) => p.isMine);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.context?.toLowerCase().includes(q) ||
          p.owner?.name?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [data, filter, search]);

  const handleSubmit = async (values) => {
    try {
      if (edit.mode === 'edit') {
        await updatePriority.mutateAsync({ id: edit.priority.id, patch: values });
        snackbar.success('Priority updated.');
      } else {
        await createPriority.mutateAsync(values);
        snackbar.success('Priority added.');
      }
      setEdit({ open: false, mode: 'create', priority: null });
    } catch {
      snackbar.error('Could not save priority.');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePriority.mutateAsync(confirm.priority.id);
      snackbar.success('Priority deleted.');
      setConfirm({ open: false, priority: null });
    } catch {
      snackbar.error('Could not delete priority.');
    }
  };

  return (
    <PageWrapper>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ md: 'flex-end' }}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>
            Module
          </Typography>
          <Typography variant="h1">Manage Priorities</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 720 }}>
            Quarter-scoped outcomes for HDC. Click any row to see the heatmap and context.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlined />}
            onClick={() => setEdit({ open: true, mode: 'create', priority: null })}
          >
            Add Priority
          </Button>
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <ToggleButtonGroup
          exclusive
          size="small"
          value={filter}
          onChange={(_e, v) => v && setFilter(v)}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="company">Company</ToggleButton>
          <ToggleButton value="mine">Mine</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          size="small"
          placeholder="Search priorities, owners, context…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchOutlined fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          sx={{ minWidth: 320 }}
        />
      </Stack>

      {isLoading ? (
        <Stack spacing={1.5}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={84} />
          ))}
        </Stack>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FlagOutlined}
          title="No priorities here yet"
          description={
            search
              ? 'Nothing matches that search. Try clearing the filter.'
              : 'Set the first priority for this quarter to start tracking.'
          }
          actionLabel="Add Priority"
          onAction={() => setEdit({ open: true, mode: 'create', priority: null })}
        />
      ) : (
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
        >
          {filtered.map((priority) => (
            <motion.div
              key={priority.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
              }}
            >
              <PriorityRow
                priority={priority}
                onEdit={(p) => setEdit({ open: true, mode: 'edit', priority: p })}
                onDelete={(p) => setConfirm({ open: true, priority: p })}
              />
            </motion.div>
          ))}
        </Box>
      )}

      <EditPriorityPanel
        open={edit.open}
        mode={edit.mode}
        priority={edit.priority}
        onClose={() => setEdit({ open: false, mode: 'create', priority: null })}
        onSubmit={handleSubmit}
      />

      <ConfirmationDialog
        open={confirm.open}
        title="Delete this priority?"
        description={confirm.priority?.title ? `"${confirm.priority.title}" will be removed.` : 'This will be removed.'}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, priority: null })}
      />
    </PageWrapper>
  );
}
