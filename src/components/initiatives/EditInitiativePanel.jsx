import { useEffect, useState } from 'react';
import {
  Drawer, Box, Stack, TextField, Typography, IconButton, Button,
  MenuItem, Divider, Chip,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { INITIATIVE_STATUS } from '../../api/initiatives';
import { toLocalInput, fromLocalInput } from '../../utils/formatters';

const STATUS_OPTIONS = [
  { value: INITIATIVE_STATUS.ON_TRACK, label: 'On Track' },
  { value: INITIATIVE_STATUS.AT_RISK, label: 'At Risk' },
  { value: INITIATIVE_STATUS.OFF_TRACK, label: 'Off Track' },
  { value: INITIATIVE_STATUS.COMPLETED, label: 'Completed' },
];

const emptyDraft = {
  title: '',
  theme: '',
  narrative: '',
  year: dayjs().year(),
  quarter: Math.ceil((dayjs().month() + 1) / 3),
  status: INITIATIVE_STATUS.ON_TRACK,
  rollupPct: 0,
  successMeasures: [],
  startDate: dayjs().toISOString(),
  endDate: dayjs().add(90, 'day').toISOString(),
};

export default function EditInitiativePanel({ open, mode = 'create', initiative, onClose, onSubmit }) {
  const [draft, setDraft] = useState(emptyDraft);
  const [measureInput, setMeasureInput] = useState('');

  useEffect(() => {
    if (open) {
      setDraft(initiative ? { ...emptyDraft, ...initiative } : emptyDraft);
      setMeasureInput('');
    }
  }, [open, initiative]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const addMeasure = () => {
    const v = measureInput.trim();
    if (!v) return;
    set({ successMeasures: [...(draft.successMeasures ?? []), v] });
    setMeasureInput('');
  };

  const removeMeasure = (idx) => {
    set({ successMeasures: draft.successMeasures.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    if (!draft.title?.trim()) return;
    onSubmit?.({ ...draft, title: draft.title.trim() });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        component: motion.div,
        initial: { x: 420 }, animate: { x: 0 }, transition: { type: 'spring', stiffness: 280, damping: 26 },
        sx: { width: { xs: '100%', sm: 460 } },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Quarterly Initiative</Typography>
          <Typography variant="h3">{mode === 'edit' ? 'Edit Initiative' : 'Add Initiative'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </Box>
      <Divider />

      <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
        <Stack spacing={2.25}>
          <TextField
            label="Initiative Title"
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
            required fullWidth autoFocus
          />
          <TextField
            label="Theme"
            value={draft.theme}
            onChange={(e) => set({ theme: e.target.value })}
            placeholder="e.g. State Legislative, Federal / Funder, Resident-Led"
            fullWidth
          />
          <TextField
            label="Narrative — why this matters this quarter"
            value={draft.narrative}
            onChange={(e) => set({ narrative: e.target.value })}
            multiline minRows={3} fullWidth
          />

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr 1fr' }}>
            <TextField
              label="Year" type="number"
              value={draft.year}
              onChange={(e) => set({ year: Number(e.target.value) })}
            />
            <TextField
              select label="Quarter"
              value={draft.quarter}
              onChange={(e) => set({ quarter: Number(e.target.value) })}
            >
              {[1, 2, 3, 4].map((q) => <MenuItem key={q} value={q}>Q{q}</MenuItem>)}
            </TextField>
            <TextField
              select label="Status"
              value={draft.status}
              onChange={(e) => set({ status: e.target.value })}
            >
              {STATUS_OPTIONS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
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
              label="Rollup %" type="number"
              value={draft.rollupPct}
              onChange={(e) => set({ rollupPct: Math.max(0, Math.min(100, Number(e.target.value))) })}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Success measures
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField
                size="small"
                value={measureInput}
                onChange={(e) => setMeasureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMeasure())}
                placeholder="Add a success measure…" fullWidth
              />
              <Button onClick={addMeasure} startIcon={<AddOutlined />} variant="outlined" size="small">Add</Button>
            </Stack>
            <Stack spacing={0.5}>
              {(draft.successMeasures ?? []).map((m, i) => (
                <Chip key={i} label={m} onDelete={() => removeMeasure(i)} sx={{ justifyContent: 'flex-start' }} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!draft.title?.trim()}>
          {mode === 'edit' ? 'Save changes' : 'Create initiative'}
        </Button>
      </Box>
    </Drawer>
  );
}
