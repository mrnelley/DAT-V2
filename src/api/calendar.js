// In-memory mock API for the Compass Calendar.
// Replace each function with a real network call when the backend ships;
// the rest of the app talks to this module, not the network.

import dayjs from 'dayjs';
import { SUBTYPE, STATUS, SCOPE, APPROVAL_STATUS } from '../utils/calendarTokens';

const wait = (ms = 120) => new Promise((r) => setTimeout(r, ms));

const newId = () => `cal_${Math.random().toString(36).slice(2, 10)}`;

const STUB_OWNER = {
  id: 'stub-user',
  name: 'Parnell Kelley',
  initials: 'PK',
};

const today = dayjs();
const at = (offsetDays, hour = 9) =>
  today.add(offsetDays, 'day').hour(hour).minute(0).second(0).toISOString();
const span = (offsetDays, startHour, endHour) => ({
  startsAt: at(offsetDays, startHour),
  endsAt: at(offsetDays, endHour),
});

// Seeded data spans roughly +/-30 days from today (2026-05-11 per system date).
let DB = [
  {
    id: newId(),
    title: 'HUD Annual Audit Submission',
    description: 'Final submission of the HUD compliance package.',
    ...span(11, 9, 17),
    allDay: false,
    subtype: SUBTYPE.COMMITMENT,
    status: STATUS.NEEDS_ATTENTION,
    scope: SCOPE.ORG,
    approvalStatus: null,
    owner: { ...STUB_OWNER, name: 'Marisol Chen' },
    propertyOrDepartment: 'dept_compliance',
    whyItMatters:
      'Failure to submit on time triggers a federal review and risks our voucher allocation for FY27.',
    whoItImpacts: 'All residents under voucher programs across all properties.',
    supportNeeded: 'Finance team final sign-off; IT backups of last 3 years of records.',
    outcomeExpected: 'Submission accepted on first review — zero deficiencies.',
    source: { type: 'priority', id: 'pri_004', label: 'Pass HUD Audit Clean' },
  },
  {
    id: newId(),
    title: 'Resident Summer Cookout — North Park',
    description: 'Annual community appreciation event.',
    ...span(18, 16, 20),
    allDay: false,
    subtype: SUBTYPE.TOUCHPOINT,
    status: STATUS.ON_COURSE,
    scope: SCOPE.ORG,
    approvalStatus: null,
    owner: { ...STUB_OWNER, name: 'Devon Park', initials: 'DP' },
    propertyOrDepartment: 'prop_north_park',
    whyItMatters:
      'Builds resident trust and direct-line feedback for property mgmt. Drives renewal rate.',
    whoItImpacts: 'All North Park residents and families.',
    supportNeeded: 'Catering vendor confirmation; volunteer staff coverage.',
    outcomeExpected: '120+ residents engaged; renewal-intent survey responses collected.',
    source: null,
  },
  {
    id: newId(),
    title: 'Lakeside Roof Replacement Kickoff',
    description: 'Day one of the multi-phase roof replacement at Lakeside Commons.',
    ...span(3, 7, 17),
    allDay: false,
    subtype: SUBTYPE.WAYPOINT,
    status: STATUS.ON_COURSE,
    scope: SCOPE.ORG,
    approvalStatus: null,
    owner: { ...STUB_OWNER, name: 'Sam Whitaker', initials: 'SW' },
    propertyOrDepartment: 'prop_lakeside',
    whyItMatters: 'Long-deferred capex; finishing before hurricane season is non-negotiable.',
    whoItImpacts: '64 Lakeside units — noise + access disruption for ~6 weeks.',
    supportNeeded: 'Resident comms 2 weeks out; daily progress photos.',
    outcomeExpected: 'Phase 1 (buildings A/B) complete by end of June.',
    source: { type: 'initiative', id: 'init_002', label: 'Capex Catch-Up FY26' },
  },
  {
    id: newId(),
    title: 'Q3 OKR Planning Session',
    description: 'Leadership offsite — review Q2 priorities, set Q3.',
    ...span(28, 9, 16),
    allDay: false,
    subtype: SUBTYPE.WAYPOINT,
    status: STATUS.ON_COURSE,
    scope: SCOPE.ORG,
    approvalStatus: null,
    owner: STUB_OWNER,
    propertyOrDepartment: 'org_wide',
    whyItMatters: 'Sets the operating cadence for the quarter; every department aligns off this.',
    whoItImpacts: 'All department heads + their teams downstream.',
    supportNeeded: 'Pre-reads from each VP submitted 1 week prior.',
    outcomeExpected: 'Q3 priorities locked, owners named, gauges configured.',
    source: null,
  },
  {
    id: newId(),
    title: 'Riverbend Move-In Day Surge',
    description: '14 new leases starting same day — coordinated move-in support.',
    ...span(7, 8, 18),
    allDay: false,
    subtype: SUBTYPE.MARKER,
    status: STATUS.NEEDS_ATTENTION,
    scope: SCOPE.ORG,
    approvalStatus: null,
    owner: { ...STUB_OWNER, name: 'Yara Osei', initials: 'YO' },
    propertyOrDepartment: 'prop_riverbend',
    whyItMatters: 'First impression for 14 households; logistics complexity is real.',
    whoItImpacts: '14 incoming households + on-site staff.',
    supportNeeded: 'Welcome packets printed; key audit done day before.',
    outcomeExpected: 'Every household keyed in by 4pm; zero day-one maintenance tickets.',
    source: null,
  },
  {
    id: newId(),
    title: 'Quarterly Board Report Draft Due',
    description: 'Draft circulated to Marisol + CFO for review.',
    ...span(14, 17, 18),
    allDay: false,
    subtype: SUBTYPE.COMMITMENT,
    status: STATUS.ON_COURSE,
    scope: SCOPE.ORG,
    approvalStatus: null,
    owner: STUB_OWNER,
    propertyOrDepartment: 'dept_finance',
    whyItMatters: 'Board meets 5 days later; late draft means rushed review.',
    whoItImpacts: 'Board members; downstream investor narrative.',
    supportNeeded: 'Finance close completed by day -2.',
    outcomeExpected: 'Draft circulated with 0 placeholders.',
    source: { type: 'priority', id: 'pri_002', label: 'Q2 Financial Close' },
  },
  {
    id: newId(),
    title: 'Oak Grove Town Hall',
    description: 'Quarterly resident town hall, with property mgmt + leadership.',
    ...span(-4, 18, 20),
    allDay: false,
    subtype: SUBTYPE.TOUCHPOINT,
    status: STATUS.COMPLETED,
    scope: SCOPE.ORG,
    approvalStatus: null,
    owner: { ...STUB_OWNER, name: 'Devon Park', initials: 'DP' },
    propertyOrDepartment: 'prop_oakgrove',
    whyItMatters: 'Direct resident feedback channel before the renewal cycle.',
    whoItImpacts: 'All Oak Grove residents.',
    supportNeeded: 'Translator (Spanish) on site.',
    outcomeExpected: 'Surfacing the top 3 maintenance complaints.',
    source: null,
  },
  {
    id: newId(),
    title: 'Compliance Training Window Closes',
    description: 'Final day for staff to complete annual Fair Housing training.',
    ...span(21, 0, 23),
    allDay: true,
    subtype: SUBTYPE.COMMITMENT,
    status: STATUS.OFF_COURSE,
    scope: SCOPE.ORG,
    approvalStatus: null,
    owner: { ...STUB_OWNER, name: 'Marisol Chen', initials: 'MC' },
    propertyOrDepartment: 'dept_compliance',
    whyItMatters: 'Required by HUD; non-compliant staff cannot interact with residents.',
    whoItImpacts: 'All staff (47 individuals).',
    supportNeeded: 'HR reminders; manager escalation on day -3.',
    outcomeExpected: '100% completion by deadline.',
    source: null,
  },

  // --- Personal items (private to stub user) ---
  {
    id: newId(),
    title: 'Block to draft my Q3 priorities',
    description: 'Personal focus block.',
    ...span(2, 14, 16),
    allDay: false,
    subtype: SUBTYPE.MARKER,
    status: STATUS.ON_COURSE,
    scope: SCOPE.PERSONAL,
    approvalStatus: null,
    owner: STUB_OWNER,
    propertyOrDepartment: 'org_wide',
    whyItMatters: 'Deep work to set the quarter up well.',
    whoItImpacts: 'Me + my team next quarter.',
    supportNeeded: '',
    outcomeExpected: '3 draft Q3 priorities with measurable targets.',
    source: null,
  },
  {
    id: newId(),
    title: '1:1 with Marisol',
    description: 'Bi-weekly 1:1.',
    ...span(1, 11, 12),
    allDay: false,
    subtype: SUBTYPE.TOUCHPOINT,
    status: STATUS.ON_COURSE,
    scope: SCOPE.PERSONAL,
    approvalStatus: null,
    owner: STUB_OWNER,
    propertyOrDepartment: 'dept_operations',
    whyItMatters: 'Career + workload check-in.',
    whoItImpacts: 'Me + manager.',
    supportNeeded: '',
    outcomeExpected: 'Agenda items resolved or scheduled.',
    source: null,
  },
  {
    id: newId(),
    title: 'Property leadership lunch (proposing for org calendar)',
    description: 'Quarterly cross-property leadership lunch — wants org visibility.',
    ...span(9, 12, 14),
    allDay: false,
    subtype: SUBTYPE.TOUCHPOINT,
    status: STATUS.ON_COURSE,
    scope: SCOPE.PERSONAL,
    approvalStatus: APPROVAL_STATUS.PENDING,
    owner: STUB_OWNER,
    propertyOrDepartment: 'org_wide',
    whyItMatters: 'Cross-property leadership knows each other; sharper coordination.',
    whoItImpacts: 'Property managers org-wide.',
    supportNeeded: 'Lunch budget approval.',
    outcomeExpected: '8 of 8 property leads attending.',
    source: null,
  },
];

