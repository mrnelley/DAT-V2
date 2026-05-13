// In-memory store for Quarterly Initiatives.
// Seed data scrubbed for the executive scope demo.
import dayjs from 'dayjs';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const newId = () => `init_${Math.random().toString(36).slice(2, 9)}`;

export const INITIATIVE_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OFF_TRACK: 'off_track',
  COMPLETED: 'completed',
};

let DB = [];

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
    primaryAdvocate: null,
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
