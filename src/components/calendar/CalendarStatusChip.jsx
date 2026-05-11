import { Chip, Box } from '@mui/material';
import { STATUS_META } from '../../utils/calendarTokens';

export default function CalendarStatusChip({ status, size = 'small', sx = {}, ...rest }) {
  const meta = STATUS_META[status] ?? STATUS_META.on_course;
  return (
    <Chip
      size={size}
      icon={
        <Box
          component="span"
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: meta.dot,
            ml: '8px !important',
          }}
        />
      }
      label={meta.label}
      sx={{
        bgcolor: meta.soft,
        color: meta.fg,
        textTransform: 'none',
        '& .MuiChip-icon': { color: meta.dot, mr: '-4px' },
        ...sx,
      }}
      {...rest}
    />
  );
}