// ---------- public API ----------

export async function listOrgItems({ from, to } = {}) {
  await wait();
  return DB
    .filter((i) => i.scope === SCOPE.ORG)
    .filter((i) => filterByRange(i, from, to))
    .map(cloneItem);
}

export async function listPendingOrgItems({ from, to } = {}) {
  await wait();
  return DB
    .filter(
      (i) => i.scope === SCOPE.PERSONAL && i.approvalStatus === APPROVAL_STATUS.PENDING,
    )
    .filter((i) => filterByRange(i, from, to))
    .map(cloneItem);
}

export async function listPersonalItems(userId, { from, to } = {}) {
  await wait();
  return DB
    .filter((i) => i.scope === SCOPE.PERSONAL && i.owner?.id === userId)
    .filter((i) => filterByRange(i, from, to))
    .map(cloneItem);
}

export async function createItem(input) {
  await wait();
  const next = {
    id: newId(),
    allDay: false,
    status: STATUS.ON_COURSE,
    subtype: SUBTYPE.WAYPOINT,
    scope: SCOPE.PERSONAL,
    approvalStatus: null,
    owner: input.owner ?? STUB_OWNER,
    source: input.source ?? null,
    description: '',
    whyItMatters: '',
    whoItImpacts: '',
    supportNeeded: '',
    outcomeExpected: '',
    propertyOrDepartment: 'org_wide',
    ...input,
  };
  DB = [...DB, next];
  return cloneItem(next);
}

