// The endpoint the Teams Adaptive Card "Open Checklist" button hits.
// Renders a 13-section / 38-item form for a specific property + quarter.
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, Stack, Typography, Chip, Button, TextField, ToggleButtonGroup,
  ToggleButton, Accordion, AccordionSummary, AccordionDetails, LinearProgress,
  Skeleton, IconButton, Divider, Breadcrumbs, Link,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import PageWrapper from '../layout/PageWrapper';
import UserAvatar from '../shared/UserAvatar';
import ChecklistStatusChip from './ChecklistStatusChip';
import {
  TEMPLATE, RATING, RATING_LABEL, RATING_META, STATUS, ratingKey, countRated,
  TOTAL_ITEM_COUNT, currentQuarter, currentYear,
} from '../../api/curbAppealChecklists';
import { useProperty } from '../../hooks/useProperties';
import { useChecklist, useSaveDraft, useSubmitChecklist } from '../../hooks/useChecklists';
import useSnackbar from '../shared/GlobalSnackbar';
import useAuth from '../../hooks/useAuth';
import { STATE_LABEL } from '../../api/properties';

function ItemRow({ sectionId, item, value, onChange, locked }) {
  const rating = value?.rating ?? null;
  const meta = rating ? RATING_META[rating] : null;
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: meta ? meta.dot : 'divider',
        bgcolor: meta ? meta.soft : 'background.paper',
        transition: 'background 120ms ease',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        {item.label}
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ md: 'flex-start' }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={rating}
          onChange={(_e, v) => v && onChange(sectionId, item.id, { rating: v })}
          disabled={locked}
          sx={{ flexShrink: 0 }}
        >
          {Object.entries(RATING_LABEL).map(([k, label]) => {
            const m = RATING_META[k];
            return (
              <ToggleButton
                key={k}
                value={k}
                sx={{
                  px: 1.5,
                  '&.Mui-selected': { bgcolor: m.dot, color: 'common.white', borderColor: m.dot },
                  '&.Mui-selected:hover': { bgcolor: m.dot, opacity: 0.9 },
                }}
              >
                {label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        <TextField
          size="small"
          placeholder="Comments"
          value={value?.comments ?? ''}
          onChange={(e) => onChange(sectionId, item.id, { comments: e.target.value })}
          fullWidth
          disabled={locked}
        />
        {rating === RATING.NEEDS_CORRECTION && (
          <TextField
            size="small"
            type="date"
            label="Date of correction"
            value={value?.dateOfCorrection ?? ''}
            onChange={(e) => onChange(sectionId, item.id, { dateOfCorrection: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180 }}
            disabled={locked}
          />
        )}
      </Stack>
    </Box>
  );
}

function SectionBlock({ section, ratings, onChange, locked }) {
  const sectionRatings = section.items.filter((i) => ratings[ratingKey(section.id, i.id)]).length;
  const sectionPct = (sectionRatings / section.items.length) * 100;
  const complete = sectionRatings === section.items.length;

  return (
    <Accordion
      defaultExpanded
      disableGutters
      sx={{
        '&:before': { display: 'none' },
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px !important',
        mb: 1.5,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ flex: 1 }}>
          {complete && <CheckCircleOutlined fontSize="small" sx={{ color: '#006e5c' }} />}
          <Typography variant="h4" sx={{ flex: 1 }}>{section.label}</Typography>
          <Typography variant="caption" sx={{ color: complete ? '#004d40' : 'text.secondary', fontWeight: 700 }}>
            {sectionRatings} / {section.items.length}
          </Typography>
          <Box sx={{ width: 80 }}>
            <LinearProgress
              variant="determinate"
              value={sectionPct}
              sx={{
                height: 4, borderRadius: 2,
                bgcolor: 'rgba(7,44,94,0.06)',
                '& .MuiLinearProgress-bar': { bgcolor: complete ? '#006e5c' : 'primary.main' },
              }}
            />
          </Box>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          {section.items.map((item) => (
            <ItemRow
              key={item.id}
              sectionId={section.id}
              item={item}
              value={ratings[ratingKey(section.id, item.id)]}
              onChange={onChange}
              locked={locked}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default function CurbAppealChecklistPage() {
  const { propertyId } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const snackbar = useSnackbar();

  const quarter = Number(search.get('quarter')) || currentQuarter();
  const year = Number(search.get('year')) || currentYear();

  const propertyQ = useProperty(propertyId);
  const checklistQ = useChecklist({ propertyId, quarter, year });
  const saveDraft = useSaveDraft();
  const submitChecklist = useSubmitChecklist();

  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (checklistQ.data) {
      setRatings(checklistQ.data.ratings ?? {});
    }
  }, [checklistQ.data]);

  const completedCount = useMemo(() => countRated({ ratings }), [ratings]);
  const pct = (completedCount / TOTAL_ITEM_COUNT) * 100;
  const allComplete = completedCount === TOTAL_ITEM_COUNT;

  const sub = checklistQ.data;
  const property = propertyQ.data;

  const locked = sub?.status === STATUS.SUBMITTED || sub?.status === STATUS.APPROVED;

  const handleChange = (sectionId, itemId, patch) => {
    setRatings((prev) => {
      const k = ratingKey(sectionId, itemId);
      const existing = prev[k] ?? { rating: null, comments: '', dateOfCorrection: null };
      return { ...prev, [k]: { ...existing, ...patch } };
    });
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft.mutateAsync({
        propertyId, quarter, year,
        ratings,
        submittedBy: { id: user.id, name: user.name },
      });
      snackbar.success('Draft saved.');
    } catch {
      snackbar.error('Could not save draft.');
    }
  };

  const handleSubmit = async () => {
    if (!allComplete) {
      snackbar.warning(`Rate all ${TOTAL_ITEM_COUNT} items before submitting.`);
      return;
    }
    try {
      await submitChecklist.mutateAsync({
        propertyId, quarter, year,
        ratings,
        submittedBy: { id: user.id, name: user.name },
      });
      snackbar.success(`Submitted to ${sub?.reviewer?.name ?? 'reviewer'} for approval.`);
      navigate('/checklists/curb-appeal');
    } catch {
      snackbar.error('Could not submit checklist.');
    }
  };

  if (propertyQ.isLoading || checklistQ.isLoading) {
    return (
      <PageWrapper>
        <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={400} />
      </PageWrapper>
    );
  }

  if (!property) {
    return (
      <PageWrapper>
        <Typography variant="h3">Property not found.</Typography>
        <Button onClick={() => navigate('/checklists/curb-appeal')}>← Back to Checklists</Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <Link component={RouterLink} to="/checklists/curb-appeal" underline="hover" color="text.secondary">
          Curb Appeal Checklists
        </Link>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {property.name}
        </Typography>
      </Breadcrumbs>

      {/* HEADER */}
      <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-start' }} spacing={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="overline" sx={{ color: '#072c5e', fontWeight: 700 }}>
                Compass Quarterly Commitment
              </Typography>
            </Stack>
            <Typography variant="h1">Curb Appeal Checklist</Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
              <LocationOnOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {property.name}{property.city ? ` · ${property.city}, ${property.state}` : ` · ${STATE_LABEL[property.state]}`}
              </Typography>
            </Stack>
          </Box>
          <Stack spacing={1} alignItems={{ md: 'flex-end' }}>
            <ChecklistStatusChip status={sub?.status ?? STATUS.NOT_STARTED} />
            {sub?.submittedAt && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Submitted {dayjs(sub.submittedAt).format('MMM D, YYYY')}
              </Typography>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
          <Meta label="Property" value={property.name} />
          <Meta label="Quarter" value={`Q${quarter} ${year}`} />
          <Meta label="Due Date" value={`${dayjs().month((quarter * 3) - 1).endOf('month').format('MMM D, YYYY')}`} />
          <Meta label="Reviewer" value={sub?.reviewer?.name ?? 'Jaime Shillady'} />
        </Box>

        {sub?.reviewerNote && sub?.status === STATUS.RETURNED && (
          <Box
            sx={{
              mt: 2, p: 1.5, borderRadius: 2,
              bgcolor: 'rgba(219,83,76,0.08)',
              border: '1px solid rgba(219,83,76,0.25)',
            }}
          >
            <Typography variant="caption" sx={{ color: '#8a2b27', fontWeight: 700, display: 'block', mb: 0.5 }}>
              Returned by reviewer — please refile
            </Typography>
            <Typography variant="body2">{sub.reviewerNote}</Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Completion
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: allComplete ? '#004d40' : 'primary.main' }}>
              {completedCount} / {TOTAL_ITEM_COUNT} items
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 10, borderRadius: 5,
              bgcolor: 'rgba(7,44,94,0.06)',
              '& .MuiLinearProgress-bar': { bgcolor: allComplete ? '#006e5c' : 'primary.main' },
            }}
          />
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2, fontStyle: 'italic' }}>
          A well-maintained and appealing exterior not only attracts potential residents but also helps retain existing ones. Regular upkeep and attention to detail go a long way in creating a positive living environment and a strong sense of community.
        </Typography>
      </Card>

      {/* FORM SECTIONS */}
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
      >
        {TEMPLATE.sections.map((section) => (
          <motion.div
            key={section.id}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          >
            <SectionBlock section={section} ratings={ratings} onChange={handleChange} locked={locked} />
          </motion.div>
        ))}
      </Box>

      {/* ACTIONS */}
      <Card sx={{ p: 2, position: 'sticky', bottom: 16, mt: 2, boxShadow: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {sub?.submittedBy && (
              <>
                <UserAvatar user={sub.submittedBy} size="sm" />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Last touched by {sub.submittedBy.name}
                </Typography>
              </>
            )}
          </Stack>
          <Stack direction="row" spacing={1}>
            {!locked && (
              <Button variant="outlined" startIcon={<SaveOutlined />} onClick={handleSaveDraft} disabled={saveDraft.isPending}>
                Save Draft
              </Button>
            )}
            {!locked && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<SendOutlined />}
                onClick={handleSubmit}
                disabled={!allComplete || submitChecklist.isPending}
              >
                Submit to {sub?.reviewer?.name?.split(' ')[0] ?? 'reviewer'}
              </Button>
            )}
            {locked && (
              <Button variant="text" onClick={() => navigate('/checklists/curb-appeal')}>
                Back to checklists
              </Button>
            )}
          </Stack>
        </Stack>
      </Card>
    </PageWrapper>
  );
}

function Meta({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}
