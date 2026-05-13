// In-memory store for Touchpoints (CEO ↔ person/circle interactions).
// Seed data scrubbed for the executive scope demo.
import dayjs from 'dayjs';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const newId = () => `tp_${Math.random().toString(36).slice(2, 9)}`;

export const TOUCHPOINT_TYPE = {
  MEETING: 'meeting',
  CALL: 'call',
  EMAIL: 'email',
  PUBLIC_APPEARANCE: 'public_appearance',
  OP_ED: 'op_ed',
  BOARD_ENGAGEMENT: 'board_engagement',
  WRITTEN_ASK: 'written_ask',
};

export const TYPE_META = {
  meeting:           { label: 'Meeting',           icon: 'people' },
  call:              { label: 'Call',              icon: 'phone' },
  email:             { label: 'Email',             icon: 'mail' },
  public_appearance: { label: 'Public Appearance', icon: 'mic' },
  op_ed:             { label: 'Op-Ed',             icon: 'article' },
  board_engagement:  { label: 'Board Engagement',  icon: 'group' },
  written_ask:       { label: 'Written Ask',       icon: 'edit' },
};

export const TOUCHPOINT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
};

let DB = [];

export async function listTouchpoints({ from, to, peopleId, circleId, priorityId, workplanId, initiativeId } = {}) {
  await wait();
  return DB
    .filter((t) => {
      if (peopleId && !t.peopleIds?.includes(peopleId)) return false;
      if (circleId && !t.circleIds?.includes(circleId)) return false;
      if (priorityId && t.priorityId !== priorityId) return false;
      if (workplanId && t.workplanId !== workplanId) return false;
      if (initiativeId && t.initiativeId !== initiativeId) return false;
      if (from && dayjs(t.occurredAt).isBefore(dayjs(from))) return false;
      if (to && dayjs(t.occurredAt).isAfter(dayjs(to))) return false;
      return true;
    })
    .sort((a, b) => dayjs(b.occurredAt).valueOf() - dayjs(a.occurredAt).valueOf())
    .map((t) => ({ ...t }));
}

export async function createTouchpoint(input) {
  await wait();
  const next = {
    id: newId(),
    status: input.status ?? TOUCHPOINT_STATUS.COMPLETED,
    type: TOUCHPOINT_TYPE.MEETING,
    subject: '',
    outcome: '',
    occurredAt: dayjs().toISOString(),
    durationMin: 30,
    peopleIds: [],
    circleIds: [],
    priorityId: null,
    workplanId: null,
    initiativeId: null,
    ...input,
  };
  DB = [next, ...DB];
  return { ...next };
}

export async function updateTouchpoint(id, patch) {
  await wait();
  let next = null;
  DB = DB.map((t) => {
    if (t.id !== id) return t;
    next = { ...t, ...patch };
    return next;
  });
  return next ? { ...next } : null;
}

export async function deleteTouchpoint(id) {
  await wait();
  DB = DB.filter((t) => t.id !== id);
  return { id };
}
