import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TouchpointDialog from './TouchpointDialog';
import { useCreateTouchpoint } from '../../hooks/useTouchpoints';
import useSnackbar from '../shared/GlobalSnackbar';

const Ctx = createContext(null);

export function TouchpointDialogProvider({ children }) {
  const [state, setState] = useState({ open: false, seed: null });
  const create = useCreateTouchpoint();
  const snackbar = useSnackbar();

  const close = useCallback(() => setState({ open: false, seed: null }), []);
  const openLog = useCallback((seed = null) => setState({ open: true, seed }), []);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await create.mutateAsync(values);
        snackbar.success('Touchpoint logged.');
        close();
      } catch {
        snackbar.error('Could not log touchpoint.');
      }
    },
    [create, snackbar, close],
  );

  const value = useMemo(() => ({ openLog, close }), [openLog, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <TouchpointDialog
        open={state.open}
        seed={state.seed}
        onClose={close}
        onSubmit={handleSubmit}
      />
    </Ctx.Provider>
  );
}

export default function useLogTouchpoint() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLogTouchpoint must be used inside TouchpointDialogProvider');
  return ctx;
}
