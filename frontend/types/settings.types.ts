export interface SiteSettings {
  id: string;
  siteName: string;
  supportEmail: string;
  currency: string;
  timezone: string;
  notifications: {
    newOrder: boolean;
    lowStock: boolean;
    newCustomer: boolean;
    paymentReceived: boolean;
  };
}