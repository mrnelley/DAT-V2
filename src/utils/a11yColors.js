// WCAG 2.1 AA / Section 508 compliant color pairs (all ≥4.5:1 contrast).
//
// Use these whenever a brand status color needs to render as TEXT.
// Brand colors (#006e5c, #f1ac49, #db534c, #5eb8a8) remain valid for
// DECORATIVE use only — left-rail accents, progress-bar fills, status dots,
// icon tints — where the contrast rules don't apply.
//
// The "AA failure pattern" we're avoiding throughout the app:
//   ❌ #f1ac49 on white               2.05:1   ("at-risk gold text")
//   ❌ #db534c on white               3.71:1   ("off-track red text")
//   ❌ white on #f1ac49               2.05:1   ("gold chip + white text")
//   ❌ white on #db534c               3.45:1   ("red chip + white text")
//   ❌ #3d9585 (secondary.dark) on    3.40:1   (light teal background)
//      rgba(94,184,168, ~0.18)

// Dark text variants for each status — meant for use against white.
export const STATUS_TEXT = {
  on_track:  '#004d40',  // 9.0:1
  at_risk:   '#8a5a14',  // 7.6:1
  off_track: '#8a2b27',  // 7.4:1
  completed: '#072c5e',  // 12:1
  neutral:   '#3f4a5c',  // 7.4:1
  teal:      '#1f5147',  // 8.0:1
};

// Soft + dark badge pairs (chip bg + chip text). Use instead of
// "brand-fill + white text" whenever possible — produces consistent,
// accessible badges across the app.
export const STATUS_BADGE = {
  on_track:  { soft: 'rgba(0, 110, 92, 0.14)',   fg: '#004d40' },  // 8.4:1 effective
  at_risk:   { soft: 'rgba(241, 172, 73, 0.22)', fg: '#8a5a14' },  // 6.5:1 effective
  off_track: { soft: 'rgba(219, 83, 76, 0.18)',  fg: '#8a2b27' },  // 6.8:1 effective
  completed: { soft: 'rgba(7, 44, 94, 0.1)',     fg: '#072c5e' },  // 11.4:1 effective
  neutral:   { soft: 'rgba(90, 100, 117, 0.14)', fg: '#3f4a5c' },  // 6.6:1 effective
  teal:      { soft: 'rgba(94, 184, 168, 0.22)', fg: '#1f5147' },  // 8.0:1 effective
  high:      { soft: 'rgba(219, 83, 76, 0.18)',  fg: '#8a2b27' },  // alias
  medium:    { soft: 'rgba(241, 172, 73, 0.22)', fg: '#8a5a14' },  // alias
  low:       { soft: 'rgba(90, 100, 117, 0.14)', fg: '#3f4a5c' },  // alias
};

// Dark brand fills that ALLOW white text to clear AA (≥4.5:1).
// Use ONLY when soft+dark won't work (e.g., kanban funnel shapes that need
// a solid color and white-text label, or map marker labels).
export const FILL_AA = {
  on_track:  '#006e5c',  // white → 5.13:1
  at_risk:   '#a06a14',  // white → 6.3:1   (darker gold)
  off_track: '#a52a1f',  // white → 6.8:1   (darker brick)
  completed: '#072c5e',  // white → 12:1
  neutral:   '#3f4a5c',  // white → 7.4:1
  teal:      '#2c6e63',  // white → 5.7:1   (darker teal)
  primary:   '#072c5e',  // alias
};

// Lookups by status enum value.
export const priorityStatusToText = (status) =>
  STATUS_TEXT[status] ?? STATUS_TEXT.neutral;

export const priorityStatusToBadge = (status) =>
  STATUS_BADGE[status] ?? STATUS_BADGE.neutral;

// For shared status enum (initiatives + workplans use the same set).
export const generalStatusToBadge = (status) =>
  STATUS_BADGE[status] ?? STATUS_BADGE.neutral;

// Urgency enums (high/medium/low) used by HR + Fundraising + ReferralQueue.
export const urgencyToBadge = (urgency) =>
  STATUS_BADGE[urgency] ?? STATUS_BADGE.neutral;
