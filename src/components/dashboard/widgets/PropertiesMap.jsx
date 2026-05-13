// Jaime's flagship widget — the HDC MidAtlantic portfolio task tracker.
//
// Composition:
//   1. Portfolio stat tiles (active tasks, urgent, overdue, properties needing
//      attention)
//   2. Filters — by state (PA / DE / MD), management type (in-house / 3rd-party)
//   3. Map of all 16 properties; pins are color-coded by TASK HEALTH not the
//      property's static status. Click a pin → side panel for that property.
//   4. Side panel — property meta + this-property's tasks (status-cycling chip
//      on click).
//   5. Cross-portfolio task stream — the tasks that DON'T have a propertyId
//      (vendor, staff, policy, cross-property reporting). Property linkage is
//      a lens, not a requirement.
//   6. Triage queue — top urgent open tasks across the portfolio (mixed
//      property-tied + portfolio-wide; each row says where it lives).
import { useMemo, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import {
  Box, Card, Stack, Typography, Chip, Button, Divider, ToggleButtonGroup,
  ToggleButton, Tooltip, Skeleton, IconButton,
} from '@mui/material';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import HomeWorkOutlined from '@mui/icons-material/HomeWorkOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useProperties } from '../../../hooks/useProperties';
import { usePropertyTasks, useUpdateTask } from '../../../hooks/usePropertyTasks';
import { useChecklist, useChecklistStats } from '../../../hooks/useChecklists';
import ChecklistStatusChip from '../../checklists/ChecklistStatusChip';
import { Link as RouterLink } from 'react-router-dom';
import ChecklistOutlined from '@mui/icons-material/ChecklistOutlined';
import { currentQuarter, currentYear, TOTAL_ITEM_COUNT, countRated } from '../../../api/curbAppealChecklists';
import {
  CATEGORY_META, STATUS_META, STATUS_CYCLE, URGENCY_META,
  computeHealth, HEALTH_META, summarize,
} from '../../../api/propertyTasks';
import { MGMT_TYPE_LABEL, STATE_LABEL, PROPERTY_STATUS_LABEL, COORDS_CONFIDENCE } from '../../../api/properties';
import { formatRelative, formatDay } from '../../../utils/formatters';

// Build a colored DivIcon for the map pin. Avoids the Vite-Leaflet asset-path
// issue and gives us color coding by task health.
function buildIcon(color, label = '●') {
  return L.divIcon({
    className: 'hdc-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    html: `
      <div style="
        width:30px;height:30px;border-radius:50%;
        background:${color};
        border:3px solid white;
        box-shadow:0 2px 6px rgba(7,44,94,0.35);
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-weight:800;font-size:11px;
      ">${label}</div>
    `,
  });
}

const PIN_ICONS = {
  healthy:  buildIcon('#006e5c'),
  watch:    buildIcon('#a06a14'),
  critical: buildIcon('#a52a1f'),
  idle:     buildIcon('#5a6475', '○'),
};

function FitToMarkers({ coords }) {
  const map = useMap();
  if (coords.length > 0) {
    setTimeout(() => {
      try {
        map.fitBounds(coords, { padding: [40, 40], maxZoom: 9 });
        map.invalidateSize();
      } catch { /* no-op */ }
    }, 120);
  }
  return null;
}

// ---------------- portfolio tiles ----------------

function StatTile({ icon, label, headline, sub, accent, dimmed }) {
  return (
    <Box
      component={motion.div}
      whileHover={{ y: -2 }}
      sx={{
        p: 2, borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid', borderColor: 'divider',
        borderTop: `3px solid ${accent}`,
        opacity: dimmed ? 0.6 : 1,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        {icon}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      </Stack>
      <Typography variant="h2" sx={{ lineHeight: 1.1 }}>{headline}</Typography>
      {sub && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{sub}</Typography>}
    </Box>
  );
}

// ---------------- task row ----------------

function TaskRow({ task, propertyName, onCycleStatus, dense = false }) {
  const cat = CATEGORY_META[task.category] ?? CATEGORY_META.maintenance;
  const status = STATUS_META[task.status] ?? STATUS_META.open;
  const urg = URGENCY_META[task.urgency] ?? URGENCY_META.medium;
  const overdue = task.status !== 'complete' && new Date(task.dueAt).getTime() < Date.now();
  return (
    <Box
      component={motion.div}
      whileHover={{ x: 2 }}
      sx={{
        display: 'grid',
        gridTemplateColumns: dense
          ? { xs: '1fr', md: '40px 1fr 100px 120px 100px' }
          : { xs: '1fr', md: '40px 1fr 1fr 100px 120px' },
        alignItems: 'center', gap: 1.25,
        p: 1.25, borderRadius: 2,
        border: '1px solid', borderColor: 'divider',
        borderLeft: `4px solid ${urg.dot}`,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{
        width: 28, height: 28, borderRadius: '50%',
        bgcolor: cat.soft, color: cat.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 11,
      }}>
        {cat.label[0]}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{task.title}</Typography>
        {task.description && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {task.description}
          </Typography>
        )}
      </Box>
      {!dense && (
        <Stack direction="row" spacing={0.5} alignItems="center">
          {propertyName ? (
            <>
              <LocationOnOutlined sx={{ fontSize: 12, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {propertyName}
              </Typography>
            </>
          ) : (
            <Chip size="small" label="Portfolio-wide" sx={{ bgcolor: 'rgba(7,44,94,0.08)', color: 'primary.main', fontWeight: 700 }} />
          )}
        </Stack>
      )}
      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-start">
        <Chip size="small" label={cat.label} sx={{ bgcolor: cat.soft, color: cat.fg, fontWeight: 700 }} />
      </Stack>
      <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="flex-end">
        <Tooltip title="Cycle task status">
          <Chip
            size="small"
            label={status.label}
            onClick={(e) => { e.stopPropagation(); onCycleStatus?.(task); }}
            sx={{
              bgcolor: status.soft, color: status.fg,
              fontWeight: 700, cursor: 'pointer',
              '&:hover': { boxShadow: 1 },
            }}
          />
        </Tooltip>
        <Tooltip title={`${urg.label} urgency · due ${formatDay(task.dueAt)}`} arrow>
          <Stack direction="row" alignItems="center" spacing={0.25} sx={{ color: overdue ? '#8a2b27' : 'text.secondary' }}>
            <AccessTimeOutlined sx={{ fontSize: 12 }} />
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {overdue ? `${Math.abs(dayjs(task.dueAt).diff(dayjs(), 'day'))}d overdue` : formatRelative(task.dueAt)}
            </Typography>
          </Stack>
        </Tooltip>
      </Stack>
    </Box>
  );
}

// ---------------- selected-property panel ----------------

function PropertyPanel({ property, tasks, summary, onClose, onCycleStatus }) {
  const health = computeHealth(tasks);
  const healthMeta = HEALTH_META[health];
  const checklistQ = useChecklist({ propertyId: property.id, quarter: currentQuarter(), year: currentYear() });
  const checklist = checklistQ.data;
  const checklistCompleted = checklist ? countRated(checklist) : 0;
  const grouped = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return map;
  }, [tasks]);

  return (
    <Box sx={{ borderTop: `4px solid ${healthMeta.dot}`, p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Selected community</Typography>
          <Typography variant="h3">{property.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {property.address} · {STATE_LABEL[property.state]}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <Chip
            size="small"
            label={healthMeta.label}
            sx={{ bgcolor: healthMeta.soft, color: healthMeta.fg, fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1.5 }}>
        <Chip size="small" label={MGMT_TYPE_LABEL[property.managementType]} sx={{ bgcolor: 'rgba(7,44,94,0.08)', color: 'primary.main' }} />
        <Chip size="small" label={PROPERTY_STATUS_LABEL[property.status]} variant="outlined" />
        {property.units && <Chip size="small" label={`${property.units} units`} sx={{ bgcolor: 'rgba(94,184,168,0.18)', color: '#1f5147', fontWeight: 700 }} />}
        {property.yearOpened && <Chip size="small" label={`Opened ${property.yearOpened}`} variant="outlined" />}
        {property.coordsConfidence === COORDS_CONFIDENCE.LOW && (
          <Tooltip title="Coordinates are a placeholder. Verify address.">
            <Chip
              size="small"
              icon={<WarningAmberOutlined sx={{ fontSize: 14 }} />}
              label="Location flagged"
              sx={{ bgcolor: 'rgba(241,172,73,0.22)', color: '#8a5a14', fontWeight: 700 }}
            />
          </Tooltip>
        )}
      </Stack>

      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(3, 1fr)', mb: 2 }}>
        <Mini label="Active tasks" value={summary.active} />
        <Mini label="Urgent" value={summary.high} tone={summary.high > 0 ? 'high' : 'neutral'} />
        <Mini label="Overdue" value={summary.overdue} tone={summary.overdue > 0 ? 'high' : 'neutral'} />
      </Box>

      {/* Quarterly Curb Appeal Checklist */}
      {checklist && (
        <Box
          sx={{
            p: 1.25, mb: 2, borderRadius: 2,
            border: '1px solid', borderColor: 'divider',
            bgcolor: 'rgba(7,44,94,0.03)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <ChecklistOutlined sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="overline" sx={{ color: 'text.secondary', flex: 1 }}>
              Q{currentQuarter()} {currentYear()} Curb Appeal Checklist
            </Typography>
            <ChecklistStatusChip status={checklist.status} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
            {checklistCompleted} of {TOTAL_ITEM_COUNT} items rated
            {checklist.submittedBy ? ` · ${checklist.submittedBy.name}` : ''}
          </Typography>
          <Button
            component={RouterLink}
            to={`/checklists/curb-appeal/${property.id}`}
            size="small"
            variant="outlined"
            fullWidth
            startIcon={<ChecklistOutlined fontSize="small" />}
          >
            Open quarterly checklist
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        Tasks at this community
      </Typography>
      {tasks.length === 0 ? (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>None open. Nice.</Typography>
      ) : (
        Object.entries(grouped).map(([cat, list]) => {
          const meta = CATEGORY_META[cat] ?? CATEGORY_META.maintenance;
          return (
            <Box key={cat} sx={{ mb: 1.5 }}>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: meta.dot }} />
                <Typography variant="caption" sx={{ color: meta.fg, fontWeight: 700, textTransform: 'uppercase' }}>
                  {meta.label} · {list.length}
                </Typography>
              </Stack>
              <Stack spacing={0.75}>
                {list.map((t) => (
                  <TaskRow key={t.id} task={t} onCycleStatus={onCycleStatus} dense />
                ))}
              </Stack>
            </Box>
          );
        })
      )}

      {(property.fundingNotes || property.capitalImprovementNotes || property.federalRepresentative) && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Stack spacing={1}>
            {property.fundingNotes?.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Funding</Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.25 }}>
                  {property.fundingNotes.map((n) => <Chip key={n} size="small" label={n} variant="outlined" />)}
                </Stack>
              </Box>
            )}
            {property.capitalImprovementNotes?.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Capital improvements on file</Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.25 }}>
                  {property.capitalImprovementNotes.map((n) => <Chip key={n} size="small" label={n} sx={{ bgcolor: 'rgba(4,30,66,0.12)', color: '#041e42' }} />)}
                </Stack>
              </Box>
            )}
            {property.federalRepresentative && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                <strong>{property.congressionalDistrict}</strong> · {property.federalRepresentative}
              </Typography>
            )}
          </Stack>
        </>
      )}

      {onClose && (
        <Button onClick={onClose} variant="text" size="small" sx={{ mt: 1.5 }}>
          Clear selection
        </Button>
      )}
    </Box>
  );
}

function Mini({ label, value, tone }) {
  const accent = tone === 'high' ? { bg: 'rgba(219,83,76,0.08)', fg: '#8a2b27' } : { bg: 'transparent', fg: 'text.primary' };
  return (
    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: accent.bg, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{label}</Typography>
      <Typography variant="h4" sx={{ color: accent.fg }}>{value}</Typography>
    </Box>
  );
}

// ---------------- main ----------------

export default function PropertiesMap() {
  const propertiesQ = useProperties();
  const tasksQ = usePropertyTasks();
  const updateTask = useUpdateTask();
  const checklistStatsQ = useChecklistStats();

  const [stateFilter, setStateFilter] = useState('all');
  const [mgmtFilter, setMgmtFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const properties = propertiesQ.data ?? [];
  const tasks = tasksQ.data ?? [];

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => stateFilter === 'all' || p.state === stateFilter)
      .filter((p) => mgmtFilter === 'all' || p.managementType === mgmtFilter);
  }, [properties, stateFilter, mgmtFilter]);

  const visiblePropertyIds = useMemo(() => new Set(filteredProperties.map((p) => p.id)), [filteredProperties]);

  // Visible tasks = tasks tied to a visible property + all portfolio-wide tasks.
  const visibleTasks = useMemo(() =>
    tasks.filter((t) => t.propertyId == null || visiblePropertyIds.has(t.propertyId)),
  [tasks, visiblePropertyIds]);

  const propertyTied = visibleTasks.filter((t) => t.propertyId != null);
  const portfolioWide = visibleTasks.filter((t) => t.propertyId == null);
  const summary = summarize(visibleTasks);

  const tasksByProperty = useMemo(() => {
    const map = {};
    properties.forEach((p) => { map[p.id] = []; });
    tasks.forEach((t) => { if (t.propertyId) map[t.propertyId]?.push(t); });
    return map;
  }, [properties, tasks]);

  const healthCounts = useMemo(() => {
    const counts = { healthy: 0, watch: 0, critical: 0, idle: 0 };
    filteredProperties.forEach((p) => {
      const h = computeHealth(tasksByProperty[p.id] ?? []);
      counts[h] += 1;
    });
    return counts;
  }, [filteredProperties, tasksByProperty]);

  const selected = selectedId ? properties.find((p) => p.id === selectedId) : null;
  const selectedTasks = selected ? tasksByProperty[selected.id] ?? [] : [];
  const selectedSummary = summarize(selectedTasks);

  const handleCycle = (task) => {
    const idx = STATUS_CYCLE.indexOf(task.status);
    const nextStatus = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    updateTask.mutate({ id: task.id, patch: { status: nextStatus } });
  };

  const triageTop = useMemo(() => {
    const active = visibleTasks.filter((t) => t.status !== 'complete');
    const urgencyRank = { high: 0, medium: 1, low: 2 };
    return [...active]
      .sort((a, b) => {
        if (urgencyRank[a.urgency] !== urgencyRank[b.urgency]) {
          return urgencyRank[a.urgency] - urgencyRank[b.urgency];
        }
        return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
      })
      .slice(0, 8);
  }, [visibleTasks]);

  const center = useMemo(() => {
    if (filteredProperties.length === 0) return [39.5, -76.0];
    const lat = filteredProperties.reduce((s, p) => s + p.coords[0], 0) / filteredProperties.length;
    const lng = filteredProperties.reduce((s, p) => s + p.coords[1], 0) / filteredProperties.length;
    return [lat, lng];
  }, [filteredProperties]);

  if (propertiesQ.isLoading || tasksQ.isLoading) {
    return <Skeleton variant="rounded" height={520} />;
  }

  return (
    <Card sx={{ overflow: 'hidden' }}>
      {/* HEADER */}
      <Box sx={{ p: { xs: 2, md: 2.5 }, pb: 1.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={1.5}>
          <Box>
            <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Portfolio Task Tracker</Typography>
            <Typography variant="h3">
              HDC MidAtlantic · {properties.length} communities · {properties.reduce((s, p) => s + (p.units ?? 0), 0)} units
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Property linkage is a lens, not a requirement. Portfolio-wide work appears below the map.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, mt: 2 }}>
          <StatTile
            icon={<TaskAltOutlined sx={{ color: 'primary.main' }} />}
            label="Active tasks"
            headline={summary.active}
            sub={`${summary.total} total tracked`}
            accent="#072c5e"
          />
          <StatTile
            icon={<WarningAmberOutlined sx={{ color: '#8a2b27' }} />}
            label="High urgency"
            headline={summary.high}
            sub="across open + in-progress"
            accent="#a52a1f"
            dimmed={summary.high === 0}
          />
          <StatTile
            icon={<AccessTimeOutlined sx={{ color: '#8a5a14' }} />}
            label="Overdue"
            headline={summary.overdue}
            sub="past due date"
            accent="#a06a14"
            dimmed={summary.overdue === 0}
          />
          <StatTile
            icon={<HomeWorkOutlined sx={{ color: 'secondary.dark' }} />}
            label="Communities needing attention"
            headline={healthCounts.critical + healthCounts.watch}
            sub={`${healthCounts.critical} critical · ${healthCounts.watch} watch · ${healthCounts.healthy} healthy`}
            accent="#5eb8a8"
          />
        </Box>
      </Box>

      {/* FILTERS */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, pb: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <FilterListOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
        <ToggleButtonGroup exclusive size="small" value={stateFilter} onChange={(_e, v) => v && setStateFilter(v)}>
          <ToggleButton value="all">All states</ToggleButton>
          <ToggleButton value="PA">PA</ToggleButton>
          <ToggleButton value="DE">DE</ToggleButton>
          <ToggleButton value="MD">MD</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup exclusive size="small" value={mgmtFilter} onChange={(_e, v) => v && setMgmtFilter(v)}>
          <ToggleButton value="all">All mgmt</ToggleButton>
          <ToggleButton value="in_house">In-house</ToggleButton>
          <ToggleButton value="third_party">Third-party</ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={0.75}>
          <LegendDot color="#006e5c" label="Healthy" />
          <LegendDot color="#a06a14" label="Watch" />
          <LegendDot color="#a52a1f" label="Critical" />
          <LegendDot color="#5a6475" label="Idle" />
        </Stack>
      </Box>

      {/* MAP + SIDE PANEL */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, minHeight: 460 }}>
        <Box sx={{ position: 'relative', minHeight: 460, bgcolor: '#e8eef5' }}>
          <MapContainer
            center={center}
            zoom={8}
            style={{ height: '100%', width: '100%', minHeight: 460 }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitToMarkers coords={filteredProperties.map((p) => p.coords)} />
            {filteredProperties.map((p) => {
              const propertyTasks = tasksByProperty[p.id] ?? [];
              const health = computeHealth(propertyTasks);
              const summaryForProp = summarize(propertyTasks);
              return (
                <Marker
                  key={p.id}
                  position={p.coords}
                  icon={PIN_ICONS[health]}
                  eventHandlers={{ click: () => setSelectedId(p.id) }}
                >
                  <Popup>
                    <Box sx={{ minWidth: 220 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {p.city ? `${p.city}, ${p.state}` : STATE_LABEL[p.state]}
                      </Typography>
                      <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap' }}>
                        <Chip size="small" label={`${p.units ?? '?'} units`} />
                        <Chip
                          size="small"
                          label={`${summaryForProp.active} active`}
                          sx={{ bgcolor: HEALTH_META[health].soft, color: HEALTH_META[health].fg, fontWeight: 700 }}
                        />
                      </Stack>
                      <Button
                        size="small"
                        onClick={() => setSelectedId(p.id)}
                        sx={{ mt: 0.75, px: 0, minWidth: 'auto' }}
                        endIcon={<OpenInNewOutlined fontSize="small" />}
                      >
                        Open task tracker
                      </Button>
                    </Box>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </Box>

        <Box sx={{ borderLeft: { md: '1px solid' }, borderTop: { xs: '1px solid', md: 'none' }, borderColor: 'divider', display: 'flex', flexDirection: 'column', maxHeight: 600, overflowY: 'auto' }}>
          {!selected ? (
            <Box sx={{ p: 2.5 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>All communities ({filteredProperties.length})</Typography>
              <Typography variant="h4" sx={{ mb: 1.5 }}>Click a pin to drill in</Typography>
              <Stack spacing={0.75}>
                {filteredProperties.map((p) => {
                  const t = tasksByProperty[p.id] ?? [];
                  const health = computeHealth(t);
                  const m = HEALTH_META[health];
                  const s = summarize(t);
                  return (
                    <Box
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        p: 0.75, borderRadius: 1.5, cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(94,184,168,0.1)' },
                      }}
                    >
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: m.dot }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{p.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                          {p.city ? `${p.city}, ${p.state}` : STATE_LABEL[p.state]} · {p.units ?? '?'} units
                        </Typography>
                      </Box>
                      <Stack alignItems="flex-end">
                        <Chip size="small" label={`${s.active}`} sx={{ bgcolor: m.soft, color: m.fg, fontWeight: 700, minWidth: 32 }} />
                        {s.high > 0 && (
                          <Typography variant="caption" sx={{ color: '#8a2b27', fontWeight: 700, mt: 0.25 }}>
                            {s.high} urgent
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          ) : (
            <PropertyPanel
              property={selected}
              tasks={selectedTasks}
              summary={selectedSummary}
              onClose={() => setSelectedId(null)}
              onCycleStatus={handleCycle}
            />
          )}
        </Box>
      </Box>

      {/* CROSS-PORTFOLIO STREAM */}
      <Divider />
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <HomeWorkOutlined sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="h3">Cross-portfolio work</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Vendor management, staff, policy, training, and cross-property reporting — not tied to a single community.
            </Typography>
          </Box>
        </Stack>
        {portfolioWide.length === 0 ? (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>No portfolio-wide tasks open right now.</Typography>
        ) : (
          <Stack spacing={0.75}>
            {portfolioWide.map((t) => <TaskRow key={t.id} task={t} onCycleStatus={handleCycle} />)}
          </Stack>
        )}
      </Box>

      {/* QUARTERLY CURB APPEAL BANNER */}
      <Divider />
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
          sx={{
            p: 2, borderRadius: 2,
            bgcolor: 'rgba(7,44,94,0.04)',
            border: '1px solid', borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ChecklistOutlined sx={{ color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
                Compass Quarterly Commitment
              </Typography>
              <Typography variant="h3">Curb Appeal Checklists · Q{currentQuarter()} {currentYear()}</Typography>
              {checklistStatsQ.data && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {checklistStatsQ.data.approved ?? 0} approved · {checklistStatsQ.data.submitted ?? 0} awaiting your review · {checklistStatsQ.data.returned ?? 0} returned · {(checklistStatsQ.data.draft ?? 0) + (checklistStatsQ.data.not_started ?? 0)} not yet submitted
                </Typography>
              )}
            </Box>
          </Stack>
          <Button
            component={RouterLink}
            to="/checklists/curb-appeal"
            variant="contained"
            color="primary"
            endIcon={<OpenInNewOutlined fontSize="small" />}
          >
            Open review hub
          </Button>
        </Stack>
      </Box>

      {/* TRIAGE QUEUE */}
      <Divider />
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <WarningAmberOutlined sx={{ color: '#8a2b27' }} />
          <Box>
            <Typography variant="h3">Triage queue</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Top open tasks by urgency, then due date. Property-tied + portfolio-wide together.
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={0.75}>
          {triageTop.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              propertyName={t.propertyId ? properties.find((p) => p.id === t.propertyId)?.name : null}
              onCycleStatus={handleCycle}
            />
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

function LegendDot({ color, label }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
    </Stack>
  );
}
