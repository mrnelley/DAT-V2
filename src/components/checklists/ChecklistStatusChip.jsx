import { Chip } from '@mui/material';
import { STATUS_META, STATUS_LABEL } from '../../api/curbAppealChecklists';

export default function ChecklistStatusChip({ status, size = 'small', sx = {}, ...rest }) {
  const meta = STATUS_META[status] ?? STATUS_META.not_started;
  return (
    <Chip
      size={size}
      label={STATUS_LABEL[status] ?? status}
      sx={{
        bgcolor: meta.soft,
        color: meta.fg,
        fontWeight: 700,
        textTransform: 'none',
        ...sx,
      }}
      {...rest}
    />
  );
}
