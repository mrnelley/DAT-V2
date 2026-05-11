import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import CalendarItemDialog from '../calendar/CalendarItemDialog';
import { useCreateCalendarItem, useUpdateCalendarItem } from '../../hooks/useCalendar';
import useSnackbar from './GlobalSnackbar';
import { SCOPE } from '../../utils/calendarTokens';

const CalendarDialogContext = createContext(null);

export function CalendarDialogProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    mode: 'create',
    seed: null,
    initialItem: null,
    defaultScope: SCOPE.ORG,
  });

  const createItem = useCreateCalendarItem();
  const updateItem = useUpdateCalendarItem();
  const snackbar = useSnackbar();

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  const openCreate = useCallback((options = {}) => {
    setState({
      open: true,
      mode: 'create',
      seed: options.seed ?? null,
      initialItem: null,
      defaultScope: options.defaultScope ?? SCOPE.ORG,
    });
  }, []);

  const openEdit = useCallback((item) => {
    setState({
      open: true,
      mode: 'edit',
      seed: null,
      initialItem: item,
      defaultScope: item?.scope ?? SCOPE.ORG,
    });
  }, []);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        if (state.mode === 'edit' && state.initialItem) {
          await updateItem.mutateAsync({ id: state.initialItem.id, patch: values });
          snackbar.success('Calendar item updated.');
        } else {
          await createItem.mutateAsync({ ...values, scope: state.defaultScope });
          snackbar.success(
            state.defaultScope === SCOPE.ORG
              ? 'Added to Compass Calendar.'
              : 'Added to your personal calendar.',
          );
        }
        close();
      } catch (e) {
        snackbar.error('Could not save calendar item.');
      }
    },
    [state, updateItem, createItem, snackbar, close],
  );

  const value = useMemo(
    () => ({ openCreate, openEdit, close }),
    [openCreate, openEdit, close],
  );

  return (
    <CalendarDialogContext.Provider value={value}>
      {children}
      <CalendarItemDialog
        open={state.open}
        mode={state.mode}
        seed={state.seed}
        initialItem={state.initialItem}
        onClose={close}
        onSubmit={handleSubmit}
      />
    </CalendarDialogContext.Provider>
  );
}

export default function useAddToCalendar() {
  const ctx = useContext(CalendarDialogContext);
  if (!ctx) throw new Error('useAddToCalendar must be used inside CalendarDialogProvider');
  return ctx;
}
