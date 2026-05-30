const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    'manage:products',
    'manage:orders',
    'manage:customers',
    'manage:categories',
    'manage:blogs',
    'view:analytics',
    'manage:users',
    'manage:settings',
    'manage:inventory',
    'manage:audit-logs',
    'manage:coupons',
    'manage:campaigns',
  ],
  ADMIN: [
    'manage:products',
    'manage:orders',
    'manage:customers',
    'manage:categories',
    'manage:blogs',
    'view:analytics',
    'manage:inventory',
    'manage:audit-logs',
    'manage:coupons',
    'manage:campaigns',
  ],
  MANAGER: [
    'manage:products',
    'manage:orders',
    'manage:customers',
    'view:analytics',
    'manage:inventory',
  ],
  SUPPORT: [
    'manage:orders',
    'manage:customers',
    'view:analytics',
  ],
  USER: [],
};

module.exports = { ROLE_PERMISSIONS };