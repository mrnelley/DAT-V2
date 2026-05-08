export const STATUS_COLOR_TOKEN = {
  on_track: 'success.main',
  at_risk: 'warning.main',
  off_track: 'error.main',
  complete: 'success.main',
  no_data: 'text.secondary',
  neutral: 'primary.main',
};

export const STATUS_LABEL = {
  on_track: 'On Track',
  at_risk: 'At Risk',
  off_track: 'Off Track',
  complete: 'Complete',
  no_data: 'No Data',
  neutral: 'Neutral',
};

export const statusFromPercent = (percent) => {
  if (percent == null) return 'no_data';
  if (percent >= 80) return 'on_track';
  if (percent >= 50) return 'at_risk';
  return 'off_track';
};
