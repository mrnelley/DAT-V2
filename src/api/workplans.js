// In-memory store for Departmental Workplans.
// Seed data scrubbed for the executive scope demo.
import dayjs from 'dayjs';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const newId = () => `wp_${Math.random().toString(36).slice(2, 9)}`;

export const WORKPLAN_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OFF_TRACK: 'off_track',
  COMPLETED: 'completed',
};

let DB = [];

export async function listWorkplans({ initiativeId, ownerId } = {}) {
  await wait();
  return DB
    .filter((w) => (!initiativeId || w.initiativeId === initiativeId))
    .filter((w) => (!ownerId || w.owner?.id === ownerId))
    .map((w) => ({ ...w, keyActivities: [...(w.keyActivities ?? [])] }));
}

export async function getWorkplan(id) {
  await wait();
  const w = DB.find((x) => x.id === id);
  return w ? { ...w, keyActivities: [...(w.keyActivities ?? [])] } : null;
}

export async function createWorkplan(input) {
  await wait();
  const next = {
    id: newId(),
    initiativeId: null,
    departmentId: 'org_wide',
    owner: null,
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
