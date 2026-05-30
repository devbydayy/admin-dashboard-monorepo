const { ApiError } = require('../../utils/ApiError');

module.exports.uploadImage = async (file) => {
  if (!file) throw new ApiError(400, 'No image file provided');
  return `https://example.com/images/${file.originalname}`;
};

module.exports.calculateDiscountedPrice = (price, discountPercentage = 0) => {
  return price * (1 - discountPercentage / 100);
};
