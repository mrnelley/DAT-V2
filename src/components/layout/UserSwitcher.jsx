import { useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  Divider,
  Chip,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import UserAvatar from '../shared/UserAvatar';

export default function UserSwitcher({ compact = false }) {
  const { user, allUsers, switchUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Tooltip title="Switch persona (demo mode)">
        <Box
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 1,
            px: 1,
            py: 0.5,
            border: 'none',
            background: 'rgba(255,255,255,0.08)',
            color: 'inherit',
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': { background: 'rgba(255,255,255,0.15)' },
          }}
        >
          <UserAvatar user={user} size="md" />
          {!compact && (
            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ color: 'common.white', fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {user.title}
              </Typography>
            </Box>
          )}
          <KeyboardArrowDown sx={{ color: 'rgba(255,255,255,0.8)' }} />
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: { mt: 1, minWidth: 320, borderRadius: 2 },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.25, bgcolor: 'rgba(7,44,94,0.04)', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Demo mode
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            Each persona sees a dashboard shaped to their role.
          </Typography>
        </Box>

        {allUsers.map((u) => {
          const active = u.id === user.id;
          return (
            <MenuItem
              key={u.id}
              onClick={() => {
                switchUser(u.id);
                setAnchorEl(null);
              }}
              sx={{
                py: 1.25,
                bgcolor: active ? 'rgba(94,184,168,0.12)' : 'transparent',
                borderLeft: active ? '3px solid #5eb8a8' : '3px solid transparent',
              }}
            >
              <ListItemAvatar>
                <UserAvatar user={u} size="md" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{u.name}</Typography>
                    {active && <CheckCircleOutlined fontSize="small" sx={{ color: 'secondary.main' }} />}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {u.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={u.tagline}
                      sx={{ mt: 0.5, bgcolor: 'rgba(7,44,94,0.06)', fontSize: 10, height: 18 }}
                    />
                  </Box>
                }
              />
            </MenuItem>
          );
        })}
        <Divider />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Replaced with Microsoft Entra ID / Supabase auth before production.
          </Typography>
        </Box>
      </Menu>
    </>
  );
}
