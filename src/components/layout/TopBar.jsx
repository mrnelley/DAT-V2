import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import UserAvatar from '../shared/UserAvatar';

const NAV_BUTTONS = [
  {
    key: 'strategy',
    label: 'Strategy',
    items: ['Vision', 'Annual Initiatives', 'Priorities'],
  },
  {
    key: 'culture',
    label: 'Culture',
    items: ['Core Values', 'Recognition', 'Feedback'],
  },
  {
    key: 'reports',
    label: 'Reports',
    items: ['KPI Snapshots', 'Quarterly Reviews', 'Export'],
  },
  {
    key: 'admin',
    label: 'Administration',
    items: ['Users', 'Teams', 'Integrations', 'Settings'],
  },
];

function TopBarMenu({ button }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <Button
        color="inherit"
        endIcon={<KeyboardArrowDown />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ color: 'common.white', fontWeight: 500 }}
      >
        {button.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            component: motion.div,
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.15, ease: 'easeOut' },
            sx: { mt: 0.5, minWidth: 200 },
          },
        }}
      >
        {button.items.map((item) => (
          <MenuItem key={item} onClick={() => setAnchorEl(null)}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default function TopBar({ onToggleSideNav }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: 'primary.main',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle navigation"
          onClick={onToggleSideNav}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              bgcolor: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: 'primary.dark',
              fontSize: 14,
            }}
          >
            HDC
          </Box>
          <Typography
            variant="h4"
            sx={{ color: 'common.white', fontWeight: 700, letterSpacing: 0.4 }}
          >
            Compass
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {NAV_BUTTONS.map((btn) => (
              <TopBarMenu key={btn.key} button={btn} />
            ))}
          </Box>
        )}

        <Tooltip title="Quick add">
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <AddCircleOutline />
          </IconButton>
        </Tooltip>

        <Tooltip title={user?.name ?? 'User'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <UserAvatar user={user} size="md" />
            {!isMobile && (
              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'common.white', fontWeight: 600 }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {user?.organization}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
