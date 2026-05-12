// HDC MidAtlantic real operational portfolio — 71 communities.
//
// Sources:
//   • HDC MidAtlantic apartments directory (hdcweb.org/apartments/, 6 pages)
//     → 64 in-house managed communities across PA + DE.
//   • User-provided JSON of HDC + Homes-for-America 3rd-party managed
//     communities in MD + DE → 7 additional communities.
//
// Coordinates are city-center derived for most entries (medium confidence).
// A few flagged-only properties may benefit from internal geocoding; surface
// in UI with `coordsConfidence`. Unit counts shown only where publicly stated;
// `units: null` means "needs internal validation."
//
// Multi-property cities (Lancaster has 9, Wilmington DE has 6, Quarryville 3,
// Cambridge MD 3, etc.) are nudged by ~0.002–0.008° from the city centroid so
// pins don't perfectly overlap at typical demo zoom.

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

export const PROPERTY_STATUS = {
  CONFIRMED: 'confirmed',
  LIKELY_CONFIRMED: 'likely_confirmed',
  THIRD_PARTY: 'third_party',
};

export const PROPERTY_STATUS_LABEL = {
  confirmed: 'Confirmed',
  likely_confirmed: 'Likely Confirmed',
  third_party: 'Third-Party Managed',
};

export const MGMT_TYPE = {
  IN_HOUSE: 'in_house',
  THIRD_PARTY: 'third_party',
};

export const MGMT_TYPE_LABEL = {
  in_house: 'In-house',
  third_party: 'Third-party (Homes for America)',
};

export const STATE_LABEL = {
  PA: 'Pennsylvania',
  DE: 'Delaware',
  MD: 'Maryland',
};

export const COORDS_CONFIDENCE = {
  HIGH: 'high',     // street-address derived
  MEDIUM: 'medium', // city-center derived
  LOW: 'low',       // state-only / placeholder
};

// Compact builder so each property entry stays readable on one logical line.
const p = (id, name, city, state, coords, opts = {}) => ({
  id,
  name,
  address: opts.address ?? (city ? `${city}, ${state}` : state),
  city: city ?? null,
  state,
  county: opts.county ?? null,
  zip: opts.zip ?? null,
  coords,
  coordsConfidence: opts.coordsConfidence ?? COORDS_CONFIDENCE.MEDIUM,
  units: opts.units ?? null,
  housingType: opts.housingType ?? 'Affordable housing',
  developmentType: opts.developmentType ?? null,
  residentFocus: opts.residentFocus ?? null,
  amenities: opts.amenities ?? null,
  communityFeatures: opts.communityFeatures ?? null,
  accessibilityFeatures: opts.accessibilityFeatures ?? null,
  capitalImprovementNotes: opts.capitalImprovementNotes ?? null,
  yearOpened: opts.yearOpened ?? null,
  estimatedDevelopmentCost: opts.estimatedDevelopmentCost ?? null,
  fundingNotes: opts.fundingNotes ?? null,
  congressionalDistrict: opts.congressionalDistrict ?? null,
  federalRepresentative: opts.federalRepresentative ?? null,
  stateSenateDistrict: opts.stateSenateDistrict ?? null,
  stateHouseDistrict: opts.stateHouseDistrict ?? null,
  mayor: opts.mayor ?? null,
  status: opts.status ?? PROPERTY_STATUS.CONFIRMED,
  managementType: opts.managementType ?? MGMT_TYPE.IN_HOUSE,
  notes: opts.notes ?? null,
  sources: opts.sources ?? ['https://hdcweb.org/apartments/'],
});

