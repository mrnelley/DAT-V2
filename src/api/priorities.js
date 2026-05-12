// In-memory mock API for Priorities.
import dayjs from 'dayjs';

const wait = (ms = 100) => new Promise((r) => setTimeout(r, ms));
const newId = () => `pri_${Math.random().toString(36).slice(2, 9)}`;

export const MEASUREMENT = {
  NUMBER: 'number',
  TASK: 'task',
  ROLLUP: 'rollup',
};

export const PRIORITY_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OFF_TRACK: 'off_track',
};

export const TIME_SCOPE = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
};

export const TIME_SCOPE_LABEL = {
  week: 'This week',
  month: 'This month',
  quarter: 'This quarter',
};

// Build a 13-week heatmap leading up to today (current date 2026-05-11).
function buildHeatmap(pattern) {
  const today = dayjs();
  return pattern.map((status, idx) => ({
    week: pattern.length - idx,
    weekStart: today.subtract(pattern.length - 1 - idx, 'week').startOf('week').format('YYYY-MM-DD'),
    status,
  }));
}

const STUB_OWNERS = {
  dana:    { id: 'usr_dana',    name: 'Dana Hanchin',     initials: 'DH' },
  sam:     { id: 'usr_sam',     name: 'Sam Jordan',       initials: 'SJ' },
  kim:     { id: 'usr_kim',     name: 'Kim Krauter',      initials: 'KK' },
  jaime:   { id: 'usr_jaime',   name: 'Jaime Shillady',   initials: 'JS' },
  michele: { id: 'usr_michele', name: 'Michele Stauffer', initials: 'MS' },
  meg:     { id: 'usr_meg',     name: 'Meg Struck',       initials: 'MS' },
  michael: { id: 'usr_michael', name: 'Michael Sedoti',   initials: 'MS' },
};

// Helper to build per-priority shape
const adv = (id, props) => ({
  id,
  isCompany: true,
  isMine: true,
  owner: STUB_OWNERS.dana,
  measurement: MEASUREMENT.NUMBER,
  status: PRIORITY_STATUS.ON_TRACK,
  ...props,
});

