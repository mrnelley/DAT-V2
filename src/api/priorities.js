// In-memory store for Priorities.
// Seed data scrubbed for the executive scope demo — empty until ops use it
// (or until Supabase persistence is wired). Shape + CRUD remain so every
// downstream view (PriorityRow, EditPriorityPanel, cockpits, etc.) renders.
import dayjs from 'dayjs';

const wait = (ms = 100) => new Promise((r) => setTimeout(r, ms));
const newId = () => `pri_${Math.random().toString(36).slice(2, 9)}`;

export const MEASUREMENT = {
  NUMBER: 'number',
  TASK: 'task',
  ROLLUP: 'rollup',
};

export const PRIORITY_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OFF_TRACK: 'off_track',
};

export const TIME_SCOPE = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
};

export const TIME_SCOPE_LABEL = {
  week: 'This week',
  month: 'This month',
  quarter: 'This quarter',
};

// Used by createPriority for a fresh row's default heatmap.
function buildHeatmap(pattern = Array(13).fill('no_data')) {
  const today = dayjs();
  return pattern.map((status, idx) => ({
    week: pattern.length - idx,
    weekStart: today.subtract(pattern.length - 1 - idx, 'week').startOf('week').format('YYYY-MM-DD'),
    status,
  }));
}

let DB = [];

export async function listPriorities() {
  await wait();
  return DB.map((p) => ({ ...p, heatmap: [...p.heatmap] }));
}

export async function updatePriority(id, patch) {
  await wait();
  let updated = null;
  DB = DB.map((p) => {
    if (p.id !== id) return p;
    updated = { ...p, ...patch };
    return updated;
  });
  if (!updated) throw new Error(`Priority ${id} not found`);
  return { ...updated };
}

export async function createPriority(input) {
  await wait();
  const next = {
    id: newId(),
    isCompany: false,
    isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 0,
    current: 0,
    target: 100,
    unit: '%',
    status: PRIORITY_STATUS.ON_TRACK,
    heatmap: buildHeatmap(),
    propertyId: null,
    workplanId: null,
    initiativeId: null,
    timeScope: TIME_SCOPE.WEEK,
    ...input,
  };
  DB = [next, ...DB];
  return { ...next };
}

export async function deletePriority(id) {
  await wait();
  DB = DB.filter((p) => p.id !== id);
  return { id };
}

export const calculatePercent = (priority) => {
  const { start = 0, current = 0, target = 0 } = priority;
  if (target === start) return current >= target ? 100 : 0;
  const pct = ((current - start) / (target - start)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
};
