const { ROLE_PERMISSIONS } = require('../config/permissions');

module.exports = (...requiredPermissions) => {
  const perms = requiredPermissions.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasAll = perms.every((perm) => userPermissions.includes(perm));
    if (!hasAll) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden – insufficient permissions',
      });
    }

    next();
  };
};