// In-memory mock API for Quarterly Initiatives.
import dayjs from 'dayjs';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const newId = () => `init_${Math.random().toString(36).slice(2, 9)}`;

export const INITIATIVE_STATUS = {
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
  {
    id: 'init_sb241',
    title: 'Q2 State Housing Bill Advocacy (SB-241)',
    theme: 'State Legislative',
    narrative:
      'Drive SB-241 through Senate Housing Committee and into floor calendar by end of Q2. This is our flagship state-level legislative push.',
    year: 2026,
    quarter: 2,
    primaryAdvocate: DANA,
    owners: [DANA, CHEN_MC],
    successMeasures: [
      'SB-241 introduced with ≥3 co-authors',
      'Pass Senate Housing Committee unanimously',
      'Op-ed coverage in ≥3 outlets',
    ],
    status: INITIATIVE_STATUS.ON_TRACK,
    rollupPct: 62,
    startDate: dayjs().subtract(45, 'day').toISOString(),
    endDate: dayjs().add(45, 'day').toISOString(),
  },
  {
    id: 'init_federal_coalition',
    title: 'Federal Funding Coalition — FY27 Pipeline',
    theme: 'Federal / Funder',
    narrative:
      'Sustain federal funder relationships and unlock $4M in new commitments for FY27. Anchor on Ford, JPMC, Wells Fargo CDF, and HUD CPD.',
    year: 2026,
    quarter: 2,
    primaryAdvocate: DANA,
    owners: [DANA],
    successMeasures: [
      '≥$4M in new soft commitments',
      'Q3 funder roundtable confirmed',
      'HUD CPD flexibility memo received',
    ],
    status: INITIATIVE_STATUS.ON_TRACK,
    rollupPct: 48,
    startDate: dayjs().subtract(45, 'day').toISOString(),
    endDate: dayjs().add(45, 'day').toISOString(),
  },
  {
    id: 'init_ba_coalition',
    title: 'Bay Area Housing Coalition Activation',
    theme: 'Regional Partnership',
    narrative:
      'Activate the coalition as a unified advocacy voice — joint statements, shared policy briefs, coordinated press.',
    year: 2026,
    quarter: 2,
    primaryAdvocate: DANA,
    owners: [DANA, DEVON],
    successMeasures: [
      '≥4 joint coalition statements issued',
      'Quarterly coalition press event executed',
      'Shared policy brief published',
    ],
    status: INITIATIVE_STATUS.AT_RISK,
    rollupPct: 35,
    startDate: dayjs().subtract(45, 'day').toISOString(),
    endDate: dayjs().add(45, 'day').toISOString(),
  },
  {
    id: 'init_resident_voice',
    title: 'Resident Voice Amplification',
    theme: 'Resident-Led',
    narrative:
      'Elevate resident voices into the policy conversation. Listening sessions, op-ed authorship support, and press placement.',
    year: 2026,
    quarter: 2,
    primaryAdvocate: DANA,
    owners: [DANA, YARA],
    successMeasures: [
      '4 listening sessions across all 4 properties',
      '≥2 resident-authored op-eds placed',
      'Resident leadership council quarterly summit',
    ],
    status: INITIATIVE_STATUS.ON_TRACK,
    rollupPct: 58,
    startDate: dayjs().subtract(45, 'day').toISOString(),
    endDate: dayjs().add(45, 'day').toISOString(),
  },
  // Non-advocacy initiatives (for non-CEO downstream owners)
  {
    id: 'init_capex',
    title: 'Capex Catch-Up FY26',
    theme: 'Operations',
    narrative: 'Close out deferred maintenance backlog across all properties before storm season.',
    year: 2026,
    quarter: 2,
    primaryAdvocate: SAM,
    owners: [SAM],
    successMeasures: ['Lakeside Phase 1 complete', 'Riverbend HVAC replacement complete'],
    status: INITIATIVE_STATUS.AT_RISK,
    rollupPct: 41,
    startDate: dayjs().subtract(60, 'day').toISOString(),
    endDate: dayjs().add(30, 'day').toISOString(),
  },
];

export async function listInitiatives({ primaryAdvocateId } = {}) {
  await wait();
  let list = DB.slice();
  if (primaryAdvocateId) {
    list = list.filter((i) => i.primaryAdvocate?.id === primaryAdvocateId);
  }
  return list.map((i) => ({ ...i }));
}

export async function getInitiative(id) {
  await wait();
  const i = DB.find((x) => x.id === id);
  return i ? { ...i } : null;
}

export async function createInitiative(input) {
  await wait();
  const next = {
    id: newId(),
    year: dayjs().year(),
    quarter: Math.ceil((dayjs().month() + 1) / 3),
    owners: [],
    successMeasures: [],
    status: INITIATIVE_STATUS.ON_TRACK,
    rollupPct: 0,
    theme: '',
    narrative: '',
    primaryAdvocate: DANA,
    startDate: dayjs().toISOString(),
    endDate: dayjs().add(90, 'day').toISOString(),
    ...input,
  };
  DB = [next, ...DB];
  return { ...next };
}

export async function updateInitiative(id, patch) {
  await wait();
  let next = null;
  DB = DB.map((i) => {
    if (i.id !== id) return i;
    next = { ...i, ...patch };
    return next;
  });
  return next ? { ...next } : null;
}

export async function deleteInitiative(id) {
  await wait();
  DB = DB.filter((i) => i.id !== id);
  return { id };
}
