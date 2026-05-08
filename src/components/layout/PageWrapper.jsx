import { motion } from 'framer-motion';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

export default function PageWrapper({ children }) {
  const reduced = usePrefersReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 12 };
  const animate = reduced ? { opacity: 1 } : { opacity: 1, y: 0 };
  const exit = reduced ? { opacity: 0 } : { opacity: 0, y: -8 };
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}
