const { ApiError } = require('../../utils/ApiError');

module.exports.validateCategoryHierarchy = (categories) => {
  const valid = categories.every(cat => !cat.parentId || categories.some(p => p.id === cat.parentId));
  if (!valid) throw new ApiError(400, 'Invalid category hierarchy');
  return categories;
};