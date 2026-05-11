import { useMemo, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import {
  Box, Card, Stack, Typography, Chip, Button, Divider, LinearProgress, Tooltip,
} from '@mui/material';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import HomeWorkOutlined from '@mui/icons-material/HomeWorkOutlined';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { usePriorities } from '../../../hooks/usePriorities';

// HDC properties — mock geo + portfolio data.
// Coords are real Bay Area locations chosen for demo plausibility.
const PROPERTIES = [
  {
    id: 'prop_north_park', name: 'North Park Apartments', city: 'San Pablo, CA',
    coords: [37.9621, -122.3455],
    units: 32, occupiedUnits: 30, openTickets: 12, vacancyRate: 6.3,
    avgTicketAgeDays: 4.2, ami: 'Mixed 30/60/80%',
    status: 'on_track',
    phase: 'lease-up',
  },
  {
    id: 'prop_lakeside', name: 'Lakeside Commons', city: 'Alameda, CA',
    coords: [37.7652, -122.2416],
    units: 64, occupiedUnits: 62, openTickets: 87, vacancyRate: 3.1,
    avgTicketAgeDays: 8.6, ami: '30/50/60%',
    status: 'at_risk', // roof project drives ticket spike
    phase: 'stabilized',
  },
  {
    id: 'prop_riverbend', name: 'Riverbend Residences', city: 'Oakland, CA',
    coords: [37.7849, -122.2364],
    units: 48, occupiedUnits: 34, openTickets: 24, vacancyRate: 29.2,
    avgTicketAgeDays: 3.1, ami: '50/60/80%',
    status: 'at_risk', // move-in surge in flight
    phase: 'lease-up',
  },
  {
    id: 'prop_oakgrove', name: 'Oak Grove Village', city: 'San Leandro, CA',
    coords: [37.7249, -122.1561],
    units: 56, occupiedUnits: 54, openTickets: 38, vacancyRate: 3.6,
    avgTicketAgeDays: 5.4, ami: '30/60/80%',
    status: 'on_track',
    phase: 'stabilized',
  },
];

const STATUS_COLOR = { on_track: '#006e5c', at_risk: '#f1ac49', off_track: '#db534c' };
const STATUS_LABEL = { on_track: 'Healthy', at_risk: 'Watch', off_track: 'Critical' };

// Build a colored circle DivIcon — avoids the Leaflet asset-path issue
// with Vite (default marker shadows reference broken URLs).
function buildIcon(color) {
  return L.divIcon({
    className: 'hdc-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `
      <div style="
        width:28px;height:28px;border-radius:50%;
        background:${color};
        border:3px solid white;
        box-shadow:0 2px 6px rgba(7,44,94,0.3);
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-weight:700;font-size:11px;
      ">●</div>
    `,
  });
}

const ICONS = {
  on_track: buildIcon('#006e5c'),
  at_risk: buildIcon('#f1ac49'),
  off_track: buildIcon('#db534c'),
};

function MapResetter({ center }) {
  const map = useMap();
  // Recompute size after MUI layout settles
  setTimeout(() => map.invalidateSize(), 200);
  map.setView(center, map.getZoom());
  return null;
}

function PortfolioSummary({ properties }) {
  const totalUnits = properties.reduce((s, p) => s + p.units, 0);
  const totalOccupied = properties.reduce((s, p) => s + p.occupiedUnits, 0);
  const occupancyPct = ((totalOccupied / totalUnits) * 100).toFixed(1);
  const totalTickets = properties.reduce((s, p) => s + p.openTickets, 0);
  const avgAge = (
    properties.reduce((s, p) => s + p.avgTicketAgeDays * p.openTickets, 0) /
    Math.max(1, totalTickets)
  ).toFixed(1);

  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>Portfolio</Typography>
        <Typography variant="h2" sx={{ lineHeight: 1.1 }}>{totalUnits} units</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {properties.length} properties · {totalOccupied} occupied
        </Typography>
      </Box>

      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.25 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Occupancy</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{occupancyPct}%</Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={Number(occupancyPct)}
          sx={{
            height: 6, borderRadius: 3,
            bgcolor: 'rgba(7,44,94,0.06)',
            '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main' },
          }}
        />
      </Box>

      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>Tickets</Typography>
        <Stack direction="row" alignItems="baseline" spacing={0.75}>
          <Typography variant="h4" sx={{ color: totalTickets > 150 ? 'warning.dark' : 'text.primary' }}>
            {totalTickets}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            open · avg age {avgAge}d
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

function PropertyPanel({ property, linkedPriorities, onClose }) {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 2, borderTop: `4px solid ${STATUS_COLOR[property.status]}` }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>Selected property</Typography>
          <Typography variant="h4">{property.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{property.city}</Typography>
        </Box>
        <Chip
          label={STATUS_LABEL[property.status]}
          size="small"
          sx={{ bgcolor: STATUS_COLOR[property.status], color: 'common.white', fontWeight: 700 }}
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ my: 1.5, flexWrap: 'wrap' }}>
        <Stat label="Units" value={property.units} />
        <Stat label="Occupied" value={property.occupiedUnits} />
        <Stat label="Vacancy" value={`${property.vacancyRate}%`} />
        <Stat label="Open tickets" value={property.openTickets} />
        <Stat label="Avg ticket age" value={`${property.avgTicketAgeDays}d`} />
      </Stack>

      <Divider sx={{ my: 1 }} />
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        Linked priorities ({linkedPriorities.length})
      </Typography>
      {linkedPriorities.length === 0 ? (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>None.</Typography>
      ) : (
        <Stack spacing={0.5}>
          {linkedPriorities.map((p) => (
            <Box
              key={p.id}
              component={RouterLink}
              to="/priorities"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                px: 1, py: 0.75, borderRadius: 1.5,
                bgcolor: 'rgba(7,44,94,0.04)',
                '&:hover': { bgcolor: 'rgba(94,184,168,0.1)' },
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {p.isCompany ? 'Company priority' : 'Team priority'} · {p.owner?.name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.title}</Typography>
            </Box>
          ))}
        </Stack>
      )}

      <Button size="small" variant="text" onClick={onClose} sx={{ mt: 1 }}>Clear selection</Button>
    </Box>
  );
}

function Stat({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
    </Box>
  );
}

export default function PropertiesMap() {
  const prioritiesQ = usePriorities();
  const [selectedId, setSelectedId] = useState(null);

  const center = useMemo(() => {
    const avgLat = PROPERTIES.reduce((s, p) => s + p.coords[0], 0) / PROPERTIES.length;
    const avgLng = PROPERTIES.reduce((s, p) => s + p.coords[1], 0) / PROPERTIES.length;
    return [avgLat, avgLng];
  }, []);

  const prioritiesByProp = useMemo(() => {
    const map = {};
    PROPERTIES.forEach((p) => { map[p.id] = []; });
    (prioritiesQ.data ?? []).forEach((pri) => {
      if (map[pri.teamId]) map[pri.teamId].push(pri);
    });
    return map;
  }, [prioritiesQ.data]);

  const selected = selectedId ? PROPERTIES.find((p) => p.id === selectedId) : null;

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ p: { xs: 2, md: 2.5 }, pb: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="overline" sx={{ color: 'secondary.dark' }}>Portfolio Map</Typography>
            <Typography variant="h3">Properties at a glance</Typography>
          </Box>
          <Stack direction="row" spacing={0.75}>
            <LegendDot color="#006e5c" label="Healthy" />
            <LegendDot color="#f1ac49" label="Watch" />
            <LegendDot color="#db534c" label="Critical" />
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, minHeight: 360 }}>
        <Box sx={{ position: 'relative', minHeight: 360, bgcolor: '#e8eef5' }}>
          <MapContainer
            center={center}
            zoom={11}
            style={{ height: '100%', width: '100%', minHeight: 360 }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapResetter center={center} />
            {PROPERTIES.map((p) => (
              <Marker
                key={p.id}
                position={p.coords}
                icon={ICONS[p.status]}
                eventHandlers={{ click: () => setSelectedId(p.id) }}
              >
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{p.city}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.75 }}>
                      <Chip size="small" label={`${p.units} units`} />
                      <Chip size="small" label={`${p.openTickets} tickets`} />
                    </Stack>
                    <Button
                      size="small"
                      onClick={() => setSelectedId(p.id)}
                      sx={{ mt: 0.75, px: 0, minWidth: 'auto' }}
                    >
                      Details →
                    </Button>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>

        <Box sx={{ borderLeft: { md: '1px solid' }, borderTop: { xs: '1px solid', md: 'none' }, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2 }}>
            <PortfolioSummary properties={PROPERTIES} />
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              All properties
            </Typography>
            <Stack spacing={0.75}>
              {PROPERTIES.map((p) => (
                <Box
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    p: 0.75, borderRadius: 1.5, cursor: 'pointer',
                    bgcolor: selectedId === p.id ? 'rgba(94,184,168,0.18)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(94,184,168,0.1)' },
                  }}
                >
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: STATUS_COLOR[p.status] }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{p.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                      {p.occupiedUnits}/{p.units} · {p.openTickets} tickets
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
          {selected && (
            <>
              <Divider />
              <PropertyPanel
                property={selected}
                linkedPriorities={prioritiesByProp[selected.id] ?? []}
                onClose={() => setSelectedId(null)}
              />
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
}

function LegendDot({ color, label }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
    </Stack>
  );
}
