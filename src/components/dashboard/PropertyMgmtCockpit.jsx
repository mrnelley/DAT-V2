import RoleCockpit from './RoleCockpit';
import PropertiesMap from './widgets/PropertiesMap';

export default function PropertyMgmtCockpit() {
  return <RoleCockpit flagship={<PropertiesMap />} flagshipTitle="Flagship view" />;
}
