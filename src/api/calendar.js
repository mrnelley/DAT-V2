// In-memory store for the Compass Calendar.
// Seed data scrubbed for the executive scope demo.
import { SUBTYPE, STATUS, SCOPE, APPROVAL_STATUS } from '../utils/calendarTokens';

const wait = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const newId = () => `cal_${Math.random().toString(36).slice(2, 10)}`;

let DB = [];

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
    .filter((i) => i.scope === SCOPE.PERSONAL && i.approvalStatus === APPROVAL_STATUS.PENDING)
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
    owner: input.owner ?? null,
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

function cloneItem(item) {
  return JSON.parse(JSON.stringify(item));
}

function filterByRange(item, from, to) {
  if (!from && !to) return true;
  const start = new Date(item.startsAt).getTime();
  if (from && start < new Date(from).getTime()) return false;
  if (to && start > new Date(to).getTime()) return false;
  return true;
}
