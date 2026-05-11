// In-memory mock API for People (advocacy contacts).
import dayjs from 'dayjs';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const newId = () => `per_${Math.random().toString(36).slice(2, 9)}`;

export const ENGAGEMENT_STAGE = {
  COLD: 'cold',
  WARM: 'warm',
  ENGAGED: 'engaged',
  CHAMPION: 'champion',
};

export const STAGE_ORDER = [
  ENGAGEMENT_STAGE.COLD,
  ENGAGEMENT_STAGE.WARM,
  ENGAGEMENT_STAGE.ENGAGED,
  ENGAGEMENT_STAGE.CHAMPION,
];

export const STAGE_META = {
  [ENGAGEMENT_STAGE.COLD]: { label: 'Cold', dot: '#5a6475', soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c' },
  [ENGAGEMENT_STAGE.WARM]: { label: 'Warm', dot: '#f1ac49', soft: 'rgba(241,172,73,0.2)', fg: '#8a5a14' },
  [ENGAGEMENT_STAGE.ENGAGED]: { label: 'Engaged', dot: '#5eb8a8', soft: 'rgba(94,184,168,0.2)', fg: '#2c6e63' },
  [ENGAGEMENT_STAGE.CHAMPION]: { label: 'Champion', dot: '#006e5c', soft: 'rgba(0,110,92,0.18)', fg: '#004d40' },
};

const daysAgo = (n) => dayjs().subtract(n, 'day').toISOString();

let DB = [
  // State Housing Committee
  { id: 'per_martinez', name: 'Sen. Elena Martinez', title: 'State Senator (D-15)', org: 'CA State Legislature', circles: ['cir_state_housing'], stage: 'engaged', cadenceDays: 21, lastTouch: daysAgo(8), notes: 'Chair of Housing Committee. Open to expanded LIHTC. Watch SB-241 timing.' },
  { id: 'per_okonkwo', name: 'Asm. James Okonkwo', title: 'Assembly Member (D-22)', org: 'CA State Legislature', circles: ['cir_state_housing'], stage: 'warm', cadenceDays: 30, lastTouch: daysAgo(34), notes: 'New to housing policy — needs primers. Briefed once on AHB tax credits.' },
  { id: 'per_park', name: 'Sen. Alana Park', title: 'State Senator (R-08)', org: 'CA State Legislature', circles: ['cir_state_housing'], stage: 'cold', cadenceDays: 45, lastTouch: daysAgo(62), notes: 'Skeptical on funding scale. Approach via rural-development frame.' },
  { id: 'per_yelchin', name: 'Asm. Robin Yelchin', title: 'Assembly Member (D-44)', org: 'CA State Legislature', circles: ['cir_state_housing'], stage: 'engaged', cadenceDays: 21, lastTouch: daysAgo(11), notes: 'Vice chair, housing committee. Strong on Section 8 reform.' },
  { id: 'per_chen', name: 'Sen. Bo-Wei Chen', title: 'State Senator (D-37)', org: 'CA State Legislature', circles: ['cir_state_housing'], stage: 'champion', cadenceDays: 28, lastTouch: daysAgo(7), notes: 'Will co-author SB-241. Already publicly committed.' },

  // Federal Funders Network
  { id: 'per_villarreal', name: 'Marisol Villarreal', title: 'Regional Director, HUD CPD', org: 'U.S. Dept. of Housing & Urban Development', circles: ['cir_federal_funders'], stage: 'warm', cadenceDays: 45, lastTouch: daysAgo(28), notes: 'Discretionary CPD flexibility — quarterly check.' },
  { id: 'per_obrien', name: 'Daniel O’Brien', title: 'Senior Program Officer', org: 'JPMorgan Chase Foundation', circles: ['cir_federal_funders'], stage: 'engaged', cadenceDays: 30, lastTouch: daysAgo(18), notes: 'Q3 funder roundtable host candidate. Wants outcomes data first.' },
  { id: 'per_navarro', name: 'Linda Navarro', title: 'Program Director', org: 'Ford Foundation', circles: ['cir_federal_funders'], stage: 'champion', cadenceDays: 30, lastTouch: daysAgo(5), notes: 'Long-time supporter. Pushing peer funders toward our model.' },
  { id: 'per_kapoor', name: 'Sanjay Kapoor', title: 'VP, Affordable Housing', org: 'Wells Fargo CDF', circles: ['cir_federal_funders'], stage: 'warm', cadenceDays: 60, lastTouch: daysAgo(40), notes: 'Bank CRA pipeline. New product launching Q3.' },

  // Local Press
  { id: 'per_alvarez', name: 'Roxanne Alvarez', title: 'Housing Reporter', org: 'Bay Area Herald', circles: ['cir_local_press'], stage: 'engaged', cadenceDays: 30, lastTouch: daysAgo(12), notes: 'Pitched op-ed last week — confirmation pending.' },
  { id: 'per_huang', name: 'Marcus Huang', title: 'Investigative Reporter', org: 'KQED', circles: ['cir_local_press'], stage: 'warm', cadenceDays: 45, lastTouch: daysAgo(48), notes: 'Working on a long form on rural housing access.' },
  { id: 'per_pierre', name: 'Sade Pierre', title: 'Editor, Housing Desk', org: 'San Francisco Chronicle', circles: ['cir_local_press'], stage: 'warm', cadenceDays: 30, lastTouch: daysAgo(22), notes: 'Wants quarterly briefings. Coordinates resident-voice stories.' },

  // Bay Area Housing Coalition
  { id: 'per_mendez', name: 'Carlos Méndez', title: 'Executive Director', org: 'Bay Area Housing Coalition', circles: ['cir_ba_coalition'], stage: 'champion', cadenceDays: 14, lastTouch: daysAgo(5), notes: 'Co-leads quarterly statement letter.' },
  { id: 'per_okafor', name: 'Adaeze Okafor', title: 'Policy Lead', org: 'CA YIMBY', circles: ['cir_ba_coalition'], stage: 'engaged', cadenceDays: 30, lastTouch: daysAgo(15), notes: 'Joint policy paper in draft.' },
  { id: 'per_huber', name: 'Greta Huber', title: 'Director', org: 'NPH', circles: ['cir_ba_coalition'], stage: 'engaged', cadenceDays: 30, lastTouch: daysAgo(20), notes: 'Coalition signatory on every joint letter.' },
  { id: 'per_robinson', name: 'Theo Robinson', title: 'Director of Advocacy', org: 'East Bay Housing Org', circles: ['cir_ba_coalition'], stage: 'warm', cadenceDays: 45, lastTouch: daysAgo(52), notes: 'Overdue — refresh on Riverbend pipeline.' },

  // HDC Board
  { id: 'per_chowdhury', name: 'Rashida Chowdhury', title: 'Board Chair', org: 'HDC Board', circles: ['cir_hdc_board'], stage: 'champion', cadenceDays: 14, lastTouch: daysAgo(6), notes: 'Weekly 30-min sync.' },
  { id: 'per_vincent', name: 'Henry Vincent', title: 'Treasurer', org: 'HDC Board', circles: ['cir_hdc_board'], stage: 'champion', cadenceDays: 21, lastTouch: daysAgo(15), notes: 'Finance pre-read 3 days before each meeting.' },
  { id: 'per_singh', name: 'Priya Singh', title: 'Governance Committee Chair', org: 'HDC Board', circles: ['cir_hdc_board'], stage: 'engaged', cadenceDays: 28, lastTouch: daysAgo(33), notes: 'Q2 governance review — schedule.' },
  { id: 'per_kim', name: 'Joseph Kim', title: 'Board Member', org: 'HDC Board', circles: ['cir_hdc_board'], stage: 'engaged', cadenceDays: 28, lastTouch: daysAgo(19), notes: 'Resident-relations portfolio.' },

  // Resident Council Leaders
  { id: 'per_johnson', name: 'Brenda Johnson', title: 'Resident Council President — North Park', org: 'North Park Resident Council', circles: ['cir_resident_leaders'], stage: 'champion', cadenceDays: 21, lastTouch: daysAgo(10), notes: 'Hosting next listening session.' },
  { id: 'per_garcia', name: 'Hector Garcia', title: 'Resident Council Lead — Lakeside', org: 'Lakeside Resident Council', circles: ['cir_resident_leaders'], stage: 'engaged', cadenceDays: 28, lastTouch: daysAgo(22), notes: 'Roof project coordinator on resident side.' },
  { id: 'per_thompson', name: 'Diane Thompson', title: 'Resident Council Lead — Oak Grove', org: 'Oak Grove Resident Council', circles: ['cir_resident_leaders'], stage: 'engaged', cadenceDays: 28, lastTouch: daysAgo(31), notes: 'Translator support coordinator.' },
  { id: 'per_rivera', name: 'Sofia Rivera', title: 'Resident Council Lead — Riverbend', org: 'Riverbend Resident Council', circles: ['cir_resident_leaders'], stage: 'warm', cadenceDays: 30, lastTouch: daysAgo(44), notes: 'Move-in day coordinator.' },
];

export async function listPeople() {
  await wait();
  return DB.map((p) => ({ ...p, daysSince: dayjs().diff(dayjs(p.lastTouch), 'day') }));
}

export async function getPerson(id) {
  await wait();
  const p = DB.find((x) => x.id === id);
  return p ? { ...p, daysSince: dayjs().diff(dayjs(p.lastTouch), 'day') } : null;
}

export async function updatePerson(id, patch) {
  await wait();
  let next = null;
  DB = DB.map((p) => {
    if (p.id !== id) return p;
    next = { ...p, ...patch };
    return next;
  });
  return next ? { ...next } : null;
}

export async function listPeopleByCircle(circleId) {
  await wait();
  return DB
    .filter((p) => p.circles.includes(circleId))
    .map((p) => ({ ...p, daysSince: dayjs().diff(dayjs(p.lastTouch), 'day') }));
}

// Helper: who's overdue?
export async function listOverdue() {
  await wait();
  return DB
    .map((p) => ({ ...p, daysSince: dayjs().diff(dayjs(p.lastTouch), 'day') }))
    .filter((p) => p.daysSince > p.cadenceDays)
    .sort((a, b) => (b.daysSince - b.cadenceDays) - (a.daysSince - a.cadenceDays));
}
