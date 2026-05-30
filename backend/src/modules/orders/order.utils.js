const { prisma } = require('../../db/prisma');
const { ApiError } = require('../../utils/ApiError');

module.exports.updateStock = async (productId, quantity, operation = 'subtract') => {
  const currentProduct = await prisma.product.findUnique({ where: { id: productId } });
  if (!currentProduct) throw new ApiError(404, 'Product not found');

  const delta = operation === 'subtract' ? -quantity : quantity;
  const newStock = currentProduct.stock + delta;

  if (newStock < 0) throw new ApiError(400, 'Insufficient stock');

  return prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });
};
