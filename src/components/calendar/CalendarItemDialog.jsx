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
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LinkOutlined from '@mui/icons-material/LinkOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SUBTYPE,
  SUBTYPE_ORDER,
  SUBTYPE_META,
  STATUS,
  STATUS_ORDER,
  STATUS_META,
  PROPERTY_OPTIONS,
  SOURCE_LABEL,
} from '../../utils/calendarTokens';
import { toLocalInput, fromLocalInput } from '../../utils/formatters';
import useAuth from '../../hooks/useAuth';
import dayjs from 'dayjs';

const MotionPaper = motion.create('div');

const emptyDraft = (user) => ({
  title: '',
  description: '',
  subtype: SUBTYPE.WAYPOINT,
  status: STATUS.ON_COURSE,
  startsAt: dayjs().add(1, 'day').hour(9).minute(0).second(0).toISOString(),
  endsAt: dayjs().add(1, 'day').hour(10).minute(0).second(0).toISOString(),
  allDay: false,
  owner: user ?? null,
  propertyOrDepartment: 'org_wide',
  whyItMatters: '',
  whoItImpacts: '',
  supportNeeded: '',
  outcomeExpected: '',
  source: null,
});

export default function CalendarItemDialog({
  open,
  mode = 'create', // 'create' | 'edit'
  initialItem = null,
  seed = null,
  onClose,
  onSubmit,
}) {
  const { user } = useAuth();

  const startingDraft = useMemo(() => {
    if (initialItem) return { ...emptyDraft(user), ...initialItem };
    if (seed) return { ...emptyDraft(user), ...seed };
    return emptyDraft(user);
  }, [initialItem, seed, user]);

  const [draft, setDraft] = useState(startingDraft);

  useEffect(() => {
    if (open) setDraft(startingDraft);
  }, [open, startingDraft]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = () => {
    const cleaned = {
      ...draft,
      title: draft.title.trim(),
    };
    if (!cleaned.title) return;
    onSubmit?.(cleaned);
  };

  const sourceLabel = draft.source ? SOURCE_LABEL[draft.source.type] : null;

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
              style={{
                background: '#fff',
                borderRadius: 14,
                width: '100%',
                maxWidth: 760,
                ...props.style,
              }}
            />
          )}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pr: 1,
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Compass Calendar
              </Typography>
              <Typography variant="h3" sx={{ mt: 0.25 }}>
                {mode === 'edit' ? 'Edit Calendar Item' : 'Add New'}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ pb: 3 }}>
            {sourceLabel && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(94,184,168,0.12)',
                  border: '1px solid rgba(94,184,168,0.35)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  mb: 2.5,
                }}
              >
                <LinkOutlined sx={{ color: '#1f5147' }} fontSize="small" />
                <Typography variant="body2" sx={{ color: '#1f5147' }}>
                  {sourceLabel}:
                </Typography>
                <Chip
                  size="small"
                  label={draft.source.label}
                  sx={{ bgcolor: 'background.paper', fontWeight: 600 }}
                />
              </Box>
            )}

            <Stack spacing={2.5}>
              <TextField
                label="Title"
                value={draft.title}
                onChange={(e) => set({ title: e.target.value })}
                required
                fullWidth
                autoFocus
              />

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.75, display: 'block' }}>
                  Type
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={draft.subtype}
                  onChange={(_e, val) => val && set({ subtype: val })}
                  size="small"
                >
                  {SUBTYPE_ORDER.map((s) => {
                    const meta = SUBTYPE_META[s];
                    return (
                      <ToggleButton
                        key={s}
                        value={s}
                        sx={{
                          gap: 1,
                          px: 1.5,
                          '&.Mui-selected': {
                            bgcolor: meta.soft,
                            color: meta.fg,
                            borderColor: meta.dot,
                          },
                        }}
                      >
                        <Box
                          sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: meta.dot }}
                        />
                        {meta.label}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: 'text.secondary' }}>
                  {SUBTYPE_META[draft.subtype]?.description}
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <TextField
                  label="Starts"
                  type={draft.allDay ? 'date' : 'datetime-local'}
                  value={
                    draft.allDay
                      ? toLocalInput(draft.startsAt).slice(0, 10)
                      : toLocalInput(draft.startsAt)
                  }
                  onChange={(e) => set({ startsAt: fromLocalInput(e.target.value) })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Ends"
                  type={draft.allDay ? 'date' : 'datetime-local'}
                  value={
                    draft.allDay
                      ? toLocalInput(draft.endsAt).slice(0, 10)
                      : toLocalInput(draft.endsAt)
                  }
                  onChange={(e) => set({ endsAt: fromLocalInput(e.target.value) })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={draft.allDay}
                      onChange={(e) => set({ allDay: e.target.checked })}
                    />
                  }
                  label="All day"
                />
              </Box>

              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <TextField
                  select
                  label="Property / Department"
                  value={draft.propertyOrDepartment}
                  onChange={(e) => set({ propertyOrDepartment: e.target.value })}
                  fullWidth
                >
                  {PROPERTY_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Status"
                  value={draft.status}
                  onChange={(e) => set({ status: e.target.value })}
                  fullWidth
                >
                  {STATUS_ORDER.map((s) => (
                    <MenuItem key={s} value={s}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: STATUS_META[s].dot,
                          }}
                        />
                        {STATUS_META[s].label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                label="Short description"
                value={draft.description}
                onChange={(e) => set({ description: e.target.value })}
                multiline
                minRows={2}
                fullWidth
              />

              <Divider textAlign="left">
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  Why this matters (optional)
                </Typography>
              </Divider>

              <Accordion
                defaultExpanded={Boolean(
                  draft.whyItMatters || draft.whoItImpacts || draft.supportNeeded || draft.outcomeExpected,
                )}
                disableGutters
                sx={{
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px !important',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Add context
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      label="Why It Matters"
                      value={draft.whyItMatters}
                      onChange={(e) => set({ whyItMatters: e.target.value })}
                      multiline
                      minRows={2}
                      fullWidth
                    />
                    <TextField
                      label="Who It Impacts"
                      value={draft.whoItImpacts}
                      onChange={(e) => set({ whoItImpacts: e.target.value })}
                      multiline
                      minRows={2}
                      fullWidth
                    />
                    <TextField
                      label="Support Needed"
                      value={draft.supportNeeded}
                      onChange={(e) => set({ supportNeeded: e.target.value })}
                      multiline
                      minRows={2}
                      fullWidth
                    />
                    <TextField
                      label="Outcome Expected"
                      value={draft.outcomeExpected}
                      onChange={(e) => set({ outcomeExpected: e.target.value })}
                      multiline
                      minRows={2}
                      fullWidth
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} variant="text" color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary" disabled={!draft.title.trim()}>
              {mode === 'edit' ? 'Save changes' : 'Add to Calendar'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
