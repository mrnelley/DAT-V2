// Helpers that turn entity records (Priority / Initiative / Huddle / Action Item)
// into partial CalendarItem "seed" objects suitable for the Add to Calendar dialog.
// Keep these pure — they should never reach into context or fetch anything.

import dayjs from 'dayjs';
import { SUBTYPE } from './calendarTokens';

const defaultEnd = (startsAt, hours = 1) =>
  dayjs(startsAt).add(hours, 'hour').toISOString();

export function priorityToSeed(priority) {
  if (!priority) return null;
  const startsAt = priority.dueAt ?? dayjs().add(7, 'day').hour(9).minute(0).toISOString();
  return {
    title: priority.title ?? 'Untitled Priority',
    subtype: SUBTYPE.COMMITMENT,
    startsAt,
    endsAt: defaultEnd(startsAt, 1),
    allDay: false,
    whyItMatters: priority.context ?? '',
    propertyOrDepartment: priority.teamId ?? 'org_wide',
    owner: priority.owner ?? undefined,
    source: {
      type: 'priority',
      id: priority.id,
      label: priority.title,
      url: `/priorities#${priority.id}`,
    },
  };
}

export function initiativeToSeed(initiative) {
  if (!initiative) return null;
  const startsAt = initiative.dueAt ?? dayjs().add(30, 'day').hour(9).minute(0).toISOString();
  return {
    title: initiative.title ?? 'Untitled Initiative',
    subtype: SUBTYPE.WAYPOINT,
    startsAt,
    endsAt: defaultEnd(startsAt, 1),
    allDay: false,
    whyItMatters: initiative.description ?? '',
    propertyOrDepartment: initiative.teamId ?? 'org_wide',
    owner: initiative.owner ?? undefined,
    source: {
      type: 'initiative',
      id: initiative.id,
      label: initiative.title,
      url: `/initiatives/${initiative.id}`,
    },
  };
}

export function huddleToSeed(huddle) {
  if (!huddle) return null;
  const startsAt = huddle.nextOccurrence ?? dayjs().add(1, 'day').hour(9).minute(0).toISOString();
  return {
    title: huddle.name ?? 'Huddle',
    subtype: SUBTYPE.TOUCHPOINT,
    startsAt,
    endsAt: defaultEnd(startsAt, 0.5),
    allDay: false,
    whyItMatters: huddle.description ?? '',
    propertyOrDepartment: huddle.teamId ?? 'org_wide',
    owner: huddle.owner ?? undefined,
    source: {
      type: 'huddle',
      id: huddle.id,
      label: huddle.name,
      url: `/huddles/${huddle.id}`,
    },
  };
}

export function actionItemToSeed(actionItem) {
  if (!actionItem) return null;
  const startsAt = actionItem.dueAt ?? dayjs().add(1, 'day').hour(9).minute(0).toISOString();
  return {
    title: actionItem.title ?? 'Action Item',
    subtype: SUBTYPE.MARKER,
    startsAt,
    endsAt: defaultEnd(startsAt, 1),
    allDay: false,
    owner: actionItem.owner ?? undefined,
    source: {
      type: 'action_item',
      id: actionItem.id,
      label: actionItem.title,
      url: `/action-items#${actionItem.id}`,
    },
  };
}
