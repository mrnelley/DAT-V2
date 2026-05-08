export const ROLES = {
  ELT: 'ELT',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
};

export const ROLE_HIERARCHY = [ROLES.MEMBER, ROLES.LEADER, ROLES.ELT];

export const hasRole = (userRoles = [], allowed = []) =>
  allowed.some((role) => userRoles.includes(role));
