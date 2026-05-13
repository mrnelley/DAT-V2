import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import queryClient from './store/queryClient';
import { AuthProvider } from './hooks/useAuth';
import { SnackbarProvider } from './components/shared/GlobalSnackbar';
import { CalendarDialogProvider } from './components/shared/CalendarDialogProvider';
import { TouchpointDialogProvider } from './components/touchpoints/TouchpointDialogProvider';
import AppShell from './components/layout/AppShell';
import DashboardPage from './components/dashboard/DashboardPage';
import PrioritiesPage from './components/priorities/PrioritiesPage';
import HuddlesPage from './components/huddles/HuddlesPage';
import StucksPage from './components/stucks/StucksPage';
import MetricsPage from './components/metrics/MetricsPage';
import DataTablePage from './components/metrics/DataTablePage';
import InitiativesPage from './components/initiatives/InitiativesPage';
import InitiativeDetailPage from './components/initiatives/InitiativeDetailPage';
import WorkplansPage from './components/workplans/WorkplansPage';
import WorkplanDetailPage from './components/workplans/WorkplanDetailPage';
import CurbAppealChecklistsHub from './components/checklists/CurbAppealChecklistsHub';
import CurbAppealChecklistPage from './components/checklists/CurbAppealChecklistPage';
import ActionItemsPage from './components/action-items/ActionItemsPage';
import LearnPage from './components/shared/LearnPage';
import AdminPage from './components/shared/AdminPage';
import NotFoundPage from './components/shared/NotFoundPage';
import PermissionGate from './components/shared/PermissionGate';
import { ROLES } from './utils/permissions';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SnackbarProvider>
            <CalendarDialogProvider>
              <TouchpointDialogProvider>
                <BrowserRouter>
                  <Routes>
                    <Route element={<AppShell />}>
                      <Route index element={<Navigate to="/dashboard/me" replace />} />
                      <Route path="dashboard/:scope" element={<DashboardPage />} />
                      <Route path="dashboard" element={<Navigate to="/dashboard/me" replace />} />
                      <Route path="priorities" element={<PrioritiesPage />} />
                      <Route path="initiatives" element={<InitiativesPage />} />
                      <Route path="initiatives/:id" element={<InitiativeDetailPage />} />
                      <Route path="workplans" element={<WorkplansPage />} />
                      <Route path="workplans/:id" element={<WorkplanDetailPage />} />
                      <Route path="checklists/curb-appeal" element={<CurbAppealChecklistsHub />} />
                      <Route path="checklists/curb-appeal/:propertyId" element={<CurbAppealChecklistPage />} />
                      <Route path="huddles" element={<HuddlesPage />} />
                      <Route path="huddles/:id" element={<HuddlesPage />} />
                      <Route path="stucks" element={<StucksPage />} />
                      <Route path="action-items" element={<ActionItemsPage />} />
                      <Route path="metrics" element={<MetricsPage />} />
                      <Route path="metrics/table" element={<DataTablePage />} />
                      <Route path="learn" element={<LearnPage />} />
                      <Route
                        path="admin"
                        element={
                          <PermissionGate roles={[ROLES.ELT]} fallback={<NotFoundPage />}>
                            <AdminPage />
                          </PermissionGate>
                        }
                      />
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </TouchpointDialogProvider>
            </CalendarDialogProvider>
          </SnackbarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
