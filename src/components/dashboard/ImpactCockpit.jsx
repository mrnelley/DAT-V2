import RoleCockpit from './RoleCockpit';
import FundraisingPipeline from './widgets/FundraisingPipeline';

export default function ImpactCockpit() {
  return <RoleCockpit flagship={<FundraisingPipeline />} flagshipTitle="Flagship view" />;
}
