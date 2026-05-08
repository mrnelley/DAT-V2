import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import SideNav from './SideNav';

export default function AppShell() {
  const [navOpen, setNavOpen] = useState(true);
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <TopBar onToggleSideNav={() => setNavOpen((v) => !v)} />
      <SideNav open={navOpen} onClose={() => setNavOpen(false)} />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
