import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Chip,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import {
  TOUCHPOINT_TYPE,
  TYPE_META,
  TOUCHPOINT_STATUS,
} from '../../api/touchpoints';
import { toLocalInput, fromLocalInput } from '../../utils/formatters';
import { usePeople } from '../../hooks/usePeople';
import { useCircles } from '../../hooks/useCircles';
import { useInitiatives } from '../../hooks/useInitiatives';
import { useWorkplans } from '../../hooks/useWorkplans';
import { usePriorities } from '../../hooks/usePriorities';

const MotionPaper = motion.create('div');

const emptyDraft = () => ({
  type: TOUCHPOINT_TYPE.MEETING,
  status: TOUCHPOINT_STATUS.COMPLETED,
  subject: '',
  outcome: '',
  occurredAt: dayjs().toISOString(),
  durationMin: 30,
  peopleIds: [],
  circleIds: [],
  priorityId: null,
  workplanId: null,
  initiativeId: null,
});

export default function TouchpointDialog({ open, seed, onClose, onSubmit }) {
  const peopleQ = usePeople();
  const circlesQ = useCircles();
  const initiativesQ = useInitiatives();
  const workplansQ = useWorkplans();
  const prioritiesQ = usePriorities();

  const start = useMemo(() => ({ ...emptyDraft(), ...(seed ?? {}) }), [seed]);
  const [draft, setDraft] = useState(start);

  useEffect(() => {
    if (open) setDraft(start);
  }, [open, start]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const peopleOptions = peopleQ.data ?? [];
  const circleOptions = circlesQ.data ?? [];
  const initiativeOptions = initiativesQ.data ?? [];
  const workplanOptions = (workplansQ.data ?? []).filter((w) =>
    draft.initiativeId ? w.initiativeId === draft.initiativeId : true,
  );
  const priorityOptions = (prioritiesQ.data ?? []).filter((p) =>
    draft.workplanId ? p.workplanId === draft.workplanId : draft.initiativeId ? p.initiativeId === draft.initiativeId : true,
  );

  const handleSave = () => {
    const cleaned = { ...draft, subject: draft.subject.trim() };
    if (!cleaned.subject) return;
    onSubmit?.(cleaned);
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          PaperComponent={(props) => (
            <MotionPaper
              {...props}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 760, ...props.style }}
            />
          )}
        >
          <DialogTitle
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Advocacy
              </Typography>
              <Typography variant="h3" sx={{ mt: 0.25 }}>
                Log Touchpoint
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ pb: 3 }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.75, display: 'block' }}>
                  Type
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={draft.type}
                  onChange={(_e, v) => v && set({ type: v })}
                  sx={{ flexWrap: 'wrap' }}
                >
                  {Object.entries(TYPE_META).map(([k, m]) => (
                    <ToggleButton key={k} value={k}>{m.label}</ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              <TextField
                label="Subject — what was this touchpoint about?"
                value={draft.subject}
                onChange={(e) => set({ subject: e.target.value })}
                required
                fullWidth
                autoFocus
              />

              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' } }}>
                <TextField
                  label="When"
                  type="datetime-local"
                  value={toLocalInput(draft.occurredAt)}
                  onChange={(e) => set({ occurredAt: fromLocalInput(e.target.value) })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Duration (min)"
                  type="number"
                  value={draft.durationMin}
                  onChange={(e) => set({ durationMin: Number(e.target.value) })}
                />
                <TextField
                  select
                  label="Status"
                  value={draft.status}
                  onChange={(e) => set({ status: e.target.value })}
                >
                  <MenuItem value={TOUCHPOINT_STATUS.COMPLETED}>Completed</MenuItem>
                  <MenuItem value={TOUCHPOINT_STATUS.SCHEDULED}>Scheduled</MenuItem>
                  <MenuItem value={TOUCHPOINT_STATUS.NO_SHOW}>No-show</MenuItem>
                </TextField>
              </Box>

              <Autocomplete
                multiple
                size="small"
                options={peopleOptions}
                getOptionLabel={(o) => o.name}
                value={peopleOptions.filter((p) => draft.peopleIds.includes(p.id))}
                onChange={(_e, val) => set({ peopleIds: val.map((p) => p.id) })}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {option.title} · {option.org}
                      </Typography>
                    </Box>
                  </li>
                )}
                renderInput={(params) => <TextField {...params} label="People involved" />}
              />

              <Autocomplete
                multiple
                size="small"
                options={circleOptions}
                getOptionLabel={(o) => o.name}
                value={circleOptions.filter((c) => draft.circleIds.includes(c.id))}
                onChange={(_e, val) => set({ circleIds: val.map((c) => c.id) })}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                renderInput={(params) => <TextField {...params} label="Circles" />}
              />

              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Connect to work (optional)
              </Typography>

              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' } }}>
                <TextField
                  select
                  label="Initiative"
                  value={draft.initiativeId ?? ''}
                  onChange={(e) => set({ initiativeId: e.target.value || null, workplanId: null, priorityId: null })}
                >
                  <MenuItem value="">—</MenuItem>
                  {initiativeOptions.map((i) => (
                    <MenuItem key={i.id} value={i.id}>{i.title}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Workplan"
                  value={draft.workplanId ?? ''}
                  onChange={(e) => set({ workplanId: e.target.value || null, priorityId: null })}
                  disabled={workplanOptions.length === 0}
                >
                  <MenuItem value="">—</MenuItem>
                  {workplanOptions.map((w) => (
                    <MenuItem key={w.id} value={w.id}>{w.title}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Priority"
                  value={draft.priorityId ?? ''}
                  onChange={(e) => set({ priorityId: e.target.value || null })}
                  disabled={priorityOptions.length === 0}
                >
                  <MenuItem value="">—</MenuItem>
                  {priorityOptions.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                label="Outcome — what happened? Sentiment? Next step?"
                value={draft.outcome}
                onChange={(e) => set({ outcome: e.target.value })}
                multiline
                minRows={3}
                fullWidth
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} variant="text" color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary" disabled={!draft.subject.trim()}>
              Log Touchpoint
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
