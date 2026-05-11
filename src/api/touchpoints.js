// In-memory mock API for Touchpoints (CEO ↔ person/circle interactions).
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
  meeting: { label: 'Meeting', icon: 'people' },
  call: { label: 'Call', icon: 'phone' },
  email: { label: 'Email', icon: 'mail' },
  public_appearance: { label: 'Public Appearance', icon: 'mic' },
  op_ed: { label: 'Op-Ed', icon: 'article' },
  board_engagement: { label: 'Board Engagement', icon: 'group' },
  written_ask: { label: 'Written Ask', icon: 'edit' },
};

export const TOUCHPOINT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
};

const at = (offsetDays, hour = 9, minute = 0) =>
  dayjs().add(offsetDays, 'day').hour(hour).minute(minute).second(0).toISOString();

let DB = [
  // Recent / completed
  { id: newId(), type: 'meeting', status: 'completed', subject: 'Quarterly briefing with Sen. Chen on SB-241 strategy',
    outcome: 'Confirmed co-authorship; will introduce in June session. Pre-draft circulating.',
    occurredAt: at(-7, 10), durationMin: 60, peopleIds: ['per_chen'], circleIds: ['cir_state_housing'],
    priorityId: 'pri_adv_001', workplanId: 'wp_state_engage', initiativeId: 'init_sb241' },
  { id: newId(), type: 'call', status: 'completed', subject: 'Funder pulse — Ford Foundation',
    outcome: 'Linda confirmed Q3 grant continuation. Hinted at $2M expansion if outcomes hold.',
    occurredAt: at(-5, 14), durationMin: 30, peopleIds: ['per_navarro'], circleIds: ['cir_federal_funders'],
    priorityId: 'pri_adv_002', workplanId: 'wp_funder_cultivate', initiativeId: 'init_federal_coalition' },
  { id: newId(), type: 'meeting', status: 'completed', subject: 'Board Chair weekly sync',
    outcome: 'Aligned on Q3 priorities. Q2 governance review scheduled.',
    occurredAt: at(-6, 9), durationMin: 30, peopleIds: ['per_chowdhury'], circleIds: ['cir_hdc_board'],
    priorityId: null, workplanId: null, initiativeId: null },
  { id: newId(), type: 'public_appearance', status: 'completed', subject: 'Bay Area Coalition press conference',
    outcome: 'Joint statement signed by 7 orgs. Press hit Chronicle + KQED.',
    occurredAt: at(-10, 11), durationMin: 90, peopleIds: ['per_mendez','per_okafor','per_huber'], circleIds: ['cir_ba_coalition'],
    priorityId: 'pri_adv_003', workplanId: 'wp_coalition_active', initiativeId: 'init_ba_coalition' },
  { id: newId(), type: 'op_ed', status: 'completed', subject: 'Op-ed draft submitted — Bay Area Herald',
    outcome: 'Draft submitted; Roxanne confirmed publication target 5/18.',
    occurredAt: at(-3, 16), durationMin: 0, peopleIds: ['per_alvarez'], circleIds: ['cir_local_press'],
    priorityId: 'pri_adv_004', workplanId: 'wp_press_pipeline', initiativeId: 'init_resident_voice' },
  { id: newId(), type: 'meeting', status: 'completed', subject: 'North Park listening session',
    outcome: '14 residents shared maintenance + policy concerns. 3 quoted in upcoming KQED piece.',
    occurredAt: at(-12, 18), durationMin: 90, peopleIds: ['per_johnson'], circleIds: ['cir_resident_leaders'],
    priorityId: null, workplanId: 'wp_resident_amplify', initiativeId: 'init_resident_voice' },
  { id: newId(), type: 'email', status: 'completed', subject: 'Follow-up note to Asm. Yelchin',
    outcome: 'Sent Section 8 reform brief. Awaiting response.',
    occurredAt: at(-2, 8), durationMin: 0, peopleIds: ['per_yelchin'], circleIds: ['cir_state_housing'],
    priorityId: 'pri_adv_001', workplanId: 'wp_state_engage', initiativeId: 'init_sb241' },

  // Today + upcoming / scheduled
  { id: newId(), type: 'call', status: 'scheduled', subject: 'Funder check-in — JPMorgan Foundation',
    outcome: '', occurredAt: at(0, 11), durationMin: 30, peopleIds: ['per_obrien'], circleIds: ['cir_federal_funders'],
    priorityId: 'pri_adv_002', workplanId: 'wp_funder_cultivate', initiativeId: 'init_federal_coalition' },
  { id: newId(), type: 'meeting', status: 'scheduled', subject: 'Board pre-read review with Treasurer',
    outcome: '', occurredAt: at(0, 15), durationMin: 45, peopleIds: ['per_vincent'], circleIds: ['cir_hdc_board'],
    priorityId: null, workplanId: null, initiativeId: null },
  { id: newId(), type: 'meeting', status: 'scheduled', subject: 'Coalition strategy with Carlos Méndez',
    outcome: '', occurredAt: at(1, 10), durationMin: 60, peopleIds: ['per_mendez'], circleIds: ['cir_ba_coalition'],
    priorityId: 'pri_adv_003', workplanId: 'wp_coalition_active', initiativeId: 'init_ba_coalition' },
  { id: newId(), type: 'call', status: 'scheduled', subject: 'Brief Sen. Park on rural framing',
    outcome: '', occurredAt: at(2, 13), durationMin: 30, peopleIds: ['per_park'], circleIds: ['cir_state_housing'],
    priorityId: 'pri_adv_001', workplanId: 'wp_state_engage', initiativeId: 'init_sb241' },
  { id: newId(), type: 'meeting', status: 'scheduled', subject: 'Lakeside resident roundtable',
    outcome: '', occurredAt: at(3, 18), durationMin: 90, peopleIds: ['per_garcia'], circleIds: ['cir_resident_leaders'],
    priorityId: null, workplanId: 'wp_resident_amplify', initiativeId: 'init_resident_voice' },
  { id: newId(), type: 'public_appearance', status: 'scheduled', subject: 'Keynote — CA YIMBY housing summit',
    outcome: '', occurredAt: at(8, 9), durationMin: 60, peopleIds: ['per_okafor'], circleIds: ['cir_ba_coalition'],
    priorityId: 'pri_adv_003', workplanId: 'wp_coalition_active', initiativeId: 'init_ba_coalition' },
];

export async function listTouchpoints({ from, to, peopleId, circleId, priorityId, workplanId, initiativeId } = {}) {
  await wait();
  return DB
    .filter((t) => {
      if (peopleId && !t.peopleIds.includes(peopleId)) return false;
      if (circleId && !t.circleIds.includes(circleId)) return false;
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
