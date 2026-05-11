import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import dayjs from 'dayjs';

export const PERIOD = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
};

export const PERIOD_ORDER = [PERIOD.DAY, PERIOD.WEEK, PERIOD.MONTH, PERIOD.QUARTER, PERIOD.YEAR];

export const PERIOD_LABEL = {
  day: 'Day', week: 'Week', month: 'Month', quarter: 'Quarter', year: 'Year',
};

// Returns [startDate, endDate] for a given period anchored to today.
export function periodRange(period, anchor = dayjs()) {
  switch (period) {
    case PERIOD.DAY:
      return [anchor.startOf('day'), anchor.endOf('day')];
    case PERIOD.WEEK:
      return [anchor.startOf('week'), anchor.endOf('week')];
    case PERIOD.MONTH:
      return [anchor.startOf('month'), anchor.endOf('month')];
    case PERIOD.QUARTER: {
      const q = Math.floor(anchor.month() / 3);
      const start = anchor.month(q * 3).startOf('month');
      const end = start.add(3, 'month').subtract(1, 'day').endOf('day');
      return [start, end];
    }
    case PERIOD.YEAR:
      return [anchor.startOf('year'), anchor.endOf('year')];
    default:
      return [anchor.startOf('week'), anchor.endOf('week')];
  }
}

export function periodLabel(period, anchor = dayjs()) {
  const [start, end] = periodRange(period, anchor);
  switch (period) {
    case PERIOD.DAY: return start.format('dddd, MMM D');
    case PERIOD.WEEK: return `${start.format('MMM D')} – ${end.format('MMM D')}`;
    case PERIOD.MONTH: return start.format('MMMM YYYY');
    case PERIOD.QUARTER: return `Q${Math.floor(start.month() / 3) + 1} ${start.year()}`;
    case PERIOD.YEAR: return String(start.year());
    default: return '';
  }
}

export default function PeriodSwitcher({ value, onChange, size = 'small' }) {
  return (
    <ToggleButtonGroup
      exclusive
      size={size}
      value={value}
      onChange={(_e, v) => v && onChange?.(v)}
    >
      {PERIOD_ORDER.map((p) => (
        <ToggleButton key={p} value={p} sx={{ px: 1.75 }}>
          {PERIOD_LABEL[p]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
