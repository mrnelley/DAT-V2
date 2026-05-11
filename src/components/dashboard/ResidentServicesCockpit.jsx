import RoleCockpit from './RoleCockpit';
import ReferralQueue from './widgets/ReferralQueue';

export default function ResidentServicesCockpit() {
  return <RoleCockpit flagship={<ReferralQueue />} flagshipTitle="Flagship view" />;
}
