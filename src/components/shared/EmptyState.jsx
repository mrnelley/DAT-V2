import { Box, Typography, Button } from '@mui/material';
import InboxOutlined from '@mui/icons-material/InboxOutlined';

export default function EmptyState({
  icon: Icon = InboxOutlined,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 4,
        color: 'text.secondary',
      }}
    >
      <Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      {title && (
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" sx={{ maxWidth: 360, mb: actionLabel ? 3 : 0 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
