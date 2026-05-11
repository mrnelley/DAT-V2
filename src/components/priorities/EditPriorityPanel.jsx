import { useEffect, useState } from 'react';
import {
  Drawer,
  Box,
  Stack,
  TextField,
  Typography,
  IconButton,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { MEASUREMENT, PRIORITY_STATUS } from '../../api/priorities';
import { PROPERTY_OPTIONS } from '../../utils/calendarTokens';
import dayjs from 'dayjs';
import { toLocalInput, fromLocalInput } from '../../utils/formatters';

const STATUS_OPTIONS = [
  { value: PRIORITY_STATUS.ON_TRACK, label: 'On Track' },
  { value: PRIORITY_STATUS.AT_RISK, label: 'At Risk' },
  { value: PRIORITY_STATUS.OFF_TRACK, label: 'Off Track' },
];

const emptyDraft = {
  title: '',
  context: '',
  measurement: MEASUREMENT.NUMBER,
  start: 0,
  current: 0,
  target: 100,
  unit: '%',
  status: PRIORITY_STATUS.ON_TRACK,
  isCompany: false,
  isMine: true,
  teamId: 'org_wide',
  dueAt: dayjs().add(30, 'day').toISOString(),
};

export default function EditPriorityPanel({ open, mode = 'create', priority, onClose, onSubmit }) {
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    if (open) {
      setDraft({ ...emptyDraft, ...(priority ?? {}) });
    }
  }, [open, priority]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

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
        initial: { x: 420 },
        animate: { x: 0 },
        transition: { type: 'spring', stiffness: 280, damping: 26 },
        sx: { width: { xs: '100%', sm: 460 } },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Priorities
          </Typography>
          <Typography variant="h3">{mode === 'edit' ? 'Edit Priority' : 'Add Priority'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
        <Stack spacing={2.25}>
          <TextField
            label="Priority Name"
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Context — why this priority exists"
            value={draft.context}
            onChange={(e) => set({ context: e.target.value })}
            multiline
            minRows={3}
            fullWidth
          />

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.75, display: 'block' }}>
              Success measurement
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={draft.measurement}
              onChange={(_e, v) => v && set({ measurement: v })}
            >
              <ToggleButton value={MEASUREMENT.NUMBER}>Number</ToggleButton>
              <ToggleButton value={MEASUREMENT.TASK}>Task</ToggleButton>
              <ToggleButton value={MEASUREMENT.ROLLUP}>Rollup</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
            <TextField
              label="Start"
              type="number"
              value={draft.start}
              onChange={(e) => set({ start: Number(e.target.value) })}
            />
            <TextField
              label="Current"
              type="number"
              value={draft.current}
              onChange={(e) => set({ current: Number(e.target.value) })}
            />
            <TextField
              label="Target"
              type="number"
              value={draft.target}
              onChange={(e) => set({ target: Number(e.target.value) })}
            />
            <TextField
              label="Unit"
              value={draft.unit}
              onChange={(e) => set({ unit: e.target.value })}
            />
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
            <TextField
              select
              label="Status"
              value={draft.status}
              onChange={(e) => set({ status: e.target.value })}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Team / Property / Department"
              value={draft.teamId}
              onChange={(e) => set({ teamId: e.target.value })}
            >
              {PROPERTY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Due"
            type="datetime-local"
            value={toLocalInput(draft.dueAt)}
            onChange={(e) => set({ dueAt: fromLocalInput(e.target.value) })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Stack direction="row" spacing={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(draft.isCompany)}
                  onChange={(e) => set({ isCompany: e.target.checked })}
                />
              }
              label="Company Priority"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(draft.isMine)}
                  onChange={(e) => set({ isMine: e.target.checked })}
                />
              }
              label="My Priority"
            />
          </Stack>
        </Stack>
      </Box>

      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!draft.title?.trim()}>
          {mode === 'edit' ? 'Save changes' : 'Add priority'}
        </Button>
      </Box>
    </Drawer>
  );
}
