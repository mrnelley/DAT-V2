import { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import CircleCard from './CircleCard';
import CircleDrawer from './CircleDrawer';
import { useCircles } from '../../hooks/useCircles';

export default function CirclesGrid() {
  const circlesQ = useCircles();
  const [selectedId, setSelectedId] = useState(null);

  if (circlesQ.isLoading) {
    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
        {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} variant="rounded" height={172} />)}
      </Box>
    );
  }

  return (
    <>
      <Box
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {(circlesQ.data ?? []).map((c) => (
          <motion.div
            key={c.id}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }}
          >
            <CircleCard circle={c} onClick={(circle) => setSelectedId(circle.id)} />
          </motion.div>
        ))}
      </Box>
      <CircleDrawer
        circleId={selectedId}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
