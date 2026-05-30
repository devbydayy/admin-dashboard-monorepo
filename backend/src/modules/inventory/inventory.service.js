const { prisma } = require("../../db/prisma");
const { ApiError } = require("../../utils/ApiError");

class InventoryService {
  async getLowStockAlerts(threshold = 10) {
    return prisma.product.findMany({
      where: {
        stock: { lte: threshold },
        status: { not: "OUT_OF_STOCK" },
      },
      orderBy: { stock: "asc" },
      include: { category: true },
    });
  }

  async adjustStock(productId, { operation, amount }) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new ApiError(404, "Product not found");

    let newStock;
    switch (operation) {
      case "increment":
        newStock = product.stock + amount;
        break;
      case "decrement":
        newStock = product.stock - amount;
        if (newStock < 0) throw new ApiError(400, "Insufficient stock");
        break;
      case "set":
        newStock = amount;
        if (newStock < 0) throw new ApiError(400, "Stock cannot be negative");
        break;
      default:
        throw new ApiError(400, "Invalid operation. Use 'increment', 'decrement', or 'set'");
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
      include: { category: true },
    });
    return updated;
  }
}

module.exports = new InventoryService();