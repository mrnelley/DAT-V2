import RoleCockpit from './RoleCockpit';
import HiringBoard from './widgets/HiringBoard';

export default function HRCockpit() {
  return <RoleCockpit flagship={<HiringBoard />} flagshipTitle="Flagship view" />;
}
