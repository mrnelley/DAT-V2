// Property-ops task tracker store.
// Seed data scrubbed for the executive scope demo. Token tables (category
// meta, status meta, urgency meta) remain so UI components render correctly
// against empty data.
//
// Tasks support an OPTIONAL propertyId — null means "portfolio-wide" work
// (vendor mgmt, staff, policy, etc.) that lives in the cross-portfolio stream.

import dayjs from 'dayjs';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const newId = () => `tsk_${Math.random().toString(36).slice(2, 9)}`;

export const TASK_CATEGORY = {
  COMPLIANCE: 'compliance',
  MAINTENANCE: 'maintenance',
  LEASING: 'leasing',
  CAPITAL: 'capital',
  RESIDENT_SERVICES: 'resident_services',
  REPORTING: 'reporting',
  VENDOR: 'vendor',
  STAFF: 'staff',
  POLICY: 'policy',
};

// AA-safe color tokens (per Section 508 sweep).
export const CATEGORY_META = {
  compliance:        { label: 'Compliance',         dot: '#a06a14', soft: 'rgba(241,172,73,0.22)', fg: '#8a5a14', fill: '#a06a14' },
  maintenance:       { label: 'Maintenance',        dot: '#a52a1f', soft: 'rgba(219,83,76,0.18)',  fg: '#8a2b27', fill: '#a52a1f' },
  leasing:           { label: 'Leasing',            dot: '#1a4a80', soft: 'rgba(26,74,128,0.14)',  fg: '#1a4a80', fill: '#1a4a80' },
  capital:           { label: 'Capital',            dot: '#041e42', soft: 'rgba(4,30,66,0.12)',    fg: '#041e42', fill: '#041e42' },
  resident_services: { label: 'Resident Services',  dot: '#2c6e63', soft: 'rgba(94,184,168,0.22)', fg: '#1f5147', fill: '#2c6e63' },
  reporting:         { label: 'Reporting',          dot: '#3f4a5c', soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c', fill: '#3f4a5c' },
  vendor:            { label: 'Vendor',             dot: '#5a4a8f', soft: 'rgba(90,74,143,0.16)',  fg: '#3e336b', fill: '#5a4a8f' },
  staff:             { label: 'Staff & Hiring',     dot: '#8a5a14', soft: 'rgba(138,90,20,0.16)',  fg: '#6b450f', fill: '#8a5a14' },
  policy:            { label: 'Policy',             dot: '#3f4a5c', soft: 'rgba(63,74,92,0.14)',   fg: '#1a1a2e', fill: '#3f4a5c' },
};

export const TASK_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  COMPLETE: 'complete',
};

export const STATUS_META = {
  open:        { label: 'Open',        soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c', dot: '#5a6475' },
  in_progress: { label: 'In progress', soft: 'rgba(7,44,94,0.1)',     fg: '#072c5e', dot: '#072c5e' },
  blocked:     { label: 'Blocked',     soft: 'rgba(219,83,76,0.18)',  fg: '#8a2b27', dot: '#a52a1f' },
  complete:    { label: 'Complete',    soft: 'rgba(0,110,92,0.14)',   fg: '#004d40', dot: '#006e5c' },
};

export const STATUS_CYCLE = ['open', 'in_progress', 'blocked', 'complete'];

export const TASK_URGENCY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const URGENCY_META = {
  high:   { label: 'High',   dot: '#a52a1f', soft: 'rgba(219,83,76,0.18)',  fg: '#8a2b27' },
  medium: { label: 'Medium', dot: '#a06a14', soft: 'rgba(241,172,73,0.22)', fg: '#8a5a14' },
  low:    { label: 'Low',    dot: '#5a6475', soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c' },
};

let DB = [];

export async function listTasks({ propertyId, propertyIdSet, includePortfolioWide = true, category, status } = {}) {
  await wait();
  return DB
    .filter((t) => {
      if (propertyId !== undefined) return t.propertyId === propertyId;
      if (propertyIdSet) {
        if (t.propertyId == null) return includePortfolioWide;
        return propertyIdSet.has(t.propertyId);
      }
      return true;
    })
    .filter((t) => (!category || t.category === category))
    .filter((t) => (!status || t.status === status))
    .map((t) => ({ ...t }));
}

export async function updateTask(id, patch) {
  await wait();
  let next = null;
  DB = DB.map((t) => {
    if (t.id !== id) return t;
    next = { ...t, ...patch };
    return next;
  });
  return next ? { ...next } : null;
}

export async function createTask(input) {
  await wait();
  const next = {
    id: newId(),
    propertyId: null,
    category: TASK_CATEGORY.MAINTENANCE,
    urgency: TASK_URGENCY.MEDIUM,
    status: TASK_STATUS.OPEN,
    daysOpen: 0,
    dueAt: dayjs().add(7, 'day').toISOString(),
    description: '',
    ...input,
  };
  DB = [next, ...DB];
  return { ...next };
}

export async function deleteTask(id) {
  await wait();
  DB = DB.filter((t) => t.id !== id);
  return { id };
}

// Property health based on its task load.
export function computeHealth(tasks) {
  const active = tasks.filter((t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'blocked');
  const high = active.filter((t) => t.urgency === 'high');
  const overdueHigh = high.filter((t) => new Date(t.dueAt).getTime() < Date.now());
  if (high.length >= 2 || overdueHigh.length >= 1) return 'critical';
  if (high.length >= 1 || active.length >= 5) return 'watch';
  if (active.length === 0) return 'idle';
  return 'healthy';
}

export const HEALTH_META = {
  healthy:  { label: 'Healthy',   dot: '#006e5c', soft: 'rgba(0,110,92,0.14)',   fg: '#004d40' },
  watch:    { label: 'Watch',     dot: '#a06a14', soft: 'rgba(241,172,73,0.22)', fg: '#8a5a14' },
  critical: { label: 'Critical',  dot: '#a52a1f', soft: 'rgba(219,83,76,0.18)',  fg: '#8a2b27' },
  idle:     { label: 'Idle',      dot: '#5a6475', soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c' },
};

export function summarize(tasks) {
  const active = tasks.filter((t) => t.status === 'open' || t.status === 'in_progress' || t.status === 'blocked');
  const high = active.filter((t) => t.urgency === 'high');
  const overdue = active.filter((t) => new Date(t.dueAt).getTime() < Date.now());
  const byCategory = active.reduce((acc, t) => { acc[t.category] = (acc[t.category] ?? 0) + 1; return acc; }, {});
  return {
    total: tasks.length,
    active: active.length,
    high: high.length,
    overdue: overdue.length,
    byCategory,
  };
}
