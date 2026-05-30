const { prisma } = require("../../db/prisma");
const { ApiError } = require("../../utils/ApiError");

class SettingsService {
  async get() {
    let settings = await prisma.setting.findFirst();
    if (!settings) {
      settings = await prisma.setting.create({
        data: {
          siteName: "ShopAdmin",
          supportEmail: "support@shop.com",
          currency: "USD",
          timezone: "UTC",
          notifications: {
            newOrder: true,
            lowStock: true,
            newCustomer: true,
            paymentReceived: true,
          },
        },
      });
    }
    return settings;
  }

  async update(data) {
    const current = await this.get();
    return prisma.setting.update({
      where: { id: current.id },
      data: {
        siteName: data.siteName,
        supportEmail: data.supportEmail,
        currency: data.currency,
        timezone: data.timezone,
        notifications: data.notifications ?? undefined,
      },
    });
  }
}

module.exports = new SettingsService();