import { Avatar } from '@mui/material';

const SIZE_MAP = { sm: 24, md: 32, lg: 40, xl: 56 };

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function UserAvatar({ user, size = 'md', sx = {}, ...rest }) {
  const px = typeof size === 'number' ? size : SIZE_MAP[size] ?? SIZE_MAP.md;
  const initials = user?.initials || getInitials(user?.name);
  const photoUrl = user?.photoUrl;

  return (
    <Avatar
      src={photoUrl || undefined}
      alt={user?.name || 'User'}
      sx={{
        width: px,
        height: px,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        fontSize: px * 0.4,
        fontWeight: 600,
        ...sx,
      }}
      {...rest}
    >
      {!photoUrl && initials}
    </Avatar>
  );
}
