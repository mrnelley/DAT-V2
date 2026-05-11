// In-memory mock API for Departmental Workplans.
import dayjs from 'dayjs';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const newId = () => `wp_${Math.random().toString(36).slice(2, 9)}`;

export const WORKPLAN_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OFF_TRACK: 'off_track',
  COMPLETED: 'completed',
};

const DANA = { id: 'usr_dana', name: 'Dana Hanchin', initials: 'DH' };
const CHEN_MC = { id: 'mc', name: 'Marisol Chen', initials: 'MC' };
const DEVON = { id: 'dp', name: 'Devon Park', initials: 'DP' };
const YARA = { id: 'yo', name: 'Yara Osei', initials: 'YO' };
const SAM = { id: 'sw', name: 'Sam Whitaker', initials: 'SW' };

let DB = [
  // SB-241 workplans
  {
    id: 'wp_state_engage',
    title: 'State Legislator Engagement',
    initiativeId: 'init_sb241',
    departmentId: 'dept_advocacy',
    owner: DANA,
    status: WORKPLAN_STATUS.ON_TRACK,
    rollupPct: 68,
    startDate: dayjs().subtract(45, 'day').toISOString(),
    endDate: dayjs().add(30, 'day').toISOString(),
    description:
      'Direct CEO outreach to Senate + Assembly Housing Committee. Cadence: weekly touchpoints with high-priority members.',
    keyActivities: [
      'Weekly 1:1s with committee chairs',
      'Section 8 reform briefings to wavering members',
      'Pre-hearing strategy sessions with sponsors',
    ],
  },
  {
    id: 'wp_press_pipeline',
    title: 'Press Pipeline — SB-241 Narrative',
    initiativeId: 'init_sb241',
    departmentId: 'dept_communications',
    owner: DEVON,
    status: WORKPLAN_STATUS.ON_TRACK,
    rollupPct: 55,
    startDate: dayjs().subtract(30, 'day').toISOString(),
    endDate: dayjs().add(30, 'day').toISOString(),
    description: 'Op-ed placement, reporter briefings, and resident-story coordination tied to SB-241 momentum.',
    keyActivities: [
      'Monthly editorial board briefings',
      'Resident op-ed coaching + placement',
      'Press release cycle around committee hearing',
    ],
  },

  // Federal funder workplans
  {
    id: 'wp_funder_cultivate',
    title: 'Federal Funder Cultivation',
    initiativeId: 'init_federal_coalition',
    departmentId: 'dept_advocacy',
    owner: DANA,
    status: WORKPLAN_STATUS.ON_TRACK,
    rollupPct: 52,
    startDate: dayjs().subtract(45, 'day').toISOString(),
    endDate: dayjs().add(45, 'day').toISOString(),
    description: 'CEO touchpoints with Ford, JPMC, Wells Fargo CDF, HUD CPD on a 30-day cadence.',
    keyActivities: [
      'Quarterly funder dinners',
      'Outcomes data packet refresh each quarter',
      'Site visit with at least 2 funders before Q-end',
    ],
  },
  {
    id: 'wp_hud_flexibility',
    title: 'HUD CPD Flexibility Memo',
    initiativeId: 'init_federal_coalition',
    departmentId: 'dept_compliance',
    owner: CHEN_MC,
    status: WORKPLAN_STATUS.AT_RISK,
    rollupPct: 30,
    startDate: dayjs().subtract(30, 'day').toISOString(),
    endDate: dayjs().add(60, 'day').toISOString(),
    description: 'Secure formal HUD CPD discretion memo unlocking flexible deployment of FY27 dollars.',
    keyActivities: ['Draft memo with regional director', 'Submit + iterate'],
  },

  // BA coalition workplans
  {
    id: 'wp_coalition_active',
    title: 'Coalition Activation — Joint Statements + Press',
    initiativeId: 'init_ba_coalition',
    departmentId: 'dept_advocacy',
    owner: DANA,
    status: WORKPLAN_STATUS.AT_RISK,
    rollupPct: 38,
    startDate: dayjs().subtract(45, 'day').toISOString(),
    endDate: dayjs().add(45, 'day').toISOString(),
    description: 'Coordinated coalition voice — quarterly joint statements + a press moment.',
    keyActivities: [
      'Monthly coalition strategy with Carlos Méndez',
      'Joint policy brief co-authored with CA YIMBY',
      'Coalition press conference logistics',
    ],
  },

  // Resident voice workplans
  {
    id: 'wp_resident_amplify',
    title: 'Resident Listening + Op-Ed Coaching',
    initiativeId: 'init_resident_voice',
    departmentId: 'dept_resident_services',
    owner: YARA,
    status: WORKPLAN_STATUS.ON_TRACK,
    rollupPct: 62,
    startDate: dayjs().subtract(45, 'day').toISOString(),
    endDate: dayjs().add(45, 'day').toISOString(),
    description: 'Listening sessions at all 4 properties; coaching 2 residents to author + place op-eds.',
    keyActivities: [
      'Listening sessions: North Park (done), Lakeside (scheduled), Oak Grove, Riverbend',
      'Op-ed coaching cohort',
      'Quarterly resident summit',
    ],
  },

  // Capex workplans
  {
    id: 'wp_lakeside_roof',
    title: 'Lakeside Roof Replacement Phase 1',
    initiativeId: 'init_capex',
    departmentId: 'prop_lakeside',
    owner: SAM,
    status: WORKPLAN_STATUS.AT_RISK,
    rollupPct: 38,
    startDate: dayjs().subtract(30, 'day').toISOString(),
    endDate: dayjs().add(40, 'day').toISOString(),
    description: 'Buildings A and B complete before hurricane season.',
    keyActivities: ['Vendor sequencing', 'Daily progress photos', 'Resident comms 2 weeks out'],
  },
];

export async function listWorkplans({ initiativeId, ownerId } = {}) {
  await wait();
  return DB
    .filter((w) => (!initiativeId || w.initiativeId === initiativeId))
    .filter((w) => (!ownerId || w.owner?.id === ownerId))
    .map((w) => ({ ...w, keyActivities: [...w.keyActivities] }));
}

export async function getWorkplan(id) {
  await wait();
  const w = DB.find((x) => x.id === id);
  return w ? { ...w, keyActivities: [...w.keyActivities] } : null;
}

export async function createWorkplan(input) {
  await wait();
  const next = {
    id: newId(),
    initiativeId: null,
    departmentId: 'org_wide',
    owner: DANA,
    status: WORKPLAN_STATUS.ON_TRACK,
    rollupPct: 0,
    description: '',
    keyActivities: [],
    startDate: dayjs().toISOString(),
    endDate: dayjs().add(90, 'day').toISOString(),
    ...input,
  };
  DB = [next, ...DB];
  return { ...next };
}

export async function updateWorkplan(id, patch) {
  await wait();
  let next = null;
  DB = DB.map((w) => {
    if (w.id !== id) return w;
    next = { ...w, ...patch };
    return next;
  });
  return next ? { ...next } : null;
}

export async function deleteWorkplan(id) {
  await wait();
  DB = DB.filter((w) => w.id !== id);
  return { id };
}
