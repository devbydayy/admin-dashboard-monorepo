const generateOrderNumber = () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

const paginate = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    data: items.slice(startIndex, endIndex),
    pagination: {
      current: page,
      pages: Math.ceil(items.length / limit),
      total: items.length,
    },
  };
};

module.exports = { generateOrderNumber, paginate };
