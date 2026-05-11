import dayjs from 'dayjs';

export const formatDay = (d) => dayjs(d).format('MMM D, YYYY');
export const formatDayShort = (d) => dayjs(d).format('MMM D');
export const formatTime = (d) => dayjs(d).format('h:mm A');
export const formatDateTime = (d) => dayjs(d).format('MMM D, YYYY · h:mm A');
export const formatWeekday = (d) => dayjs(d).format('dddd');

// "datetime-local" form value: 2026-05-22T09:00
export const toLocalInput = (iso) => dayjs(iso).format('YYYY-MM-DDTHH:mm');
export const fromLocalInput = (local) => dayjs(local).toISOString();

export const formatRelative = (d) => {
  const target = dayjs(d);
  const now = dayjs();
  const diffDays = target.startOf('day').diff(now.startOf('day'), 'day');
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return target.format('dddd');
  return target.format('MMM D');
};
