import { Chip } from '@mui/material';
import { STATUS_LABEL } from '../../utils/statusColors';

const STATUS_STYLE = {
  on_track: { bg: 'rgba(0,110,92,0.12)', fg: 'success.dark' },
  at_risk: { bg: 'rgba(241,172,73,0.18)', fg: 'warning.dark' },
  off_track: { bg: 'rgba(219,83,76,0.15)', fg: 'error.dark' },
  complete: { bg: 'rgba(0,110,92,0.18)', fg: 'success.dark' },
  no_data: { bg: 'rgba(90,100,117,0.12)', fg: 'text.secondary' },
  neutral: { bg: 'rgba(7,44,94,0.1)', fg: 'primary.main' },
};

export default function StatusChip({ status = 'neutral', label, size = 'small', sx = {}, ...rest }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.neutral;
  return (
    <Chip
      size={size}
      label={label ?? STATUS_LABEL[status] ?? status}
      sx={{
        bgcolor: style.bg,
        color: style.fg,
        textTransform: 'uppercase',
        ...sx,
      }}
      {...rest}
    />
  );
}
