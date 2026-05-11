// In-memory mock API for Priorities.
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

// Build a 13-week heatmap leading up to today (current date 2026-05-11).
function buildHeatmap(pattern) {
  const today = dayjs();
  return pattern.map((status, idx) => ({
    week: pattern.length - idx,
    weekStart: today.subtract(pattern.length - 1 - idx, 'week').startOf('week').format('YYYY-MM-DD'),
    status,
  }));
}

const STUB_OWNERS = {
  parnell: { id: 'stub-user', name: 'Parnell Kelley', initials: 'PK' },
  marisol: { id: 'mc', name: 'Marisol Chen', initials: 'MC' },
  devon:   { id: 'dp', name: 'Devon Park', initials: 'DP' },
  yara:    { id: 'yo', name: 'Yara Osei', initials: 'YO' },
  sam:     { id: 'sw', name: 'Sam Whitaker', initials: 'SW' },
};

let DB = [
  {
    id: 'pri_001',
    title: 'Increase Resident Renewal Rate to 92%',
    context:
      'Renewals are the cheapest, highest-quality source of stable occupancy. Each percentage point ~= $180k annualized.',
    owner: STUB_OWNERS.devon,
    teamId: 'dept_property_mgmt',
    isCompany: true,
    isMine: false,
    measurement: MEASUREMENT.NUMBER,
    start: 87,
    current: 89.4,
    target: 92,
    unit: '%',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(40, 'day').toISOString(),
    heatmap: buildHeatmap([
      'on', 'on', 'on', 'on', 'on', 'on', 'on', 'on',
      'at', 'on', 'at', 'on', 'at',
    ].map((s) => ({ on: 'on_track', at: 'at_risk', off: 'off_track', nd: 'no_data' }[s]))),
  },
  {
    id: 'pri_002',
    title: 'Close Q2 Financials by July 15',
    context: 'A clean monthly close enables the board report and unlocks Q3 capex commitments.',
    owner: STUB_OWNERS.parnell,
    teamId: 'dept_finance',
    isCompany: true,
    isMine: true,
    measurement: MEASUREMENT.TASK,
    start: 0,
    current: 7,
    target: 12,
    unit: ' tasks',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(65, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['nd','nd','nd','nd','nd','nd','nd','nd','on','on','on','on','on'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
  {
    id: 'pri_003',
    title: 'Lakeside Roof Phase 1 Complete',
    context:
      'Buildings A and B replaced before hurricane season. Multi-vendor sequencing is the risk.',
    owner: STUB_OWNERS.sam,
    teamId: 'prop_lakeside',
    isCompany: true,
    isMine: false,
    measurement: MEASUREMENT.ROLLUP,
    start: 0,
    current: 38,
    target: 100,
    unit: '%',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(52, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['nd','nd','on','on','on','at','at','on','on','at','at','at','at'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
  {
    id: 'pri_004',
    title: 'Pass HUD Audit Clean',
    context: 'Zero deficiencies in this submission. Anything else jeopardizes the FY27 voucher allocation.',
    owner: STUB_OWNERS.marisol,
    teamId: 'dept_compliance',
    isCompany: true,
    isMine: false,
    measurement: MEASUREMENT.TASK,
    start: 0,
    current: 14,
    target: 18,
    unit: ' items',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(11, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['on','on','on','on','on','at','at','at','off','at','at','at','at'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
  {
    id: 'pri_005',
    title: 'Reduce Average Maintenance Ticket Age to <4 Days',
    context: 'Resident satisfaction signal #1. Currently 6.2 days; staffing model is the lever.',
    owner: STUB_OWNERS.yara,
    teamId: 'dept_resident_services',
    isCompany: false,
    isMine: false,
    measurement: MEASUREMENT.NUMBER,
    start: 6.8,
    current: 5.4,
    target: 4,
    unit: ' days',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(75, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['off','off','at','at','at','at','on','on','on','on','on','on','on'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
  {
    id: 'pri_006',
    title: 'Onboard 14 Riverbend Move-Ins With Zero Day-One Tickets',
    context: 'First impression matters. Tracking process from key audit through 72 hours post move-in.',
    owner: STUB_OWNERS.yara,
    teamId: 'prop_riverbend',
    isCompany: false,
    isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 0,
    current: 14,
    target: 14,
    unit: ' households',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(8, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['nd','nd','nd','nd','nd','nd','nd','nd','nd','nd','nd','on','on'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
];

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
    heatmap: buildHeatmap(Array(13).fill('no_data')),
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