export async function updateItem(id, patch) {
  await wait();
  let updated = null;
  DB = DB.map((i) => {
    if (i.id !== id) return i;
    updated = { ...i, ...patch };
    return updated;
  });
  if (!updated) throw new Error(`Calendar item ${id} not found`);
  return cloneItem(updated);
}

export async function deleteItem(id) {
  await wait();
  DB = DB.filter((i) => i.id !== id);
  return { id };
}

export async function submitToOrg(id) {
  return updateItem(id, { approvalStatus: APPROVAL_STATUS.PENDING });
}

export async function approveItem(id, approverId) {
  return updateItem(id, {
    scope: SCOPE.ORG,
    approvalStatus: null,
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
  });
}

export async function rejectItem(id, { reason, rejecterId } = {}) {
  return updateItem(id, {
    approvalStatus: APPROVAL_STATUS.REJECTED,
    rejectionReason: reason ?? null,
    rejectedBy: rejecterId,
    rejectedAt: new Date().toISOString(),
  });
}

// ---------- helpers ----------

function cloneItem(item) {
  return JSON.parse(JSON.stringify(item));
}

function filterByRange(item, from, to) {
  if (!from && !to) return true;
  const start = dayjs(item.startsAt);
  if (from && start.isBefore(dayjs(from))) return false;
  if (to && start.isAfter(dayjs(to))) return false;
  return true;
}
