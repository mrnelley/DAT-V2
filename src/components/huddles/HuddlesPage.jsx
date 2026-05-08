import { useParams } from 'react-router-dom';
import PlaceholderPage from '../shared/PlaceholderPage';

export default function HuddlesPage() {
  const { id } = useParams();
  return (
    <PlaceholderPage
      eyebrow="Module"
      title={id ? `Huddle: ${id}` : 'Huddles'}
      description="Two-column huddle view: agenda + monthly targets + private notes + documents on the left, members on the right. Stucks button anchored top-right."
      tags={['Agenda', 'Monthly Targets', 'Members', 'Stucks']}
    />
  );
}
