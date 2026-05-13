import { Box, Typography, ListItemButton, ListItemText, IconButton } from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Seed data scrubbed for the executive scope demo. Wire to a real
// `useHuddles()` query when the huddles module gains its data layer.
const STUB_HUDDLES = { today: [], future: [] };

function HuddleList({ items, onSelect }) {
  return items.map((huddle) => (
    <ListItemButton
      key={huddle.id}
      onClick={() => onSelect(huddle.id)}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        '&:hover': { bgcolor: 'rgba(94,184,168,0.1)' },
      }}
    >
      <ListItemText
        primary={huddle.name}
        secondary={huddle.recurrence}
        primaryTypographyProps={{ fontWeight: 600 }}
        secondaryTypographyProps={{ variant: 'caption' }}
      />
      <ChevronRight sx={{ color: 'text.secondary' }} />
    </ListItemButton>
  ));
}

export default function HuddleSidePopout({ open, leftOffset = 64, onClose }) {
  const navigate = useNavigate();
  const handleSelect = (id) => {
    navigate(`/huddles/${id}`);
    onClose?.();
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: -260, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -260, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            position: 'fixed',
            top: 64,
            left: leftOffset,
            bottom: 0,
            width: 260,
            zIndex: 1100,
          }}
        >
          <Box
            sx={{
              height: '100%',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h4">Huddles</Typography>
              <IconButton size="small" onClick={onClose}>
                <Close fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
              <Typography variant="overline" sx={{ pl: 1, color: 'text.secondary' }}>
                Today
              </Typography>
              {STUB_HUDDLES.today.length === 0 ? (
                <Typography variant="caption" sx={{ pl: 1, color: 'text.secondary', display: 'block', mb: 1 }}>
                  No huddles scheduled.
                </Typography>
              ) : (
                <HuddleList items={STUB_HUDDLES.today} onSelect={handleSelect} />
              )}
              <Typography
                variant="overline"
                sx={{ pl: 1, mt: 2, display: 'block', color: 'text.secondary' }}
              >
                Future
              </Typography>
              {STUB_HUDDLES.future.length === 0 ? (
                <Typography variant="caption" sx={{ pl: 1, color: 'text.secondary', display: 'block' }}>
                  No huddles scheduled.
                </Typography>
              ) : (
                <HuddleList items={STUB_HUDDLES.future} onSelect={handleSelect} />
              )}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