const DB = [
  // ─── PA — Allentown / Lehigh Valley ─────────────────────────────
  p('prop_1528_west', '1528 West Apartments', 'Allentown', 'PA',
    [40.6021, -75.4990],
    {
      address: '1528 W Turner St, Allentown, PA',
      county: 'Lehigh County', units: 49,
      housingType: 'Affordable apartments — adults with I/DD',
      residentFocus: ['Adults with intellectual / developmental disabilities'],
      coordsConfidence: COORDS_CONFIDENCE.HIGH,
      congressionalDistrict: 'PA-7', federalRepresentative: 'Ryan Mackenzie',
      amenities: ['Laundry facilities', 'Community room', 'Emergency maintenance', 'Resident services'],
      sources: ['https://es.hdcweb.org/property/1528-west-apartments/'],
    }),
  p('prop_south_side_lofts', 'South Side Lofts', 'Bethlehem', 'PA', [40.6259, -75.3705],
    { county: 'Northampton County' }),

  // ─── PA — Berks County (Reading area) ───────────────────────────
  p('prop_market_square', 'Market Square Apartments', 'Reading', 'PA', [40.3356, -75.9269],
    { county: 'Berks County' }),
  p('prop_penns_common_court', 'Penns Common Court', 'Reading', 'PA', [40.3376, -75.9249],
    { county: 'Berks County' }),
  p('prop_southgate', 'Southgate Apartments', 'Leesport', 'PA', [40.4467, -75.9577],
    { county: 'Berks County', units: 50, residentFocus: ['Seniors', 'Families'],
      sources: ['https://hdcweb.org/2024/03/27/be-a-neighbor-joan-sehl-southgate-apartments/'],
      notes: 'Originally flagged as unknown city in early data; resolved via HDC directory.' }),
  p('prop_hamburg_school', 'Hamburg School Apartments', 'Hamburg', 'PA', [40.5564, -75.9810],
    { county: 'Berks County' }),
  p('prop_henner', 'Henner Apartments', 'Womelsdorf', 'PA', [40.3654, -76.1843],
    { county: 'Berks County' }),
  p('prop_exeter_senior', 'Exeter Senior Living Apartments', 'Exeter', 'PA', [40.3357, -75.8538],
    { county: 'Berks County', residentFocus: ['Seniors'] }),
  p('prop_river_run_meadows', 'River Run Meadows Apartments', 'Birdsboro', 'PA', [40.2620, -75.8043],
    { county: 'Berks County' }),

  // ─── PA — Lancaster city + surrounds (9 communities) ───────────
  p('prop_college_ave', 'The Apartments at College Avenue', 'Lancaster', 'PA',
    [40.0395, -76.3275],
    {
      address: '838 Marietta Ave, Lancaster, PA 17603', county: 'Lancaster County', zip: '17603',
      units: 64,
      housingType: 'Affordable family + disability-accessible',
      developmentType: 'New construction',
      residentFocus: ['Families', 'Adults with disabilities', 'Low-income'],
      amenities: ['Energy-efficient appliances', 'ADA accessible units', 'Community space', 'Resident services'],
      yearOpened: 2025, estimatedDevelopmentCost: 24_000_000,
      fundingNotes: ['LIHTC', 'PHFA', 'Public-private partnership'],
      coordsConfidence: COORDS_CONFIDENCE.HIGH,
      congressionalDistrict: 'PA-11', federalRepresentative: 'Lloyd Smucker',
      stateSenateDistrict: 'PA Senate District 13', stateHouseDistrict: 'PA House District 96',
      mayor: 'Danene Sorace',
      sources: [
        'https://hdcweb.org/2025/08/20/hdc-midatlantic-celebrates-grand-opening-of-the-apartments-at-college-avenue-in-lancaster/',
      ],
      notes: 'Phase 1 of 120-unit redevelopment on former hospital campus.',
    }),
  p('prop_duke_manor', 'Duke Manor Apartments', 'Lancaster', 'PA', [40.0420, -76.3050],
    { county: 'Lancaster County', units: 100, residentFocus: ['Families', 'Long-term residents'],
      communityFeatures: ['Community gardens', 'Resident leadership programming', 'Resident Academy participation'],
      congressionalDistrict: 'PA-11', federalRepresentative: 'Lloyd Smucker',
      sources: ['https://hdcweb.org/2023/10/02/be-a-neighbor-awilda-delgado-duke-manor-apartments/'] }),
  p('prop_king_theatre', 'King Theatre Apartments', 'Lancaster', 'PA', [40.0399, -76.3046],
    { county: 'Lancaster County' }),
  p('prop_lancaster_apts', 'Lancaster Apartments', 'Lancaster', 'PA', [40.0362, -76.3066],
    { county: 'Lancaster County' }),
  p('prop_mulberry_corners', 'The Apartments at Mulberry Corners', 'Lancaster', 'PA', [40.0382, -76.3094],
    { county: 'Lancaster County' }),
  p('prop_plum_tree', 'Plum Tree Apartments', 'Lancaster', 'PA', [40.0345, -76.3085],
    { county: 'Lancaster County' }),
  p('prop_ruoff_tower', 'Ruoff Tower', 'Lancaster', 'PA', [40.0436, -76.3030],
    { county: 'Lancaster County', residentFocus: ['Seniors'] }),
  p('prop_tabor_place', 'Tabor Place Apartments', 'Lancaster', 'PA', [40.0370, -76.3105],
    { county: 'Lancaster County' }),
  p('prop_umbrella_works', 'Umbrella Works Apartments', 'Lancaster', 'PA', [40.0418, -76.3105],
    { county: 'Lancaster County' }),

  // ─── PA — Lancaster County (outside the city) ──────────────────
  p('prop_oak_bottom', 'Oak Bottom Village', 'Quarryville', 'PA', [39.8973, -76.1633],
    { county: 'Lancaster County', units: 18,
      housingType: 'Affordable townhomes',
      developmentType: 'Preservation / rehabilitation',
      residentFocus: ['Families'],
      fundingNotes: ['LIHTC preservation financing', 'DCED NAP'],
      capitalImprovementNotes: ['Roof upgrades', 'Window replacement', 'HVAC upgrades', 'Solar installations', 'ADA modernization'],
      congressionalDistrict: 'PA-11', federalRepresentative: 'Lloyd Smucker',
      sources: ['https://hdcweb.org/2020/02/04/hdc-midatlantic-awarded-175000-to-preserve-affordable-housing-in-lancaster-county/'] }),
  p('prop_oak_bottom_2', 'Oak Bottom Village II', 'Quarryville', 'PA', [39.8993, -76.1653],
    { county: 'Lancaster County', developmentType: 'Preservation / rehabilitation' }),
  p('prop_oak_bottom_3', 'Oak Bottom Village III', 'Quarryville', 'PA', [39.8953, -76.1613],
    { county: 'Lancaster County', developmentType: 'Preservation / rehabilitation' }),
  p('prop_heatherwoods', 'The Apartments at Heatherwoods', 'Denver', 'PA', [40.2351, -76.1393],
    { county: 'Lancaster County', units: 56,
      housingType: 'Affordable townhomes',
      developmentType: 'Preservation / rehabilitation',
      residentFocus: ['Families'],
      fundingNotes: ['LIHTC', 'Tax exempt bonds', 'DCED NAP'],
      congressionalDistrict: 'PA-11', federalRepresentative: 'Lloyd Smucker' }),
  p('prop_franklin_street', 'Franklin Street Apartments', 'Ephrata', 'PA', [40.1789, -76.1786],
    { county: 'Lancaster County' }),
  p('prop_mountain_view_terrace', 'Mountain View Terrace', 'New Holland', 'PA', [40.1014, -76.0858],
    { county: 'Lancaster County' }),
  p('prop_aster_place', 'Aster Place', 'Lititz', 'PA', [40.1571, -76.3072],
    { county: 'Lancaster County' }),
  p('prop_larkspur_crossing', 'Larkspur Crossing Townhomes', 'Lititz', 'PA', [40.1591, -76.3092],
    { county: 'Lancaster County' }),
  p('prop_landisville_1', 'Landisville Apartments – I', 'Landisville', 'PA', [40.0937, -76.4163],
    { county: 'Lancaster County' }),
  p('prop_landisville_2', 'Landisville Apartments – II', 'Landisville', 'PA', [40.0957, -76.4183],
    { county: 'Lancaster County' }),
  p('prop_rockford_chase', 'Rockford Chase Apartments', 'Mountville', 'PA', [40.0395, -76.4324],
    { county: 'Lancaster County' }),
  p('prop_sylvan_retreat', 'Sylvan Retreat Apartments', 'Mountville', 'PA', [40.0415, -76.4344],
    { county: 'Lancaster County' }),
  p('prop_market_house', 'Market House Apartments', 'Elizabethtown', 'PA', [40.1517, -76.6017],
    { county: 'Lancaster County' }),
  p('prop_whistlestop_view', 'Whistlestop View Apartments', 'Elizabethtown', 'PA', [40.1537, -76.6037],
    { county: 'Lancaster County' }),
  p('prop_st_peter', 'Saint Peter Apartments', 'Columbia', 'PA', [40.0337, -76.5044],
    { county: 'Lancaster County', units: 30,
      housingType: 'Affordable ADA-accessible',
      residentFocus: ['Individuals with disabilities', 'Seniors'],
      accessibilityFeatures: ['ADA compliant units', 'Accessible design'],
      sources: ['https://hdcweb.org/2022/09/21/be-a-neighbor-wendy-boyd-st-peters-apartments/'],
      notes: 'Originally surfaced as "St. Peters Apartments" with unknown city; resolved to Saint Peter Apartments in Columbia, PA per HDC directory.' }),
  p('prop_trinity_house', 'Trinity House Apartments', 'Columbia', 'PA', [40.0357, -76.5064],
    { county: 'Lancaster County' }),

  // ─── PA — Lebanon County ───────────────────────────────────────
  p('prop_beach_run', 'Beach Run Apartments', 'Fredericksburg', 'PA', [40.4304, -76.4435],
    { county: 'Lebanon County', units: 51,
      housingType: 'Affordable family — 1/2/3 BR',
      residentFocus: ['Families'],
      congressionalDistrict: 'PA-11', federalRepresentative: 'Lloyd Smucker',
      sources: ['https://hdcweb.org/2021/02/02/hdc-midatlantic-receives-250000-to-develop-affordable-housing-in-lebanon-county/'] }),
  p('prop_deer_lake', 'Deer Lake Apartments', 'Lebanon', 'PA', [40.3409, -76.4114],
    { county: 'Lebanon County' }),

  // ─── PA — Chester County ───────────────────────────────────────
  p('prop_ash_park', 'Ash Park Terrace', 'Coatesville', 'PA', [39.9826, -75.8246],
    { county: 'Chester County' }),
  p('prop_brandywine_center', 'Brandywine Center', 'Coatesville', 'PA', [39.9836, -75.8226],
    { county: 'Chester County' }),
  p('prop_washington_house', 'Washington House Apartments', 'Coatesville', 'PA', [39.9846, -75.8266],
    { county: 'Chester County' }),
  p('prop_denney_reyburn', 'Denney Reyburn Apartments', 'West Chester', 'PA', [39.9601, -75.6056],
    { county: 'Chester County' }),
  p('prop_hannum_gardens', 'Hannum Gardens', 'West Chester', 'PA', [39.9621, -75.6086],
    { county: 'Chester County' }),
  p('prop_glenbrook', 'Glenbrook Apartments', 'Atglen', 'PA', [39.9437, -75.9716],
    { county: 'Chester County' }),
  p('prop_parkesburg_school', 'Parkesburg School Apartments', 'Parkesburg', 'PA', [39.9590, -75.9244],
    { county: 'Chester County' }),

  // ─── PA — Dauphin County (Harrisburg area) ─────────────────────
  p('prop_highspire_school', 'Highspire School Apartments', 'Highspire', 'PA', [40.2098, -76.7869],
    { county: 'Dauphin County' }),
  p('prop_springwood_glen', 'Springwood Glen Apartments', 'Middletown', 'PA', [40.1995, -76.7308],
    { county: 'Dauphin County' }),
  p('prop_willow_ridge', 'Willow Ridge Apartments', 'Hershey', 'PA', [40.2859, -76.6502],
    { county: 'Dauphin County',
      residentFocus: ['Families', 'Workforce households'],
      congressionalDistrict: 'PA-10', federalRepresentative: 'Scott Perry',
      stateSenateDistrict: 'PA Senate District 48',
      sources: ['https://hdcweb.org/apartments/'],
      notes: 'Upgraded from "Likely Confirmed" once verified on HDC directory.' }),

  // ─── PA — Montgomery County ────────────────────────────────────
  p('prop_norriswood', 'Norriswood Apartments', 'Norristown', 'PA', [40.1215, -75.3399],
    { county: 'Montgomery County' }),

  // ─── PA — York County ──────────────────────────────────────────
  p('prop_wyndamere', 'Wyndamere Apartments', 'York', 'PA', [39.9626, -76.7277],
    { county: 'York County' }),
  p('prop_new_freedom', 'New Freedom Apartments', 'New Freedom', 'PA', [39.7370, -76.6889],
    { county: 'York County' }),

  // ─── PA — Centre County ────────────────────────────────────────
  p('prop_governors_gate', "Governor's Gate Apartments", 'Bellefonte', 'PA', [40.9136, -77.7780],
    { county: 'Centre County' }),

  // ─── PA — Lackawanna / Luzerne / Schuylkill (NE PA) ────────────
  p('prop_st_catherine_manor', 'Saint Catherine Manor Apartments', 'Scranton', 'PA', [41.4090, -75.6624],
    { county: 'Lackawanna County', residentFocus: ['Seniors'] }),
  p('prop_heritage_point', 'Heritage Point Apartments', 'Wilkes-Barre', 'PA', [41.2459, -75.8814],
    { county: 'Luzerne County' }),
  p('prop_st_john', 'Saint John Apartments', 'Wilkes-Barre', 'PA', [41.2479, -75.8834],
    { county: 'Luzerne County' }),
  p('prop_st_stanislaus', 'Saint Stanislaus Apartments', 'Newport Township', 'PA', [41.1745, -76.0299],
    { county: 'Luzerne County' }),
  p('prop_st_thomas_court', 'Saint Thomas Court Apartments', 'Hazleton', 'PA', [40.9584, -75.9774],
    { county: 'Luzerne County' }),
  p('prop_st_vincent', 'Saint Vincent Apartments', 'Plymouth', 'PA', [41.2403, -75.9466],
    { county: 'Luzerne County' }),

  // ─── DE — Wilmington (6 communities including 4 phases of The Flats) ─
  p('prop_claymont_street', 'Claymont Street Apartments', 'Wilmington', 'DE', [39.7391, -75.5398],
    { county: 'New Castle County' }),
  p('prop_quaker_arts', 'Quaker Arts', 'Wilmington', 'DE', [39.7411, -75.5418],
    { county: 'New Castle County' }),
  p('prop_flats_1', 'The Flats Phase I', 'Wilmington', 'DE', [39.7381, -75.5378],
    { county: 'New Castle County' }),
  p('prop_flats_2', 'The Flats Phase II', 'Wilmington', 'DE', [39.7401, -75.5408],
    { county: 'New Castle County' }),
  p('prop_flats_3', 'The Flats Phase III', 'Wilmington', 'DE', [39.7361, -75.5368],
    { county: 'New Castle County' }),
  p('prop_flats_4', 'The Flats Phase IV', 'Wilmington', 'DE', [39.7421, -75.5428],
    { county: 'New Castle County' }),

  // ─── DE — Kent County ──────────────────────────────────────────
  p('prop_mill_creek', 'Mill Creek Apartments', 'Smyrna', 'DE', [39.2998, -75.6049],
    { county: 'Kent County' }),
  p('prop_silver_lake', 'Silver Lake Apartments', 'Dover', 'DE', [39.1582, -75.5244],
    { county: 'Kent County' }),

  // ─── DE — Sussex County (third-party managed for Homes for America) ─
  p('prop_cornish_landing', 'Elizabeth Cornish Landing', 'Bridgeville', 'DE', [38.7437, -75.6082],
    { county: 'Sussex County', units: 55,
      congressionalDistrict: 'Delaware At-Large', federalRepresentative: 'Sarah McBride',
      status: PROPERTY_STATUS.THIRD_PARTY, managementType: MGMT_TYPE.THIRD_PARTY,
      sources: ['https://hdcweb.org/2022/10/24/hdc-midatlantic-expands-in-maryland-takes-over-property-management-of-7-homes-for-america-communities/'] }),

  // ─── MD — Eastern Shore (all third-party managed for Homes for America) ─
  p('prop_pocomoke_landing', 'Pocomoke Landing', 'Pocomoke City', 'MD', [38.0843, -75.5680],
    { county: 'Worcester County', units: 40,
      congressionalDistrict: 'MD-1', federalRepresentative: 'Andy Harris',
      status: PROPERTY_STATUS.THIRD_PARTY, managementType: MGMT_TYPE.THIRD_PARTY,
      sources: ['https://hdcweb.org/2022/10/24/hdc-midatlantic-expands-in-maryland-takes-over-property-management-of-7-homes-for-america-communities/'] }),
  p('prop_parkside_village', 'Parkside Village Apartments', 'Cambridge', 'MD', [38.5634, -76.0788],
    { county: 'Dorchester County', units: 60, residentFocus: ['Families'],
      congressionalDistrict: 'MD-1', federalRepresentative: 'Andy Harris',
      status: PROPERTY_STATUS.THIRD_PARTY, managementType: MGMT_TYPE.THIRD_PARTY,
      sources: ['https://hdcweb.org/2022/10/24/hdc-midatlantic-expands-in-maryland-takes-over-property-management-of-7-homes-for-america-communities/'] }),
  p('prop_glenburn', 'Glenburn Garden House', 'Cambridge', 'MD', [38.5664, -76.0820],
    { county: 'Dorchester County', units: 35, residentFocus: ['Seniors'],
      housingType: 'Affordable senior',
      congressionalDistrict: 'MD-1', federalRepresentative: 'Andy Harris',
      status: PROPERTY_STATUS.THIRD_PARTY, managementType: MGMT_TYPE.THIRD_PARTY,
      sources: ['https://hdcweb.org/2022/10/24/hdc-midatlantic-expands-in-maryland-takes-over-property-management-of-7-homes-for-america-communities/'] }),
  p('prop_hudson_townhomes', 'Hudson Townhomes', 'Cambridge', 'MD', [38.5604, -76.0760],
    { county: 'Dorchester County', units: 40, housingType: 'Affordable townhomes',
      congressionalDistrict: 'MD-1', federalRepresentative: 'Andy Harris',
      status: PROPERTY_STATUS.THIRD_PARTY, managementType: MGMT_TYPE.THIRD_PARTY,
      sources: ['https://hdcweb.org/2022/10/24/hdc-midatlantic-expands-in-maryland-takes-over-property-management-of-7-homes-for-america-communities/'] }),
  p('prop_leonard', 'James E. Leonard Apartments', 'Salisbury', 'MD', [38.3607, -75.5994],
    { county: 'Wicomico County', units: 45,
      congressionalDistrict: 'MD-1', federalRepresentative: 'Andy Harris',
      status: PROPERTY_STATUS.THIRD_PARTY, managementType: MGMT_TYPE.THIRD_PARTY,
      sources: ['https://hdcweb.org/2022/10/24/hdc-midatlantic-expands-in-maryland-takes-over-property-management-of-7-homes-for-america-communities/'] }),
  p('prop_shiloh_house', 'Shiloh House Apartments', 'Hurlock', 'MD', [38.6182, -75.8513],
    { county: 'Dorchester County', units: 25,
      congressionalDistrict: 'MD-1', federalRepresentative: 'Andy Harris',
      status: PROPERTY_STATUS.THIRD_PARTY, managementType: MGMT_TYPE.THIRD_PARTY,
      sources: ['https://hdcweb.org/2022/10/24/hdc-midatlantic-expands-in-maryland-takes-over-property-management-of-7-homes-for-america-communities/'] }),
];

export const PROPERTY_BY_ID = Object.fromEntries(DB.map((x) => [x.id, x]));

export async function listProperties({ state, managementType } = {}) {
  await wait();
  return DB
    .filter((x) => (!state || x.state === state))
    .filter((x) => (!managementType || x.managementType === managementType))
    .map((x) => ({ ...x }));
}

export async function getProperty(id) {
  await wait();
  const x = DB.find((y) => y.id === id);
  return x ? { ...x } : null;
}

export const portfolioTotals = () => ({
  count: DB.length,
  units: DB.reduce((s, x) => s + (x.units ?? 0), 0),
  unitsValidated: DB.filter((x) => x.units != null).length,
  byState: DB.reduce((acc, x) => { acc[x.state] = (acc[x.state] ?? 0) + 1; return acc; }, {}),
  byManagementType: DB.reduce((acc, x) => { acc[x.managementType] = (acc[x.managementType] ?? 0) + 1; return acc; }, {}),
});
