import { useState } from 'react';
import {
  Box,
  Typography,
  Badge,
  Popover,
  Stack,
  Button,
  Chip,
} from '@mui/material';
import PendingActionsOutlined from '@mui/icons-material/PendingActionsOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import SubtypeChip from './SubtypeChip';
import { formatDateTime } from '../../utils/formatters';
import { PROPERTY_LABEL } from '../../utils/calendarTokens';

export default function PendingApprovalTray({ items = [], onSelect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const count = items.length;

  return (
    <>
      <Button
        variant={count > 0 ? 'contained' : 'outlined'}
        color="warning"
        startIcon={
          <Badge badgeContent={count} color="error" max={9}>
            <PendingActionsOutlined />
          </Badge>
        }
        onClick={(e) => count > 0 && setAnchorEl(e.currentTarget)}
        disabled={count === 0}
        sx={{ color: count > 0 ? 'common.white' : 'text.secondary' }}
      >
        Pending Approval
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 380, maxHeight: 480, mt: 1, borderRadius: 3 },
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h4">Awaiting your review</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Personal items submitted to the Compass Calendar
          </Typography>
        </Box>

        <Box sx={{ overflowY: 'auto', maxHeight: 380 }}>
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <Box
                  onClick={() => {
                    setAnchorEl(null);
                    onSelect?.(it);
                  }}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: 'pointer',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'rgba(94,184,168,0.08)' },
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                    <SubtypeChip subtype={it.subtype} />
                    {it.owner && (
                      <Chip
                        size="small"
                        label={`from ${it.owner.name}`}
                        sx={{ bgcolor: 'rgba(7,44,94,0.08)', textTransform: 'none' }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {it.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatDateTime(it.startsAt)} ·{' '}
                    {PROPERTY_LABEL[it.propertyOrDepartment] ?? '—'}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      </Popover>
    </>
  );
}
