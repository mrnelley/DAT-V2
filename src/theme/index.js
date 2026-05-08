import { createTheme } from '@mui/material/styles';

const buildShadow = (y, blur, alpha) =>
  `0px ${y}px ${blur}px rgba(7, 44, 94, ${alpha})`;

const shadows = [
  'none',
  buildShadow(2, 8, 0.07),
  buildShadow(4, 16, 0.1),
  buildShadow(6, 20, 0.12),
  buildShadow(8, 24, 0.14),
  buildShadow(10, 28, 0.15),
  buildShadow(12, 32, 0.16),
  buildShadow(14, 36, 0.17),
  buildShadow(16, 40, 0.18),
  buildShadow(18, 44, 0.19),
  buildShadow(20, 48, 0.2),
  buildShadow(22, 52, 0.21),
  buildShadow(24, 56, 0.22),
  buildShadow(26, 60, 0.23),
  buildShadow(28, 64, 0.24),
  buildShadow(30, 68, 0.25),
  buildShadow(32, 72, 0.26),
  buildShadow(34, 76, 0.27),
  buildShadow(36, 80, 0.28),
  buildShadow(38, 84, 0.29),
  buildShadow(40, 88, 0.3),
  buildShadow(42, 92, 0.31),
  buildShadow(44, 96, 0.32),
  buildShadow(46, 100, 0.33),
  buildShadow(48, 104, 0.34),
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#072c5e',
      light: '#1a4a80',
      dark: '#041e42',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5eb8a8',
      light: '#88cfc2',
      dark: '#3d9585',
      contrastText: '#ffffff',
    },
    error: {
      main: '#db534c',
      light: '#e47d78',
      dark: '#b03a34',
    },
    warning: {
      main: '#f1ac49',
      light: '#f5c478',
      dark: '#c98a2a',
    },
    success: {
      main: '#006e5c',
      light: '#339980',
      dark: '#004d40',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
      accent: '#efdc9c',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#5a6475',
    },
    divider: '#e0e4ea',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700, color: '#072c5e' },
    h2: { fontSize: '1.5rem', fontWeight: 600, color: '#072c5e' },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8rem', color: '#5a6475' },
    caption: { fontSize: '0.72rem', color: '#5a6475' },
    overline: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em' },
  },
  shape: { borderRadius: 10 },
  shadows,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(7,44,94,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
        containedPrimary: { background: '#072c5e' },
        containedSecondary: { background: '#5eb8a8' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600, fontSize: '0.72rem' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: 'none', background: '#072c5e' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, minWidth: 80 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { background: '#f0f4f8' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 8 },
      },
    },
  },
});

export default theme;
