import RoleCockpit from './RoleCockpit';
import DevelopmentPipeline from './widgets/DevelopmentPipeline';

export default function RealEstateCockpit() {
  return <RoleCockpit flagship={<DevelopmentPipeline />} flagshipTitle="Flagship view" />;
}
