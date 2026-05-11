import { useEffect, useState } from 'react';
import {
  Drawer,
  Box,
  Stack,
  TextField,
  Typography,
  IconButton,
  Button,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { WORKPLAN_STATUS } from '../../api/workplans';
import { PROPERTY_OPTIONS } from '../../utils/calendarTokens';
import { useInitiatives } from '../../hooks/useInitiatives';
import { toLocalInput, fromLocalInput } from '../../utils/formatters';

const STATUS_OPTIONS = [
  { value: WORKPLAN_STATUS.ON_TRACK, label: 'On Track' },
  { value: WORKPLAN_STATUS.AT_RISK, label: 'At Risk' },
  { value: WORKPLAN_STATUS.OFF_TRACK, label: 'Off Track' },
  { value: WORKPLAN_STATUS.COMPLETED, label: 'Completed' },
];

const emptyDraft = {
  title: '',
  description: '',
  initiativeId: '',
  departmentId: 'org_wide',
  status: WORKPLAN_STATUS.ON_TRACK,
  rollupPct: 0,
  startDate: dayjs().toISOString(),
  endDate: dayjs().add(60, 'day').toISOString(),
  keyActivities: [],
};

export default function EditWorkplanPanel({ open, mode = 'create', workplan, presetInitiativeId, onClose, onSubmit }) {
  const initiativesQ = useInitiatives();
  const initiativeOptions = initiativesQ.data ?? [];

  const [draft, setDraft] = useState(emptyDraft);
  const [activityInput, setActivityInput] = useState('');

  useEffect(() => {
    if (open) {
      const next = workplan
        ? { ...emptyDraft, ...workplan, initiativeId: workplan.initiativeId ?? '' }
        : { ...emptyDraft, initiativeId: presetInitiativeId ?? '' };
      setDraft(next);
      setActivityInput('');
    }
  }, [open, workplan, presetInitiativeId]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const addActivity = () => {
    const v = activityInput.trim();
    if (!v) return;
    set({ keyActivities: [...(draft.keyActivities ?? []), v] });
    setActivityInput('');
  };

  const removeActivity = (idx) => {
    set({ keyActivities: draft.keyActivities.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    if (!draft.title?.trim()) return;
    onSubmit?.({
      ...draft,
      title: draft.title.trim(),
      initiativeId: draft.initiativeId || null,
    });
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
        sx: { width: { xs: '100%', sm: 460 } },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Departmental Workplan
          </Typography>
          <Typography variant="h3">{mode === 'edit' ? 'Edit Workplan' : 'Add Workplan'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
        <Stack spacing={2.25}>
          <TextField
            label="Workplan Title"
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Description"
            value={draft.description}
            onChange={(e) => set({ description: e.target.value })}
            multiline
            minRows={3}
            fullWidth
          />
          <TextField
            select
            label="Parent Initiative"
            value={draft.initiativeId}
            onChange={(e) => set({ initiativeId: e.target.value })}
            helperText="Workplans roll up to a quarterly initiative."
          >
            <MenuItem value="">—</MenuItem>
            {initiativeOptions.map((i) => (
              <MenuItem key={i.id} value={i.id}>{i.title}</MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
            <TextField
              select
              label="Owning Dept / Property"
              value={draft.departmentId}
              onChange={(e) => set({ departmentId: e.target.value })}
            >
              {PROPERTY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={draft.status}
              onChange={(e) => set({ status: e.target.value })}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr 1fr' }}>
            <TextField
              label="Start"
              type="datetime-local"
              value={toLocalInput(draft.startDate)}
              onChange={(e) => set({ startDate: fromLocalInput(e.target.value) })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End"
              type="datetime-local"
              value={toLocalInput(draft.endDate)}
              onChange={(e) => set({ endDate: fromLocalInput(e.target.value) })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Rollup %"
              type="number"
              value={draft.rollupPct}
              onChange={(e) => set({ rollupPct: Math.max(0, Math.min(100, Number(e.target.value))) })}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Key activities
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField
                size="small"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
                placeholder="Add a key activity…"
                fullWidth
              />
              <Button onClick={addActivity} startIcon={<AddOutlined />} variant="outlined" size="small">
                Add
              </Button>
            </Stack>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {(draft.keyActivities ?? []).map((a, i) => (
                <Chip key={i} label={a} onDelete={() => removeActivity(i)} size="small" />
              ))}
            </Box>
          </Box>
        </Stack>
      </Box>

      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!draft.title?.trim()}>
          {mode === 'edit' ? 'Save changes' : 'Create workplan'}
        </Button>
      </Box>
    </Drawer>
  );
}
