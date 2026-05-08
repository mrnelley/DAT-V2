import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const SnackbarContext = createContext(null);

const TransitionUp = (props) => <Slide {...props} direction="up" />;

export function SnackbarProvider({ children }) {
  const [state, setState] = useState({ open: false, message: '', severity: 'info' });

  const notify = useCallback((message, severity = 'info') => {
    setState({ open: true, message, severity });
  }, []);

  const close = useCallback((_e, reason) => {
    if (reason === 'clickaway') return;
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(
    () => ({
      notify,
      success: (m) => notify(m, 'success'),
      error: (m) => notify(m, 'error'),
      warning: (m) => notify(m, 'warning'),
      info: (m) => notify(m, 'info'),
    }),
    [notify],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        TransitionComponent={TransitionUp}
      >
        <Alert
          onClose={close}
          severity={state.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export default function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used inside SnackbarProvider');
  return ctx;
}
