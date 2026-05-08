import PlaceholderPage from './PlaceholderPage';

export default function AdminPage() {
  return (
    <PlaceholderPage
      eyebrow="ELT Only"
      title="Administration"
      description="Users, teams, roles, integrations, and global settings. Wrapped in a PermissionGate at the route level."
      tags={['Users', 'Teams', 'Integrations']}
    />
  );
}
