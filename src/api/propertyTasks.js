// Property-ops task tracker — Jaime's workstream.
//
// Tasks can be optionally tied to a property via `propertyId`. Many tasks
// are property-specific (a unit turnover, a roof project, a recert packet);
// others are PORTFOLIO-WIDE (vendor management, staff training, policy updates,
// cross-property reporting). Both kinds live in the same model and surface
// together in Jaime's triage queue, but the map only renders the property-tied
// ones.

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

// AA-safe color tokens for each category (per Section 508 sweep).
//   dot   = decorative rail / icon (≥3:1 vs white per SC 1.4.11)
//   soft  = chip background tint
//   fg    = chip text + count text (≥4.5:1 vs the soft bg)
//   fill  = filled-chip variant where white text passes 4.5:1
export const CATEGORY_META = {
  compliance:         { label: 'Compliance',         dot: '#a06a14', soft: 'rgba(241,172,73,0.22)', fg: '#8a5a14', fill: '#a06a14' },
  maintenance:        { label: 'Maintenance',        dot: '#a52a1f', soft: 'rgba(219,83,76,0.18)',  fg: '#8a2b27', fill: '#a52a1f' },
  leasing:            { label: 'Leasing',            dot: '#1a4a80', soft: 'rgba(26,74,128,0.14)',  fg: '#1a4a80', fill: '#1a4a80' },
  capital:            { label: 'Capital',            dot: '#041e42', soft: 'rgba(4,30,66,0.12)',    fg: '#041e42', fill: '#041e42' },
  resident_services:  { label: 'Resident Services',  dot: '#2c6e63', soft: 'rgba(94,184,168,0.22)', fg: '#1f5147', fill: '#2c6e63' },
  reporting:          { label: 'Reporting',          dot: '#3f4a5c', soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c', fill: '#3f4a5c' },
  vendor:             { label: 'Vendor',             dot: '#5a4a8f', soft: 'rgba(90,74,143,0.16)',  fg: '#3e336b', fill: '#5a4a8f' },
  staff:              { label: 'Staff & Hiring',     dot: '#8a5a14', soft: 'rgba(138,90,20,0.16)',  fg: '#6b450f', fill: '#8a5a14' },
  policy:             { label: 'Policy',             dot: '#3f4a5c', soft: 'rgba(63,74,92,0.14)',   fg: '#1a1a2e', fill: '#3f4a5c' },
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

// Cycle order used by the inline status-toggle on the task card.
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

const days = (n) => dayjs().add(n, 'day').toISOString();

let DB = [
  // ---------- The Apartments at College Avenue (new construction, just opened) ----------
  { id: newId(), propertyId: 'prop_college_ave', title: 'Lease-up — 6 vacant units to fill', category: 'leasing',           urgency: 'medium', status: 'in_progress', daysOpen: 18, dueAt: days(30),  description: '58 of 64 units occupied. Application pipeline strong.' },
  { id: newId(), propertyId: 'prop_college_ave', title: 'Final occupancy certificate filing',  category: 'compliance',        urgency: 'high',   status: 'open',         daysOpen: 4,  dueAt: days(8),   description: 'PHFA package due before Q-end.' },
  { id: newId(), propertyId: 'prop_college_ave', title: 'First-year warranty inspection coord.', category: 'maintenance',     urgency: 'low',    status: 'open',         daysOpen: 9,  dueAt: days(60),  description: 'GC walk-through scheduled with each subcontractor.' },
  { id: newId(), propertyId: 'prop_college_ave', title: 'Resident orientation session #1',       category: 'resident_services', urgency: 'medium', status: 'in_progress', daysOpen: 6,  dueAt: days(14) },
  { id: newId(), propertyId: 'prop_college_ave', title: 'Q1 owner report — grand-opening cycle', category: 'reporting',         urgency: 'medium', status: 'open',         daysOpen: 3,  dueAt: days(12) },

  // ---------- Oak Bottom Village (rehab; has capex notes) ----------
  { id: newId(), propertyId: 'prop_oak_bottom', title: 'Roof upgrades — phase 1 punch list',   category: 'capital',           urgency: 'high',   status: 'in_progress', daysOpen: 22, dueAt: days(22) },
  { id: newId(), propertyId: 'prop_oak_bottom', title: 'Window replacement — bid review',      category: 'capital',           urgency: 'medium', status: 'open',         daysOpen: 11, dueAt: days(35) },
  { id: newId(), propertyId: 'prop_oak_bottom', title: 'HVAC upgrades — vendor selection',     category: 'capital',           urgency: 'medium', status: 'open',         daysOpen: 8,  dueAt: days(18) },
  { id: newId(), propertyId: 'prop_oak_bottom', title: 'Solar installation — feasibility',     category: 'capital',           urgency: 'low',    status: 'open',         daysOpen: 21, dueAt: days(90) },
  { id: newId(), propertyId: 'prop_oak_bottom', title: 'ADA modernization — accessibility audit', category: 'capital',         urgency: 'high',   status: 'open',         daysOpen: 6,  dueAt: days(12) },

  // ---------- Apartments at Heatherwoods (rehab, 56 units) ----------
  { id: newId(), propertyId: 'prop_heatherwoods', title: 'LIHTC recertification packet — 56 households', category: 'compliance',  urgency: 'high',   status: 'in_progress', daysOpen: 21, dueAt: days(14) },
  { id: newId(), propertyId: 'prop_heatherwoods', title: 'HVAC PM cycle — all units',                 category: 'maintenance',   urgency: 'medium', status: 'open',         daysOpen: 12, dueAt: days(21) },
  { id: newId(), propertyId: 'prop_heatherwoods', title: 'Resident services intake at preserved units', category: 'resident_services', urgency: 'medium', status: 'in_progress', daysOpen: 9,  dueAt: days(28) },

  // ---------- Willow Ridge Apartments (Hershey) ----------
  { id: newId(), propertyId: 'prop_willow_ridge', title: 'REAC inspection prep',                category: 'compliance',        urgency: 'high',   status: 'open',         daysOpen: 5,  dueAt: days(9) },
  { id: newId(), propertyId: 'prop_willow_ridge', title: 'Vacancy turnover — 3 units',            category: 'maintenance',       urgency: 'medium', status: 'in_progress', daysOpen: 7,  dueAt: days(12) },
  { id: newId(), propertyId: 'prop_willow_ridge', title: 'Owner report cycle — May',              category: 'reporting',         urgency: 'low',    status: 'open',         daysOpen: 2,  dueAt: days(18) },

  // ---------- 1528 West Apartments (Allentown) ----------
  { id: newId(), propertyId: 'prop_1528_west', title: 'Boiler annual inspection',                category: 'compliance',        urgency: 'high',   status: 'open',         daysOpen: 3,  dueAt: days(5) },
  { id: newId(), propertyId: 'prop_1528_west', title: 'Laundry equipment service',                category: 'maintenance',       urgency: 'low',    status: 'open',         daysOpen: 12, dueAt: days(25) },
  { id: newId(), propertyId: 'prop_1528_west', title: 'Community room reservation rollout',       category: 'resident_services', urgency: 'low',    status: 'open',         daysOpen: 18, dueAt: days(45) },

  // ---------- Beach Run Apartments ----------
  { id: newId(), propertyId: 'prop_beach_run', title: 'Annual fire inspection',                   category: 'compliance',        urgency: 'high',   status: 'open',         daysOpen: 4,  dueAt: days(7) },
  { id: newId(), propertyId: 'prop_beach_run', title: 'Resident leadership quarterly meet',       category: 'resident_services', urgency: 'medium', status: 'in_progress', daysOpen: 11, dueAt: days(21) },

  // ---------- Duke Manor Apartments (Lancaster, 100 units) ----------
  { id: newId(), propertyId: 'prop_duke_manor', title: 'Community garden coordinator role',       category: 'resident_services', urgency: 'low',    status: 'open',         daysOpen: 24, dueAt: days(60) },
  { id: newId(), propertyId: 'prop_duke_manor', title: 'Resident Academy session 3 — facilitation', category: 'resident_services', urgency: 'medium', status: 'in_progress', daysOpen: 8,  dueAt: days(14) },
  { id: newId(), propertyId: 'prop_duke_manor', title: 'Annual unit walks — 100 units',           category: 'maintenance',       urgency: 'medium', status: 'in_progress', daysOpen: 14, dueAt: days(30) },
  { id: newId(), propertyId: 'prop_duke_manor', title: 'LIHTC recertification — phased',          category: 'compliance',        urgency: 'medium', status: 'in_progress', daysOpen: 19, dueAt: days(28) },
  { id: newId(), propertyId: 'prop_duke_manor', title: 'Owner report cycle — May',                category: 'reporting',         urgency: 'medium', status: 'open',         daysOpen: 3,  dueAt: days(15) },

  // ---------- Southgate Apartments ----------
  { id: newId(), propertyId: 'prop_southgate', title: 'Verify property location + address',       category: 'compliance',        urgency: 'high',   status: 'blocked',      daysOpen: 35, dueAt: days(-2), description: 'Address details ambiguous in HDC records; needs internal validation before next reporting cycle.' },
  { id: newId(), propertyId: 'prop_southgate', title: 'Annual property survey',                   category: 'reporting',         urgency: 'low',    status: 'open',         daysOpen: 14, dueAt: days(45) },

  // ---------- St. Peters Apartments ----------
  { id: newId(), propertyId: 'prop_st_peters', title: 'Annual accessibility audit',               category: 'compliance',        urgency: 'high',   status: 'open',         daysOpen: 6,  dueAt: days(11) },
  { id: newId(), propertyId: 'prop_st_peters', title: 'Resident accommodation requests review',   category: 'resident_services', urgency: 'medium', status: 'in_progress', daysOpen: 9,  dueAt: days(18) },

  // ---------- Pocomoke Landing (3rd party for Homes for America) ----------
  { id: newId(), propertyId: 'prop_pocomoke_landing', title: 'Monthly owner report — Homes for America', category: 'reporting',   urgency: 'high',   status: 'in_progress', daysOpen: 5,  dueAt: days(3) },
  { id: newId(), propertyId: 'prop_pocomoke_landing', title: 'Annual contract renewal review',          category: 'compliance',    urgency: 'medium', status: 'open',         daysOpen: 7,  dueAt: days(40) },
  { id: newId(), propertyId: 'prop_pocomoke_landing', title: 'Property condition assessment',           category: 'maintenance',   urgency: 'low',    status: 'open',         daysOpen: 16, dueAt: days(55) },

  // ---------- Parkside Village (Cambridge MD) ----------
  { id: newId(), propertyId: 'prop_parkside_village', title: 'Section 8 HAP contract renewal',           category: 'compliance',  urgency: 'high',   status: 'in_progress', daysOpen: 12, dueAt: days(9) },
  { id: newId(), propertyId: 'prop_parkside_village', title: 'Q2 owner report',                          category: 'reporting',   urgency: 'high',   status: 'in_progress', daysOpen: 6,  dueAt: days(8) },
  { id: newId(), propertyId: 'prop_parkside_village', title: 'Vacancy backlog — 4 units',                category: 'leasing',     urgency: 'high',   status: 'open',         daysOpen: 11, dueAt: days(14) },

  // ---------- Glenburn Garden House (Cambridge MD, senior) ----------
  { id: newId(), propertyId: 'prop_glenburn', title: 'Annual senior wellness coordination',        category: 'resident_services', urgency: 'medium', status: 'open',         daysOpen: 10, dueAt: days(22) },
  { id: newId(), propertyId: 'prop_glenburn', title: 'Q2 owner report',                            category: 'reporting',         urgency: 'medium', status: 'open',         daysOpen: 4,  dueAt: days(8) },

  // ---------- Hudson Townhomes (Cambridge MD) ----------
  { id: newId(), propertyId: 'prop_hudson_townhomes', title: 'Q2 owner report',                    category: 'reporting',         urgency: 'medium', status: 'open',         daysOpen: 4,  dueAt: days(8) },
  { id: newId(), propertyId: 'prop_hudson_townhomes', title: 'Vacancy turnover — 2 units',         category: 'maintenance',       urgency: 'low',    status: 'in_progress', daysOpen: 9,  dueAt: days(18) },

  // ---------- James E. Leonard Apartments (Salisbury MD) ----------
  { id: newId(), propertyId: 'prop_leonard', title: 'Annual fire inspection',                       category: 'compliance',        urgency: 'high',   status: 'open',         daysOpen: 3,  dueAt: days(6) },
  { id: newId(), propertyId: 'prop_leonard', title: 'Owner report cycle — May',                     category: 'reporting',         urgency: 'medium', status: 'open',         daysOpen: 3,  dueAt: days(12) },
  { id: newId(), propertyId: 'prop_leonard', title: 'Lease renewal cycle (40% of units)',           category: 'leasing',           urgency: 'medium', status: 'in_progress', daysOpen: 18, dueAt: days(30) },

  // ---------- Shiloh House Apartments (Hurlock MD) ----------
  { id: newId(), propertyId: 'prop_shiloh_house', title: 'Roof leak repair — Building B',          category: 'maintenance',       urgency: 'high',   status: 'in_progress', daysOpen: 2,  dueAt: days(4) },
  { id: newId(), propertyId: 'prop_shiloh_house', title: 'Owner report cycle — May',               category: 'reporting',         urgency: 'low',    status: 'open',         daysOpen: 5,  dueAt: days(15) },

  // ---------- Elizabeth Cornish Landing (Bridgeville DE) ----------
  { id: newId(), propertyId: 'prop_cornish_landing', title: 'Compliance file audit',               category: 'compliance',        urgency: 'high',   status: 'in_progress', daysOpen: 6,  dueAt: days(12) },
  { id: newId(), propertyId: 'prop_cornish_landing', title: 'Resident services kickoff at site',   category: 'resident_services', urgency: 'medium', status: 'open',         daysOpen: 14, dueAt: days(35) },
  { id: newId(), propertyId: 'prop_cornish_landing', title: 'Owner report cycle — May',            category: 'reporting',         urgency: 'low',    status: 'open',         daysOpen: 5,  dueAt: days(17) },

  // =====================================================================
  // PORTFOLIO-WIDE TASKS  (propertyId = null)
  // These are Jaime's leadership / cross-property / vendor / staff / policy
  // work that doesn't pin to any single property. They show in the triage
  // queue and Cross-portfolio section, but never on the map.
  // =====================================================================
  { id: newId(), propertyId: null, title: 'Renew HVAC vendor master agreement',                category: 'vendor', urgency: 'high',   status: 'in_progress', daysOpen: 14, dueAt: days(11),  description: 'Current contract expires Q-end; legal review in flight.' },
  { id: newId(), propertyId: null, title: 'Staff training — trauma-informed leasing',           category: 'staff',  urgency: 'medium', status: 'open',         daysOpen: 9,  dueAt: days(28),  description: 'PM team + RSCs; 2-day cohort with Michael Sedoti.' },
  { id: newId(), propertyId: null, title: 'Annual portfolio occupancy report (board)',         category: 'reporting', urgency: 'high', status: 'in_progress', daysOpen: 11, dueAt: days(15),  description: 'July board meeting pre-read.' },
  { id: newId(), propertyId: null, title: 'Update tenant selection plan — Fair Housing refresh', category: 'policy', urgency: 'medium', status: 'open',         daysOpen: 22, dueAt: days(40) },
  { id: newId(), propertyId: null, title: 'Q3 PM budget meeting prep',                          category: 'reporting', urgency: 'medium', status: 'open',         daysOpen: 4,  dueAt: days(20),  description: 'Department roll-up across all 16 communities.' },
  { id: newId(), propertyId: null, title: 'Cross-property maintenance team scheduling — June',  category: 'staff',  urgency: 'medium', status: 'in_progress', daysOpen: 6,  dueAt: days(10) },
  { id: newId(), propertyId: null, title: 'Policy: pet addendum standardization',                category: 'policy', urgency: 'low',    status: 'open',         daysOpen: 31, dueAt: days(45) },
  { id: newId(), propertyId: null, title: 'REAC scoring strategy review — 7 third-party comms', category: 'compliance', urgency: 'high', status: 'blocked',      daysOpen: 19, dueAt: days(7),   description: 'Awaiting HFA decision on inspection window.' },
  { id: newId(), propertyId: null, title: 'PM coordinator hire — backfill posting',             category: 'staff',  urgency: 'high',   status: 'in_progress', daysOpen: 16, dueAt: days(18) },
  { id: newId(), propertyId: null, title: 'Vendor management quarterly review',                  category: 'vendor', urgency: 'medium', status: 'open',         daysOpen: 5,  dueAt: days(25) },
  { id: newId(), propertyId: null, title: 'Yardi → Salesforce migration prep — PM module scoping', category: 'policy', urgency: 'medium', status: 'in_progress', daysOpen: 28, dueAt: days(60) },
  { id: newId(), propertyId: null, title: 'Q2 ELT all-hands prep — PM portfolio brief',         category: 'reporting', urgency: 'medium', status: 'open',         daysOpen: 2,  dueAt: days(9) },
];

// ---------- public API ----------

export async function listTasks({ propertyId, propertyIdSet, includePortfolioWide = true, category, status } = {}) {
  await wait();
  return DB
    .filter((t) => {
      // If a single propertyId is asked for, narrow strictly to that.
      if (propertyId !== undefined) {
        return t.propertyId === propertyId;
      }
      // If a SET of property IDs is given, return tasks tied to those AND
      // (optionally) the portfolio-wide tasks.
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
    dueAt: days(7),
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

// ---------- derived helpers ----------

// Property health based on its task load.
//   critical: ≥2 high-urgency open/in_progress, OR ≥1 overdue high-urgency
//   watch:    ≥1 high-urgency open, OR ≥5 total open/in_progress
//   healthy:  otherwise
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

// Count summaries useful for the header strip.
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
