// In-memory store for People (advocacy contacts).
// Seed data scrubbed for the executive scope demo. Engagement stage tokens
// remain since UI components import them for chip styling.
import dayjs from 'dayjs';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

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
  [ENGAGEMENT_STAGE.COLD]:     { label: 'Cold',     dot: '#5a6475', soft: 'rgba(90,100,117,0.14)',  fg: '#3f4a5c' },
  [ENGAGEMENT_STAGE.WARM]:     { label: 'Warm',     dot: '#f1ac49', soft: 'rgba(241,172,73,0.2)',   fg: '#8a5a14' },
  [ENGAGEMENT_STAGE.ENGAGED]:  { label: 'Engaged',  dot: '#5eb8a8', soft: 'rgba(94,184,168,0.2)',   fg: '#2c6e63' },
  [ENGAGEMENT_STAGE.CHAMPION]: { label: 'Champion', dot: '#006e5c', soft: 'rgba(0,110,92,0.18)',    fg: '#004d40' },
};

let DB = [];

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
    .filter((p) => p.circles?.includes(circleId))
    .map((p) => ({ ...p, daysSince: dayjs().diff(dayjs(p.lastTouch), 'day') }));
}

export async function listOverdue() {
  await wait();
  return DB
    .map((p) => ({ ...p, daysSince: dayjs().diff(dayjs(p.lastTouch), 'day') }))
    .filter((p) => p.daysSince > p.cadenceDays)
    .sort((a, b) => (b.daysSince - b.cadenceDays) - (a.daysSince - a.cadenceDays));
}
