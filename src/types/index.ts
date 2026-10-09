export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export type PlatformType = 'Android' | 'iOS' | 'Web' | 'Desktop';

export type AppStatus = 'pending' | 'approved' | 'rejected';

export interface AppLink {
  id: string;
  appId: string;
  title: string;
  url: string;
  linkType: 'Tracking URL' | 'Deep Link' | 'Fallback URL' | 'Affiliate';
  isActive: boolean;
  createdAt: string;
}

export interface App {
  id: string;
  userId: string;
  userName: string;
  name: string;
  platform: PlatformType;
  bundleId: string;
  storeUrl?: string;
  notes?: string;
  status: AppStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  links: AppLink[];
}

export interface AdAccount {
  id: string;
  accountName: string;
  network: 'Google Ads' | 'Meta Ads' | 'Unity Ads' | 'TikTok Ads' | 'AppLovin';
  externalAccountId: string;
  currency: string;
  status: 'active' | 'inactive';
}

export interface UserAdAccountMapping {
  id: string;
  userId: string;
  adAccountId: string;
  assignedAt: string;
}

export interface Campaign {
  id: string;
  userId: string;
  appId: string;
  appName: string;
  adAccountId: string;
  adAccountName: string;
  name: string;
  utmSource?: string;
  status: 'active' | 'paused' | 'completed';
  budgetDaily: number;
  totalSpent: number;
  revenue: number;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface RevenueMetric {
  id: string;
  date: string;
  appId: string;
  appName: string;
  userId: string;
  campaignId?: string;
  adAccountId?: string;
  impressions: number;
  clicks: number;
  revenueUsd: number;
  ecpm: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface AdminNotification {
  id: string;
  type: 'new_app';
  appId: string;
  appName: string;
  userId: string;
  userName: string;
  timestamp: string;
  isRead: boolean;
}
