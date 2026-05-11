// User directory — simulates the personas Dana et al. will log in as.
// Each user has a `dashboardVariant` that drives /dashboard/me's shape.
// Replace with Supabase auth + a `users` table when real auth ships.

import { ROLES } from '../utils/permissions';

export const DASHBOARD_VARIANT = {
  ADVOCACY: 'advocacy',
  CFO: 'cfo',
  REAL_ESTATE_DEV: 'real_estate_dev',
  PROPERTY_MGMT: 'property_mgmt',
  HR: 'hr',
  IMPACT_ADVANCEMENT: 'impact_advancement',
  RESIDENT_SERVICES: 'resident_services',
  DEFAULT: 'default',
};

export const USERS = [
  {
    id: 'usr_dana',
    name: 'Dana Hanchin',
    initials: 'DH',
    title: 'Chief Executive Officer',
    department: 'Executive',
    email: 'dana@hdc.local',
    organization: 'HDC',
    roles: [ROLES.ELT, ROLES.LEADER, ROLES.MEMBER],
    dashboardVariant: DASHBOARD_VARIANT.ADVOCACY,
    accent: '#072c5e',
    tagline: 'Primary Advocate',
  },
  {
    id: 'usr_sam',
    name: 'Sam Jordan',
    initials: 'SJ',
    title: 'Chief Financial Officer',
    department: 'Finance',
    email: 'sam@hdc.local',
    organization: 'HDC',
    roles: [ROLES.ELT, ROLES.LEADER, ROLES.MEMBER],
    dashboardVariant: DASHBOARD_VARIANT.CFO,
    accent: '#3d9585',
    tagline: 'Financial Steward',
  },
  {
    id: 'usr_kim',
    name: 'Kim Krauter',
    initials: 'KK',
    title: 'Senior VP, Real Estate Development',
    department: 'Real Estate Development',
    email: 'kim@hdc.local',
    organization: 'HDC',
    roles: [ROLES.ELT, ROLES.LEADER, ROLES.MEMBER],
    dashboardVariant: DASHBOARD_VARIANT.REAL_ESTATE_DEV,
    accent: '#1a4a80',
    tagline: 'Pipeline Lead',
  },
  {
    id: 'usr_jaime',
    name: 'Jaime Shillady',
    initials: 'JS',
    title: 'Director of Property Management',
    department: 'Property Management',
    email: 'jaime@hdc.local',
    organization: 'HDC',
    roles: [ROLES.LEADER, ROLES.MEMBER],
    dashboardVariant: DASHBOARD_VARIANT.PROPERTY_MGMT,
    accent: '#f1ac49',
    tagline: 'Portfolio Steward',
  },
  {
    id: 'usr_michele',
    name: 'Michele Stauffer',
    initials: 'MS',
    title: 'Director of Human Resources',
    department: 'Human Resources',
    email: 'michele@hdc.local',
    organization: 'HDC',
    roles: [ROLES.LEADER, ROLES.MEMBER],
    dashboardVariant: DASHBOARD_VARIANT.HR,
    accent: '#5eb8a8',
    tagline: 'People Leader',
  },
  {
    id: 'usr_meg',
    name: 'Meg Struck',
    initials: 'MS',
    title: 'Senior VP, Impact & Advancement',
    department: 'Impact & Advancement',
    email: 'meg@hdc.local',
    organization: 'HDC',
    roles: [ROLES.ELT, ROLES.LEADER, ROLES.MEMBER],
    dashboardVariant: DASHBOARD_VARIANT.IMPACT_ADVANCEMENT,
    accent: '#db534c',
    tagline: 'Fundraising Hub',
  },
  {
    id: 'usr_michael',
    name: 'Michael Sedoti',
    initials: 'MS',
    title: 'Resident Services Manager',
    department: 'Resident Services',
    email: 'michael@hdc.local',
    organization: 'HDC',
    roles: [ROLES.LEADER, ROLES.MEMBER],
    dashboardVariant: DASHBOARD_VARIANT.RESIDENT_SERVICES,
    accent: '#006e5c',
    tagline: 'Resident Journey Lead',
  },
];

export const USER_BY_ID = Object.fromEntries(USERS.map((u) => [u.id, u]));

export const DEFAULT_USER_ID = 'usr_dana';

export function getUser(id) {
  return USER_BY_ID[id] ?? USERS[0];
}
