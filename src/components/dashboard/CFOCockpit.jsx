import RoleCockpit from './RoleCockpit';
import FinancialSnapshot from './widgets/FinancialSnapshot';

export default function CFOCockpit() {
  return <RoleCockpit flagship={<FinancialSnapshot />} flagshipTitle="Flagship view" />;
}
