import { Button, IconButton, Tooltip } from '@mui/material';
import EventOutlined from '@mui/icons-material/EventOutlined';
import useAddToCalendar from './CalendarDialogProvider';

export default function AddToCalendarButton({
  seed,
  variant = 'button', // 'button' | 'icon'
  label = 'Add to Calendar',
  defaultScope = 'org',
  buttonProps = {},
}) {
  const { openCreate } = useAddToCalendar();
  const handleClick = (e) => {
    e?.stopPropagation?.();
    openCreate({ seed, defaultScope });
  };

  if (variant === 'icon') {
    return (
      <Tooltip title={label} placement="top">
        <IconButton onClick={handleClick} size="small" color="primary" {...buttonProps}>
          <EventOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      onClick={handleClick}
      startIcon={<EventOutlined />}
      variant="outlined"
      color="primary"
      size="small"
      {...buttonProps}
    >
      {label}
    </Button>
  );
}
