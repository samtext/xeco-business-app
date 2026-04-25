export type ServiceType = 'payment_collection' | 'airtime';

export interface Business {
  id: string;
  businessName: string;
  serviceType: ServiceType;
  tillNumber: string;
  floatBalance: number;
  accountBalance: number;
}

export interface Merchant {
  fullName: string;
  business: Business;
}