// Compass Calendar — vocabulary and color tokens.
// Backend stays generic ("CalendarItem"); UI surfaces friendly labels.

export const SUBTYPE = {
  WAYPOINT: 'waypoint',
  MARKER: 'marker',
  COMMITMENT: 'commitment',
  TOUCHPOINT: 'touchpoint',
};

export const SUBTYPE_ORDER = [
  SUBTYPE.WAYPOINT,
  SUBTYPE.MARKER,
  SUBTYPE.COMMITMENT,
  SUBTYPE.TOUCHPOINT,
];

export const SUBTYPE_META = {
  [SUBTYPE.WAYPOINT]: {
    label: 'Waypoint',
    description: 'A significant point on the journey.',
    color: 'primary.main',
    soft: 'rgba(7, 44, 94, 0.12)',
    fg: '#072c5e',
    dot: '#072c5e',
  },
  [SUBTYPE.MARKER]: {
    label: 'Marker',
    description: 'A noted point — observation or heads-up.',
    color: 'text.secondary',
    soft: 'rgba(90, 100, 117, 0.14)',
    fg: '#3f4a5c',
    dot: '#5a6475',
  },
  [SUBTYPE.COMMITMENT]: {
    label: 'Commitment',
    description: 'A binding obligation with a deadline.',
    color: 'warning.main',
    soft: 'rgba(241, 172, 73, 0.2)',
    fg: '#8a5a14',
    dot: '#f1ac49',
  },
  [SUBTYPE.TOUCHPOINT]: {
    label: 'Touchpoint',
    description: 'Recurring engagement or contact.',
    color: 'secondary.main',
    soft: 'rgba(94, 184, 168, 0.18)',
    fg: '#2c6e63',
    dot: '#5eb8a8',
  },
};

export const STATUS = {
  ON_COURSE: 'on_course',
  NEEDS_ATTENTION: 'needs_attention',
  OFF_COURSE: 'off_course',
  COMPLETED: 'completed',
  RESCHEDULED: 'rescheduled',
};

export const STATUS_ORDER = [
  STATUS.ON_COURSE,
  STATUS.NEEDS_ATTENTION,
  STATUS.OFF_COURSE,
  STATUS.COMPLETED,
  STATUS.RESCHEDULED,
];

export const STATUS_META = {
  [STATUS.ON_COURSE]: {
    label: 'On Course',
    soft: 'rgba(0, 110, 92, 0.14)',
    fg: '#004d40',
    dot: '#006e5c',
  },
  [STATUS.NEEDS_ATTENTION]: {
    label: 'Needs Attention',
    soft: 'rgba(241, 172, 73, 0.2)',
    fg: '#8a5a14',
    dot: '#f1ac49',
  },
  [STATUS.OFF_COURSE]: {
    label: 'Off Course',
    soft: 'rgba(219, 83, 76, 0.18)',
    fg: '#8a2b27',
    dot: '#db534c',
  },
  [STATUS.COMPLETED]: {
    label: 'Completed',
    soft: 'rgba(7, 44, 94, 0.1)',
    fg: '#072c5e',
    dot: '#072c5e',
  },
  [STATUS.RESCHEDULED]: {
    label: 'Rescheduled',
    soft: 'rgba(94, 184, 168, 0.16)',
    fg: '#2c6e63',
    dot: '#5eb8a8',
  },
};

export const SCOPE = {
  ORG: 'org',
  PERSONAL: 'personal',
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  REJECTED: 'rejected',
};

export const SOURCE_LABEL = {
  priority: 'Connected to Priority',
  initiative: 'Connected to Initiative',
  huddle: 'Connected to Huddle',
  action_item: 'Connected to Action Item',
  manual: null,
};

// Seed list of HDC properties + departments.
// Replace with API-driven options when the backend ships.
export const PROPERTY_OPTIONS = [
  { value: 'org_wide', label: 'Org-wide' },
  { value: 'prop_north_park', label: 'North Park Apartments' },
  { value: 'prop_lakeside', label: 'Lakeside Commons' },
  { value: 'prop_riverbend', label: 'Riverbend Residences' },
  { value: 'prop_oakgrove', label: 'Oak Grove Village' },
  { value: 'dept_operations', label: 'Operations' },
  { value: 'dept_finance', label: 'Finance' },
  { value: 'dept_property_mgmt', label: 'Property Management' },
  { value: 'dept_resident_services', label: 'Resident Services' },
  { value: 'dept_compliance', label: 'Compliance' },
  { value: 'dept_it', label: 'IT' },
  { value: 'dept_hr', label: 'Human Resources' },
];

export const PROPERTY_LABEL = Object.fromEntries(
  PROPERTY_OPTIONS.map((o) => [o.value, o.label]),
);
