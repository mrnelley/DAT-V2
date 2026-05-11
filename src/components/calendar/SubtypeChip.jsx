import { Box, Chip } from '@mui/material';
import { SUBTYPE_META } from '../../utils/calendarTokens';

export default function SubtypeChip({ subtype, size = 'small', sx = {}, ...rest }) {
  const meta = SUBTYPE_META[subtype] ?? SUBTYPE_META.waypoint;
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
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        '& .MuiChip-icon': { color: meta.dot, mr: '-4px' },
        ...sx,
      }}
      {...rest}
    />
  );
}
