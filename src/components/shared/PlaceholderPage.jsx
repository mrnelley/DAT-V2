import { Box, Typography, Stack, Chip } from '@mui/material';
import ConstructionOutlined from '@mui/icons-material/ConstructionOutlined';
import PageWrapper from '../layout/PageWrapper';

export default function PlaceholderPage({ title, eyebrow, description, tags = [] }) {
  return (
    <PageWrapper>
      <Stack spacing={1} sx={{ mb: 3 }}>
        {eyebrow && (
          <Typography variant="overline" sx={{ color: 'secondary.dark' }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h1">{title}</Typography>
        {description && (
          <Typography variant="body2" sx={{ maxWidth: 720 }}>
            {description}
          </Typography>
        )}
        {tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {tags.map((t) => (
              <Chip key={t} label={t} size="small" />
            ))}
          </Stack>
        )}
      </Stack>

      <Box
        sx={{
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: 'background.paper',
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <ConstructionOutlined sx={{ fontSize: 56, mb: 2, color: 'secondary.main' }} />
        <Typography variant="h3" sx={{ color: 'text.primary', mb: 1 }}>
          Module under construction
        </Typography>
        <Typography variant="body2" sx={{ maxWidth: 480 }}>
          Shell, theme, navigation and shared components are wired up. Real module
          content lands in the next pass per the development sequence in §17 of the
          brief.
        </Typography>
      </Box>
    </PageWrapper>
  );
}
