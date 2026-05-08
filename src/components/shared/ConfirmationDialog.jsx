import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion.create('div');

export default function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onCancel}
          PaperComponent={(props) => (
            <MotionPaper
              {...props}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 0,
                minWidth: 360,
                ...props.style,
              }}
            />
          )}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: destructive ? 'rgba(219,83,76,0.12)' : 'rgba(241,172,73,0.18)',
                color: destructive ? 'error.main' : 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningAmberOutlined fontSize="small" />
            </Box>
            {title}
          </DialogTitle>
          {description && (
            <DialogContent>
              <DialogContentText sx={{ color: 'text.secondary' }}>
                {description}
              </DialogContentText>
            </DialogContent>
          )}
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={onCancel} variant="text" color="inherit">
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              color={destructive ? 'error' : 'primary'}
              autoFocus
            >
              {confirmLabel}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
