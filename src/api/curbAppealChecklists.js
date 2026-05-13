// Compass Quarterly Commitment — Community Curb Appeal Checklist.
//
// Each community gets a quarterly checklist obligation. Community managers
// fill it out (linked from a Teams Adaptive Card); Jaime reviews + approves;
// approved submissions feed the quarterly portfolio completion priority.
//
// 13 sections, 38 items, sourced from the HDC MidAtlantic PDF (`Curb Appeal
// Checklist.pdf`). Treat this constant as the source of truth — update it
// here and every property's form picks up the new items on next load.

import dayjs from 'dayjs';
import { listProperties } from './properties';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
const newId = () => `chk_${Math.random().toString(36).slice(2, 9)}`;

export const RATING = {
  GOOD: 'good',
  NEEDS_CORRECTION: 'needs_correction',
  NA: 'na',
};

export const RATING_LABEL = {
  good: 'Good',
  needs_correction: 'Needs Correction',
  na: 'N/A',
};

export const RATING_META = {
  good:             { soft: 'rgba(0,110,92,0.14)',   fg: '#004d40', dot: '#006e5c' },
  needs_correction: { soft: 'rgba(219,83,76,0.18)',  fg: '#8a2b27', dot: '#a52a1f' },
  na:               { soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c', dot: '#5a6475' },
};

export const STATUS = {
  NOT_STARTED: 'not_started',
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  RETURNED: 'returned',
};

export const STATUS_LABEL = {
  not_started: 'Not Started',
  draft: 'In Progress',
  submitted: 'Submitted',
  approved: 'Approved',
  returned: 'Returned',
};

// Soft+dark badge pairs (AA-safe per the Section 508 sweep).
export const STATUS_META = {
  not_started: { soft: 'rgba(90,100,117,0.14)', fg: '#3f4a5c', dot: '#5a6475' },
  draft:       { soft: 'rgba(7,44,94,0.1)',     fg: '#072c5e', dot: '#072c5e' },
  submitted:   { soft: 'rgba(241,172,73,0.22)', fg: '#8a5a14', dot: '#a06a14' },
  approved:    { soft: 'rgba(0,110,92,0.14)',   fg: '#004d40', dot: '#006e5c' },
  returned:    { soft: 'rgba(219,83,76,0.18)',  fg: '#8a2b27', dot: '#a52a1f' },
};

// The 13-section, 38-item checklist template — verbatim from the HDC PDF.
export const TEMPLATE = {
  version: 1,
  sections: [
    {
      id: 'landscaping', label: 'Landscaping', items: [
        { id: 'lawns',          label: 'Well-maintained lawns, trees, and shrubs.' },
        { id: 'mowing',         label: 'Regular mowing, trimming, and weeding / snow removal being done.' },
        { id: 'seasonal',       label: 'Seasonal flowers and plants for color and variety.' },
        { id: 'mulch',          label: 'Mulched beds to keep the soil tidy and retain moisture.' },
      ],
    },
    {
      id: 'exterior_maintenance', label: 'Exterior Maintenance', items: [
        { id: 'paint',          label: 'Fresh-looking paint on building exteriors, railings, and doors.' },
        { id: 'siding',         label: 'Cleaned and repaired any siding or stucco.' },
        { id: 'windows',        label: 'Broken or damaged windows replaced.' },
        { id: 'gutters',        label: 'Gutters and downspouts clean and in good repair.' },
        { id: 'walkways',       label: 'Walkways are free and clear of tripping hazards and look good.' },
        { id: 'blinds',         label: 'Blinds are in good condition in all resident units.' },
      ],
    },
    {
      id: 'lighting', label: 'Lighting', items: [
        { id: 'outdoor',        label: 'Adequate outdoor lighting in walkways, entrances, and common areas.' },
        { id: 'emergency',      label: 'All emergency lighting is functional.' },
        { id: 'fixtures',       label: 'All exterior light fixtures clean and in working condition.' },
      ],
    },
    {
      id: 'entrances_exits', label: 'Entrances and Exits', items: [
        { id: 'main_entrance',  label: 'Clean and inviting main entrance with well-maintained doors and hardware.' },
        { id: 'unit_numbers',   label: 'Visible and clearly marked unit numbers.' },
        { id: 'intercom',       label: 'Secure and functional intercom or access system.' },
      ],
    },
    {
      id: 'signage', label: 'Signage', items: [
        { id: 'name_sign',      label: 'Clear and professional signage indicating the apartment complex name and address.' },
        { id: 'directional',    label: 'Directional signs for parking, office, and amenities.' },
      ],
    },
    {
      id: 'parking', label: 'Parking Area', items: [
        { id: 'marking',        label: 'Well-marked parking spots.' },
        { id: 'cleaning',       label: 'Regular cleaning and sweeping of the parking lot.' },
        { id: 'lot_lighting',   label: 'Adequate lighting for safety.' },
        { id: 'lot_landscape',  label: 'Landscaping and greenery in parking lot islands.' },
      ],
    },
    {
      id: 'amenities', label: 'Amenities', items: [
        { id: 'common_areas',   label: 'Clean and well-maintained common areas such as pools, gyms, and lounges.' },
        { id: 'outdoor_seating',label: 'Outdoor seating and gathering areas arranged with comfortable furniture.' },
        { id: 'amenity_insp',   label: 'Regular cleaning and inspections of amenities.' },
      ],
    },
    {
      id: 'trash', label: 'Trash and Recycling', items: [
        { id: 'trash_areas',    label: 'Clearly marked and well-maintained trash and recycling areas.' },
        { id: 'trash_removal',  label: 'Regular trash removal to prevent overflow and odors.' },
      ],
    },
    {
      id: 'exterior_decor', label: 'Exterior Decor', items: [
        { id: 'decorations',    label: 'Thoughtful use of exterior decorations (hanging plants, artwork, seasonal).' },
        { id: 'decor_condition',label: 'Decorations are in good condition and not cluttering the space.' },
      ],
    },
    {
      id: 'security', label: 'Security and Safety', items: [
        { id: 'sec_measures',   label: 'Visible security measures functioning according to scope.' },
        { id: 'fire_routes',    label: 'Clearly marked emergency exits and fire escape routes.' },
      ],
    },
    {
      id: 'mailboxes', label: 'Mailboxes', items: [
        { id: 'mailbox_org',    label: 'Well-organized and labeled mailboxes for easy access.' },
        { id: 'mailbox_maint',  label: 'Regular maintenance and cleaning of the mailbox area.' },
      ],
    },
    {
      id: 'overall_cleanliness', label: 'Overall Cleanliness', items: [
        { id: 'cleaning_common',label: 'Regular cleaning of common areas and windows.' },
        { id: 'pressure_wash',  label: 'Regular pressure washing of exterior surfaces to remove dirt and grime.' },
        { id: 'office_neat',    label: 'Offices are organized and inviting with neat bulletin boards.' },
      ],
    },
    {
      id: 'communication', label: 'Communication', items: [
        { id: 'contact_info',   label: 'Easily accessible contact information for property management or maintenance issues.' },
        { id: 'resident_comms', label: 'Regular communication with residents about upcoming maintenance or events posted in public areas.' },
      ],
    },
  ],
};

export const TOTAL_ITEM_COUNT = TEMPLATE.sections.reduce((s, sec) => s + sec.items.length, 0);

export const currentQuarter = () => {
  const m = dayjs().month(); // 0-11
  return Math.floor(m / 3) + 1;
};
export const currentYear = () => dayjs().year();

// Helper: rating key
export const ratingKey = (sectionId, itemId) => `${sectionId}.${itemId}`;

// Helper: count completed items in a submission
export const countRated = (submission) =>
  Object.keys(submission?.ratings ?? {}).length;

// Helper: extract the items needing correction (for review surface)
export const flaggedItems = (submission) => {
  const flagged = [];
  const r = submission?.ratings ?? {};
  TEMPLATE.sections.forEach((sec) => {
    sec.items.forEach((it) => {
      const k = ratingKey(sec.id, it.id);
      if (r[k]?.rating === RATING.NEEDS_CORRECTION) {
        flagged.push({ sectionLabel: sec.label, itemLabel: it.label, ...r[k] });
      }
    });
  });
  return flagged;
};

// ============================================================================
// In-memory submission store. Seed data scrubbed for the executive scope demo.
//
// With the DB empty, every property defaults to a virtual `not_started`
// submission for the current quarter via `listChecklistsForAllProperties`.
// The TEMPLATE constant above (the real 13-section / 38-item HDC checklist
// from the PDF) is kept — it is the content that gets filled when ops start
// submitting.
// ============================================================================

const JAIME = { id: 'usr_jaime', name: 'Jaime Shillady' };

const Q = currentQuarter();
const Y = currentYear();

let DB = [];

// ============================================================================
// API
// ============================================================================

export async function listChecklists({ quarter, year, status } = {}) {
  await wait();
  const q = quarter ?? Q;
  const y = year ?? Y;
  return DB
    .filter((c) => c.quarter === q && c.year === y)
    .filter((c) => (!status || c.status === status))
    .map((c) => ({ ...c, ratings: { ...c.ratings } }));
}

// Synthetic "join" — return one row per property, with the submission if one
// exists or a virtual `not_started` placeholder otherwise.
export async function listChecklistsForAllProperties({ quarter, year } = {}) {
  await wait();
  const q = quarter ?? Q;
  const y = year ?? Y;
  const props = await listProperties();
  return props.map((prop) => {
    const sub = DB.find((c) => c.propertyId === prop.id && c.quarter === q && c.year === y);
    return {
      property: prop,
      submission: sub ? { ...sub, ratings: { ...sub.ratings } } : {
        id: null, propertyId: prop.id, quarter: q, year: y,
        status: STATUS.NOT_STARTED, submittedBy: null, submittedAt: null,
        reviewer: JAIME, ratings: {},
      },
    };
  });
}

export async function getChecklist({ propertyId, quarter, year } = {}) {
  await wait();
  const q = quarter ?? Q;
  const y = year ?? Y;
  const sub = DB.find((c) => c.propertyId === propertyId && c.quarter === q && c.year === y);
  if (sub) return { ...sub, ratings: { ...sub.ratings } };
  return {
    id: null, propertyId, quarter: q, year: y,
    status: STATUS.NOT_STARTED, submittedBy: null, submittedAt: null,
    reviewer: JAIME, ratings: {},
  };
}

export async function saveDraft({ propertyId, quarter, year, ratings, submittedBy }) {
  await wait();
  const q = quarter ?? Q;
  const y = year ?? Y;
  const existing = DB.find((c) => c.propertyId === propertyId && c.quarter === q && c.year === y);
  if (existing) {
    Object.assign(existing, { ratings: { ...ratings }, status: STATUS.DRAFT });
    return { ...existing };
  }
  const next = {
    id: newId(), propertyId, quarter: q, year: y,
    status: STATUS.DRAFT,
    submittedBy: submittedBy ?? null, submittedAt: null,
    reviewer: JAIME, ratings: { ...ratings },
  };
  DB.push(next);
  return { ...next };
}

export async function submitChecklist({ propertyId, quarter, year, ratings, submittedBy }) {
  await wait();
  const q = quarter ?? Q;
  const y = year ?? Y;
  const existing = DB.find((c) => c.propertyId === propertyId && c.quarter === q && c.year === y);
  const payload = {
    status: STATUS.SUBMITTED,
    submittedBy: submittedBy ?? existing?.submittedBy ?? null,
    submittedAt: new Date().toISOString(),
    reviewer: JAIME, reviewedAt: null, reviewerNote: null,
    ratings: { ...ratings },
  };
  if (existing) {
    Object.assign(existing, payload);
    return { ...existing };
  }
  const next = { id: newId(), propertyId, quarter: q, year: y, ...payload };
  DB.push(next);
  return { ...next };
}

export async function approveChecklist({ id, note }) {
  await wait();
  const it = DB.find((c) => c.id === id);
  if (!it) throw new Error('Checklist not found');
  it.status = STATUS.APPROVED;
  it.reviewedAt = new Date().toISOString();
  it.reviewerNote = note ?? null;
  return { ...it };
}

export async function returnChecklist({ id, note }) {
  await wait();
  const it = DB.find((c) => c.id === id);
  if (!it) throw new Error('Checklist not found');
  it.status = STATUS.RETURNED;
  it.reviewedAt = new Date().toISOString();
  it.reviewerNote = note ?? null;
  return { ...it };
}

// Stats for Jaime's portfolio-completion priority + headers.
export async function checklistStats({ quarter, year } = {}) {
  const rows = await listChecklistsForAllProperties({ quarter, year });
  return rows.reduce((acc, { submission }) => {
    acc.total += 1;
    acc[submission.status] = (acc[submission.status] ?? 0) + 1;
    if (submission.status === STATUS.APPROVED) acc.complete += 1;
    return acc;
  }, { total: 0, complete: 0 });
}
