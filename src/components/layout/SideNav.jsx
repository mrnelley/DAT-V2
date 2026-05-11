import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Groups from '@mui/icons-material/Groups';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import BarChart from '@mui/icons-material/BarChart';
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import UserAvatar from '../shared/UserAvatar';
import HuddleSidePopout from '../huddles/HuddleSidePopout';

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

const DASHBOARD_SUBITEMS = [
  { label: 'My Dashboard', path: '/dashboard/me' },
  { label: 'Company Dashboard', path: '/dashboard/company' },
  { label: 'Quarterly Initiatives', path: '/initiatives' },
  { label: 'Departmental Workplans', path: '/workplans' },
  { label: 'Data Table', path: '/metrics/table' },
];

const NAV_ITEMS = [
  { key: 'dashboards', label: 'Dashboards', icon: DashboardOutlined, kind: 'submenu' },
  { key: 'priorities', label: 'Priorities', icon: TrendingUp, kind: 'route', path: '/priorities' },
  { key: 'workplans', label: 'Workplans', icon: AccountTreeOutlined, kind: 'route', path: '/workplans' },
  { key: 'huddles', label: 'Huddles', icon: Groups, kind: 'popout' },
  { key: 'action-items', label: 'Action Items', icon: CheckCircleOutlined, kind: 'route', path: '/action-items' },
  { key: 'metrics', label: 'Metrics', icon: BarChart, kind: 'route', path: '/metrics' },
  { key: 'learn', label: 'Learn', icon: SchoolOutlined, kind: 'route', path: '/learn' },
];

function NavRow({ item, expanded, active, onClick, isSubItem = false }) {
  const Icon = item.icon;
  const content = (
    <ListItemButton
      onClick={onClick}
      sx={{
        position: 'relative',
        mx: 1,
        my: 0.25,
        borderRadius: 2,
        pl: isSubItem ? 4 : 1.5,
        color: active ? '#5eb8a8' : 'rgba(255,255,255,0.85)',
        bgcolor: active ? 'rgba(94,184,168,0.18)' : 'transparent',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
        '&::before': active
          ? {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 6,
              bottom: 6,
              width: 3,
              borderRadius: 2,
              bgcolor: '#5eb8a8',
            }
          : undefined,
      }}
    >
      {Icon && (
        <ListItemIcon
          sx={{ minWidth: 0, mr: expanded ? 2 : 0, color: 'inherit', justifyContent: 'center' }}
        >
          <Icon />
        </ListItemIcon>
      )}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ flex: 1, minWidth: 0 }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 600, noWrap: true }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {expanded && item.kind === 'submenu' && (
        item.open ? <ExpandMore sx={{ color: 'inherit' }} /> : <ChevronRight sx={{ color: 'inherit' }} />
      )}
    </ListItemButton>
  );

  return expanded ? content : (
    <Tooltip title={item.label} placement="right" arrow>
      <span>{content}</span>
    </Tooltip>
  );
}

export default function SideNav({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [dashboardsOpen, setDashboardsOpen] = useState(
    location.pathname.startsWith('/dashboard') || location.pathname === '/initiatives' || location.pathname === '/metrics/table',
  );
  const [huddlesOpen, setHuddlesOpen] = useState(false);

  const width = open ? EXPANDED_WIDTH : COLLAPSED_WIDTH;
  const isPathActive = (p) => p && location.pathname.startsWith(p);

  const handleClick = (item) => {
    if (item.kind === 'route') {
      navigate(item.path);
      setHuddlesOpen(false);
    } else if (item.kind === 'submenu') {
      setDashboardsOpen((v) => !v);
    } else if (item.kind === 'popout') {
      setHuddlesOpen((v) => !v);
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          component: motion.div,
          animate: { width },
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        }}
        sx={{
          width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width,
            top: 64,
            height: 'calc(100% - 64px)',
            bgcolor: 'primary.main',
            color: 'common.white',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <List sx={{ flex: 1, py: 1 }}>
          {NAV_ITEMS.map((item) => {
            const active =
              (item.kind === 'route' && isPathActive(item.path)) ||
              (item.kind === 'submenu' && (location.pathname.startsWith('/dashboard') || location.pathname === '/initiatives' || location.pathname === '/metrics/table')) ||
              (item.kind === 'popout' && huddlesOpen);
            const decorated = item.kind === 'submenu' ? { ...item, open: dashboardsOpen } : item;
            return (
              <Box key={item.key}>
                <NavRow
                  item={decorated}
                  expanded={open}
                  active={active}
                  onClick={() => handleClick(item)}
                />
                {item.kind === 'submenu' && (
                  <Collapse in={open && dashboardsOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {DASHBOARD_SUBITEMS.map((sub) => (
                        <NavRow
                          key={sub.path}
                          item={{ label: sub.label }}
                          expanded={open}
                          isSubItem
                          active={isPathActive(sub.path)}
                          onClick={() => navigate(sub.path)}
                        />
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        <Box
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: open ? 'flex-start' : 'center',
          }}
        >
          <UserAvatar user={user} size="sm" sx={{ bgcolor: 'secondary.main', color: 'primary.dark' }} />
          {open && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ color: 'common.white', fontWeight: 600, lineHeight: 1.2 }} noWrap>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }} noWrap>
                {user?.roles?.[0] ?? 'Member'}
              </Typography>
            </Box>
          )}
          {open && (
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              <SettingsOutlined fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Drawer>

      <HuddleSidePopout
        open={huddlesOpen}
        leftOffset={width}
        onClose={() => setHuddlesOpen(false)}
      />
    </>
  );
}
