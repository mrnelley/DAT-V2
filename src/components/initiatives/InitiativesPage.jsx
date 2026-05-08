import { useParams } from 'react-router-dom';
import PlaceholderPage from '../shared/PlaceholderPage';
import PermissionGate from '../shared/PermissionGate';
import { Button, Stack } from '@mui/material';
import { ROLES } from '../../utils/permissions';

export default function InitiativesPage() {
  const { id } = useParams();
  return (
    <PlaceholderPage
      eyebrow="Module"
      title={id ? `Initiative ${id}` : 'Annual Initiatives'}
      description="Card grid of yearly initiatives. ELT users see Add and Delete actions; everyone else gets a read-only view."
      tags={['Initiative Cards', 'Connected Priorities', 'ELT Gated Actions']}
    >
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <PermissionGate roles={[ROLES.ELT]}>
          <Button variant="contained">Add Initiative</Button>
        </PermissionGate>
      </Stack>
    </PlaceholderPage>
  );
}