let DB = [
  // Dana's advocacy priorities (linked to workplans → initiatives).
  adv('pri_adv_001', {
    title: 'Lock SB-241 co-authorship — ≥3 committee members',
    context:
      'Three confirmed co-authors gives us the floor calendar leverage we need. Currently 1 confirmed (Sen. Chen), 1 strong-lean (Yelchin), and 1 cold (Park).',
    teamId: 'dept_advocacy',
    workplanId: 'wp_state_engage',
    initiativeId: 'init_sb241',
    timeScope: TIME_SCOPE.WEEK,
    start: 0, current: 1, target: 3, unit: ' co-authors',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(10, 'day').toISOString(),
    heatmap: buildHeatmap(['nd','nd','nd','on','on','on','on','at','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  }),
  adv('pri_adv_002', {
    title: 'Confirm $4M in soft commitments by end of Q2',
    context:
      'Ford, JPMC, Wells Fargo CDF. Ford verbal $2M expansion. JPMC pending Q3 outcomes refresh. Wells Fargo Q3 product cycle.',
    teamId: 'dept_advocacy',
    workplanId: 'wp_funder_cultivate',
    initiativeId: 'init_federal_coalition',
    timeScope: TIME_SCOPE.QUARTER,
    measurement: MEASUREMENT.NUMBER,
    start: 0, current: 2.5, target: 4, unit: 'M',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(45, 'day').toISOString(),
    heatmap: buildHeatmap(['nd','nd','on','on','on','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  }),
  adv('pri_adv_003', {
    title: 'Execute coalition press conference + joint statement',
    context:
      'Coalition press moment co-anchored by 7+ orgs. Statement signed; press event needs venue + speakers locked.',
    teamId: 'dept_advocacy',
    workplanId: 'wp_coalition_active',
    initiativeId: 'init_ba_coalition',
    timeScope: TIME_SCOPE.MONTH,
    measurement: MEASUREMENT.TASK,
    start: 0, current: 4, target: 8, unit: ' tasks',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(22, 'day').toISOString(),
    heatmap: buildHeatmap(['nd','nd','nd','on','on','at','at','at','off','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  }),
  adv('pri_adv_004', {
    title: 'Place ≥2 resident-authored op-eds this quarter',
    context:
      'Op-ed in Bay Area Herald drafted (Roxanne confirmed 5/18). Second op-ed: SF Chronicle, resident Brenda Johnson coaching in progress.',
    teamId: 'dept_advocacy',
    workplanId: 'wp_press_pipeline',
    initiativeId: 'init_resident_voice',
    timeScope: TIME_SCOPE.QUARTER,
    measurement: MEASUREMENT.NUMBER,
    start: 0, current: 1, target: 2, unit: ' op-eds',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(35, 'day').toISOString(),
    heatmap: buildHeatmap(['nd','nd','nd','nd','nd','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  }),
  adv('pri_adv_005', {
    title: 'Complete listening sessions at all 4 properties',
    context: 'North Park done. Lakeside scheduled. Oak Grove + Riverbend unsched.',
    teamId: 'dept_advocacy',
    workplanId: 'wp_resident_amplify',
    initiativeId: 'init_resident_voice',
    timeScope: TIME_SCOPE.QUARTER,
    measurement: MEASUREMENT.TASK,
    start: 0, current: 1, target: 4, unit: ' sessions',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(60, 'day').toISOString(),
    heatmap: buildHeatmap(['nd','nd','nd','nd','nd','nd','nd','nd','nd','nd','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  }),
  adv('pri_adv_006', {
    title: 'Brief 5 wavering committee members on Section 8 reform',
    context: 'Specific outreach to mid-stage members. Asm. Okonkwo + 4 others.',
    teamId: 'dept_advocacy',
    workplanId: 'wp_state_engage',
    initiativeId: 'init_sb241',
    timeScope: TIME_SCOPE.WEEK,
    measurement: MEASUREMENT.TASK,
    start: 0, current: 2, target: 5, unit: ' briefings',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(7, 'day').toISOString(),
    heatmap: buildHeatmap(['nd','nd','nd','nd','nd','nd','on','on','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  }),

  // Pre-existing operational priorities (other ELT-owned)
  {
    id: 'pri_001',
    title: 'Increase Resident Renewal Rate to 92%',
    context:
      'Renewals are the cheapest, highest-quality source of stable occupancy. Each percentage point ~= $180k annualized.',
    owner: STUB_OWNERS.jaime,
    teamId: 'dept_property_mgmt',
    isCompany: true,
    isMine: false,
    measurement: MEASUREMENT.NUMBER,
    start: 87,
    current: 89.4,
    target: 92,
    unit: '%',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(40, 'day').toISOString(),
    heatmap: buildHeatmap([
      'on', 'on', 'on', 'on', 'on', 'on', 'on', 'on',
      'at', 'on', 'at', 'on', 'at',
    ].map((s) => ({ on: 'on_track', at: 'at_risk', off: 'off_track', nd: 'no_data' }[s]))),
  },
  {
    id: 'pri_002',
    title: 'Close Q2 Financials by July 15',
    context: 'A clean monthly close enables the board report and unlocks Q3 capex commitments.',
    owner: STUB_OWNERS.sam,
    teamId: 'dept_finance',
    isCompany: true,
    isMine: true,
    measurement: MEASUREMENT.TASK,
    start: 0,
    current: 7,
    target: 12,
    unit: ' tasks',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(65, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['nd','nd','nd','nd','nd','nd','nd','nd','on','on','on','on','on'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
  {
    id: 'pri_003',
    title: 'Lakeside Roof Phase 1 Complete',
    context:
      'Buildings A and B replaced before hurricane season. Multi-vendor sequencing is the risk.',
    owner: STUB_OWNERS.kim,
    teamId: 'prop_lakeside',
    isCompany: true,
    isMine: false,
    measurement: MEASUREMENT.ROLLUP,
    start: 0,
    current: 38,
    target: 100,
    unit: '%',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(52, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['nd','nd','on','on','on','at','at','on','on','at','at','at','at'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
  {
    id: 'pri_004',
    title: 'Pass HUD Audit Clean',
    context: 'Zero deficiencies in this submission. Anything else jeopardizes the FY27 voucher allocation.',
    owner: STUB_OWNERS.sam,
    teamId: 'dept_compliance',
    isCompany: true,
    isMine: false,
    measurement: MEASUREMENT.TASK,
    start: 0,
    current: 14,
    target: 18,
    unit: ' items',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(11, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['on','on','on','on','on','at','at','at','off','at','at','at','at'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
  {
    id: 'pri_005',
    title: 'Reduce Average Maintenance Ticket Age to <4 Days',
    context: 'Resident satisfaction signal #1. Currently 6.2 days; staffing model is the lever.',
    owner: STUB_OWNERS.michael,
    teamId: 'dept_resident_services',
    isCompany: false,
    isMine: false,
    measurement: MEASUREMENT.NUMBER,
    start: 6.8,
    current: 5.4,
    target: 4,
    unit: ' days',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(75, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['off','off','at','at','at','at','on','on','on','on','on','on','on'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },
  {
    id: 'pri_006',
    title: 'Onboard 14 Riverbend Move-Ins With Zero Day-One Tickets',
    context: 'First impression matters. Tracking process from key audit through 72 hours post move-in.',
    owner: STUB_OWNERS.michael,
    teamId: 'prop_riverbend',
    isCompany: false,
    isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 0,
    current: 14,
    target: 14,
    unit: ' households',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(8, 'day').toISOString(),
    heatmap: buildHeatmap(
      ['nd','nd','nd','nd','nd','nd','nd','nd','nd','nd','nd','on','on'].map((s) => (
        { on:'on_track', at:'at_risk', off:'off_track', nd:'no_data' }[s]
      )),
    ),
  },

  // --- Sam Jordan (CFO) priorities ---
  {
    id: 'pri_cfo_001',
    title: 'Hit Q2 board report deadline with zero placeholders',
    context: 'Board meets July 22. Draft must circulate July 15.',
    owner: STUB_OWNERS.sam, teamId: 'dept_finance',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.TASK,
    start: 0, current: 5, target: 9, unit: ' sections',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(35, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','nd','nd','nd','on','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_cfo_002',
    title: 'Reduce AR aging beyond 60 days under 8% of receivables',
    context: '60+ day AR currently 11.4%. Operations + collections playbook in motion.',
    owner: STUB_OWNERS.sam, teamId: 'dept_finance',
    isCompany: false, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 14.2, current: 11.4, target: 8, unit: '%',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(50, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['off','off','at','at','at','at','at','at','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_cfo_003',
    title: 'Maintain operating cash above 90 days runway',
    context: 'Current runway: 96 days. Q3 grant disbursement timing risk.',
    owner: STUB_OWNERS.sam, teamId: 'dept_finance',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 110, current: 96, target: 90, unit: ' days',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(80, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['on','on','on','on','on','on','on','at','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },

  // --- Kim Krauter (RE Dev) priorities ---
  {
    id: 'pri_re_001',
    title: 'Close on Riverbend Phase 2 acquisition',
    context: '38 units, $7.2M total cap, LIHTC reservation pending state issuance.',
    owner: STUB_OWNERS.kim, teamId: 'prop_riverbend',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.TASK,
    start: 0, current: 7, target: 12, unit: ' diligence items',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(45, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','nd','nd','on','on','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_re_002',
    title: 'Oak Grove Phase 2 design development sign-off',
    context: '24-unit family addition. Schematic complete; awaiting city design review.',
    owner: STUB_OWNERS.kim, teamId: 'prop_oakgrove',
    isCompany: false, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 0, current: 60, target: 100, unit: '%',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(28, 'day').toISOString(),
    timeScope: TIME_SCOPE.MONTH,
    heatmap: buildHeatmap(['nd','nd','on','on','on','at','at','at','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_re_003',
    title: 'North Park stabilization — 95% occupancy by Q-end',
    context: 'New construction; 2 of 32 units uncommitted.',
    owner: STUB_OWNERS.kim, teamId: 'prop_north_park',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 78, current: 93.7, target: 95, unit: '%',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(40, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['off','at','at','at','on','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },

  // --- Jaime Shillady (Property Mgmt) priorities ---
  {
    id: 'pri_pm_001',
    title: 'Hold portfolio occupancy ≥ 96%',
    context: 'Currently 95.2%. 11 vacancies across 4 properties; turn time is the lever.',
    owner: STUB_OWNERS.jaime, teamId: 'dept_property_mgmt',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 94.1, current: 95.2, target: 96, unit: '%',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(30, 'day').toISOString(),
    timeScope: TIME_SCOPE.MONTH,
    heatmap: buildHeatmap(['at','at','at','on','on','at','at','at','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_pm_002',
    title: 'Maintenance ticket backlog under 60 open per property',
    context: 'Lakeside: 87 open (roof project). Other properties: <55 each.',
    owner: STUB_OWNERS.jaime, teamId: 'dept_property_mgmt',
    isCompany: false, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 110, current: 87, target: 60, unit: ' tickets',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(35, 'day').toISOString(),
    timeScope: TIME_SCOPE.MONTH,
    heatmap: buildHeatmap(['off','off','at','at','at','at','at','at','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_pm_003',
    title: 'College Avenue final lease-up — close last 6 vacancies',
    context: '58 of 64 units occupied. Application pipeline strong; goal is full occupancy before Q-end.',
    owner: STUB_OWNERS.jaime, teamId: 'dept_property_mgmt',
    propertyId: 'prop_college_ave', // OPTIONAL link — shows up as a chip on the row
    isCompany: false, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 58, current: 58, target: 64, unit: ' units occupied',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(28, 'day').toISOString(),
    timeScope: TIME_SCOPE.MONTH,
    heatmap: buildHeatmap(['nd','nd','nd','nd','nd','nd','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },

  // --- Michele Stauffer (HR) priorities ---
  {
    id: 'pri_hr_001',
    title: 'Fill 4 open positions by end of Q2',
    context: 'Property Manager, RSC, Maintenance Tech, Compliance Analyst. Two at offer stage.',
    owner: STUB_OWNERS.michele, teamId: 'dept_hr',
    isCompany: false, isMine: true,
    measurement: MEASUREMENT.TASK,
    start: 0, current: 2, target: 4, unit: ' hires',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(50, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','nd','nd','on','on','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_hr_002',
    title: 'Q2 eNPS above +30 (currently +24)',
    context: 'Q1 eNPS +24, up from +18. Manager training + comp band review in flight.',
    owner: STUB_OWNERS.michele, teamId: 'dept_hr',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 18, current: 24, target: 30, unit: ' eNPS',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(60, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','at','at','at','on','on','on','at','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_hr_003',
    title: 'Annual Fair Housing training — 100% completion',
    context: '47 staff. 33 complete. Closes in 3 weeks.',
    owner: STUB_OWNERS.michele, teamId: 'dept_compliance',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 0, current: 33, target: 47, unit: ' staff',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(21, 'day').toISOString(),
    timeScope: TIME_SCOPE.MONTH,
    heatmap: buildHeatmap(['nd','nd','on','on','on','at','at','at','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },

  // --- Meg Struck (Impact & Advancement) priorities ---
  {
    id: 'pri_ia_001',
    title: 'Close $1.5M in foundation grants this quarter',
    context: 'Ford Q3 expansion + JPMC + Wells Fargo CDF. $850K closed; $650K in solicitation.',
    owner: STUB_OWNERS.meg, teamId: 'dept_advocacy',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 0, current: 850, target: 1500, unit: 'k',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(45, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','nd','on','on','on','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_ia_002',
    title: 'Submit 6 grant proposals by Q-end',
    context: 'Pipeline of 6 active proposals; 3 submitted, 3 in writing.',
    owner: STUB_OWNERS.meg, teamId: 'dept_advocacy',
    isCompany: false, isMine: true,
    measurement: MEASUREMENT.TASK,
    start: 0, current: 3, target: 6, unit: ' proposals',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(38, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','nd','nd','on','on','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_ia_003',
    title: 'Annual gala — net $400K above prior year',
    context: 'Save-the-dates out. Venue locked. Sponsor commitments tracking 15% ahead.',
    owner: STUB_OWNERS.meg, teamId: 'dept_advocacy',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 0, current: 140, target: 400, unit: 'k',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(75, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','nd','nd','nd','nd','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },

  // --- Michael Sedoti (Resident Services) priorities ---
  {
    id: 'pri_rs_001',
    title: 'Reduce mean time to first contact under 24h on new referrals',
    context: 'Currently 31h. RSC scheduling SOP changes in pilot at Duke Manor + Heatherwoods.',
    owner: STUB_OWNERS.michael, teamId: 'dept_resident_services',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 48, current: 31, target: 24, unit: 'h',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(40, 'day').toISOString(),
    timeScope: TIME_SCOPE.MONTH,
    heatmap: buildHeatmap(['off','off','at','at','at','at','on','on','at','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_rs_002',
    title: 'Complete trauma-informed care recertification for all RSCs',
    context: '6 of 8 RSCs current. 2 lapse this quarter; courses scheduled.',
    owner: STUB_OWNERS.michael, teamId: 'dept_resident_services',
    isCompany: false, isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 4, current: 6, target: 8, unit: ' RSCs',
    status: PRIORITY_STATUS.ON_TRACK,
    dueAt: dayjs().add(55, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','nd','on','on','on','on','on','on','on','on','on','on','on']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
  {
    id: 'pri_rs_003',
    title: 'Stand up monthly needs assessment cadence at HDC-managed communities',
    context: 'Duke Manor live; College Avenue + Heatherwoods kickoff this month; rest of portfolio rolling.',
    owner: STUB_OWNERS.michael, teamId: 'dept_resident_services',
    isCompany: true, isMine: true,
    measurement: MEASUREMENT.TASK,
    start: 0, current: 1, target: 4, unit: ' properties',
    status: PRIORITY_STATUS.AT_RISK,
    dueAt: dayjs().add(50, 'day').toISOString(),
    timeScope: TIME_SCOPE.QUARTER,
    heatmap: buildHeatmap(['nd','nd','nd','nd','nd','nd','nd','nd','on','at','at','at','at']
      .map((s) => ({on:'on_track',at:'at_risk',off:'off_track',nd:'no_data'}[s]))),
  },
];

export async function listPriorities() {
  await wait();
  return DB.map((p) => ({ ...p, heatmap: [...p.heatmap] }));
}

export async function updatePriority(id, patch) {
  await wait();
  let updated = null;
  DB = DB.map((p) => {
    if (p.id !== id) return p;
    updated = { ...p, ...patch };
    return updated;
  });
  if (!updated) throw new Error(`Priority ${id} not found`);
  return { ...updated };
}

export async function createPriority(input) {
  await wait();
  const next = {
    id: newId(),
    isCompany: false,
    isMine: true,
    measurement: MEASUREMENT.NUMBER,
    start: 0,
    current: 0,
    target: 100,
    unit: '%',
    status: PRIORITY_STATUS.ON_TRACK,
    heatmap: buildHeatmap(Array(13).fill('no_data')),
    ...input,
  };
  DB = [next, ...DB];
  return { ...next };
}

export async function deletePriority(id) {
  await wait();
  DB = DB.filter((p) => p.id !== id);
  return { id };
}

export const calculatePercent = (priority) => {
  const { start = 0, current = 0, target = 0 } = priority;
  if (target === start) return current >= target ? 100 : 0;
  const pct = ((current - start) / (target - start)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
};
