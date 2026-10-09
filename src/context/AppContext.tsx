'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  App,
  AdAccount,
  UserAdAccountMapping,
  Campaign,
  RevenueMetric,
  ToastMessage,
  AdminNotification,
  UserRole,
  PlatformType,
  AppLink,
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_AD_ACCOUNTS,
  INITIAL_USER_AD_ACCOUNTS,
  INITIAL_APPS,
  INITIAL_CAMPAIGNS,
  INITIAL_REVENUE_METRICS,
} from '@/lib/mockData';

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    type: 'new_app',
    appId: 'app-3',
    appName: 'Quantum Sudoku Master',
    userId: 'user-publisher-2',
    userName: 'Elena Rostova',
    timestamp: '2026-10-08T16:20:00Z',
    isRead: false,
  },
];

interface AppContextType {
  users: User[];
  apps: App[];
  adAccounts: AdAccount[];
  userAdAccounts: UserAdAccountMapping[];
  campaigns: Campaign[];
  revenueMetrics: RevenueMetric[];
  notifications: AdminNotification[];
  currentRole: UserRole;
  currentUser: User;
  isAuthenticated: boolean;
  activeTab: string;
  toasts: ToastMessage[];
  adminSelectedUserId: string | 'all';
  unreadNotificationCount: number;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  setAdminSelectedUserId: (id: string | 'all') => void;
  setActiveTab: (tab: string) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole, targetUserId?: string) => void;
  createUser: (data: { name: string; email: string; password: string }) => boolean;
  deleteUser: (userId: string) => void;
  updateUserProfile: (name: string) => boolean;
  changeUserPassword: (currentPass: string, newPass: string) => boolean;
  submitApp: (data: {
    name: string;
    platform: PlatformType;
    bundleId: string;
    storeUrl?: string;
    notes?: string;
  }) => boolean;
  approveApp: (appId: string) => void;
  rejectApp: (appId: string, reason: string) => void;
  approveAndProvisionApp: (
    appId: string,
    links: { title: string; url: string; linkType: AppLink['linkType'] }[],
    adAccountId?: string
  ) => void;
  assignLinkToApp: (
    appId: string,
    linkData: { title: string; url: string; linkType: AppLink['linkType'] }
  ) => void;
  removeLinkFromApp: (appId: string, linkId: string) => void;
  assignAdAccountToUser: (userId: string, adAccountId: string) => boolean;
  removeAdAccountFromUser: (userId: string, adAccountId: string) => void;
  createCampaign: (data: {
    appId: string;
    adAccountId: string;
    name: string;
    utmSource?: string;
    budgetDaily: number;
  }) => boolean;
  updateCampaign: (
    campaignId: string,
    data: { name: string; budgetDaily: number; utmSource?: string; status: 'active' | 'paused' | 'completed' }
  ) => boolean;
  deleteCampaign: (campaignId: string) => void;
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  getUserAdAccounts: (userId: string) => AdAccount[];
  getUserPendingAppCount: (userId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'sahil_dashboard_';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to storage', e);
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadFromStorage('users', INITIAL_USERS));
  const [apps, setApps] = useState<App[]>(() => loadFromStorage('apps', INITIAL_APPS));
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>(() =>
    loadFromStorage('ad_accounts', INITIAL_AD_ACCOUNTS)
  );
  const [userAdAccounts, setUserAdAccounts] = useState<UserAdAccountMapping[]>(() =>
    loadFromStorage('user_ad_accounts', INITIAL_USER_AD_ACCOUNTS)
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>(() =>
    loadFromStorage('campaigns', INITIAL_CAMPAIGNS)
  );
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetric[]>(() =>
    loadFromStorage('revenue_metrics', INITIAL_REVENUE_METRICS)
  );
  const [notifications, setNotifications] = useState<AdminNotification[]>(() =>
    loadFromStorage('notifications', INITIAL_NOTIFICATIONS)
  );

  const [currentRole, setCurrentRole] = useState<UserRole>(() =>
    loadFromStorage('current_role', 'admin')
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    loadFromStorage('current_user_id', 'user-admin-1')
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadFromStorage('is_authenticated', true)
  );
  const [adminSelectedUserId, setAdminSelectedUserId] = useState<string | 'all'>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Sync state to storage
  useEffect(() => {
    saveToStorage('users', users);
  }, [users]);
  useEffect(() => {
    saveToStorage('apps', apps);
  }, [apps]);
  useEffect(() => {
    saveToStorage('ad_accounts', adAccounts);
  }, [adAccounts]);
  useEffect(() => {
    saveToStorage('user_ad_accounts', userAdAccounts);
  }, [userAdAccounts]);
  useEffect(() => {
    saveToStorage('campaigns', campaigns);
  }, [campaigns]);
  useEffect(() => {
    saveToStorage('revenue_metrics', revenueMetrics);
  }, [revenueMetrics]);
  useEffect(() => {
    saveToStorage('notifications', notifications);
  }, [notifications]);
  useEffect(() => {
    saveToStorage('current_role', currentRole);
  }, [currentRole]);
  useEffect(() => {
    saveToStorage('current_user_id', currentUserId);
  }, [currentUserId]);
  useEffect(() => {
    saveToStorage('is_authenticated', isAuthenticated);
  }, [isAuthenticated]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getUserPendingAppCount = (userId: string) => {
    return apps.filter((a) => a.userId === userId && a.status === 'pending').length;
  };

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!foundUser) {
      addToast('Login Failed', 'No account exists with this email address.', 'error');
      return false;
    }

    if (foundUser.password && foundUser.password !== password) {
      addToast('Login Failed', 'Incorrect password. Please verify and try again.', 'error');
      return false;
    }

    setCurrentUserId(foundUser.id);
    setCurrentRole(foundUser.role);
    setIsAuthenticated(true);
    setActiveTab(foundUser.role === 'admin' ? 'overview' : 'revenue');
    addToast(
      'Login Successful',
      `Welcome back, ${foundUser.name}! (${foundUser.role.toUpperCase()})`,
      'success'
    );
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    addToast('Logged Out', 'You have been securely logged out.', 'info');
  };

  const switchRole = (role: UserRole, targetUserId?: string) => {
    if (role === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || users[0];
      setCurrentRole('admin');
      setCurrentUserId(adminUser.id);
      setIsAuthenticated(true);
      setActiveTab('overview');
      addToast('Role Switched', `Now viewing as Admin: ${adminUser.name}`, 'info');
    } else {
      const userToPick = targetUserId
        ? users.find((u) => u.id === targetUserId)
        : users.find((u) => u.role === 'user') || users[1];
      if (userToPick) {
        setCurrentRole('user');
        setCurrentUserId(userToPick.id);
        setIsAuthenticated(true);
        setActiveTab('revenue');
        addToast('Role Switched', `Now viewing as Publisher: ${userToPick.name}`, 'info');
      }
    }
  };

  // ADMIN ACTION: Create User
  const createUser = (data: { name: string; email: string; password: string }) => {
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      addToast('Validation Error', 'A user with this email address already exists.', 'error');
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 50)}?auto=format&fit=crop&w=150&q=80`,
    };
    setUsers((prev) => [newUser, ...prev]);
    addToast('User Created', `Successfully provisioned ${newUser.name} (${newUser.email})`, 'success');
    return true;
  };

  // ADMIN ACTION: Delete User
  const deleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    if (target.role === 'admin') {
      addToast('Action Prohibited', 'Primary administrator accounts cannot be deleted.', 'error');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setUserAdAccounts((prev) => prev.filter((m) => m.userId !== userId));
    if (adminSelectedUserId === userId) {
      setAdminSelectedUserId('all');
    }
    addToast('User Deleted', `Account ${target.name} has been removed.`, 'warning');
  };

  // USER ACTION: Update Profile
  const updateUserProfile = (name: string) => {
    if (!name.trim()) {
      addToast('Validation Error', 'Name cannot be empty.', 'error');
      return false;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, name: name.trim() } : u))
    );
    addToast('Profile Updated', 'Your name was updated successfully.', 'success');
    return true;
  };

  // USER ACTION: Change Password
  const changeUserPassword = (currentPass: string, newPass: string) => {
    if (currentUser.password && currentUser.password !== currentPass) {
      addToast('Security Error', 'Current password is not correct.', 'error');
      return false;
    }
    if (newPass.length < 6) {
      addToast('Validation Error', 'New password must be at least 6 characters.', 'error');
      return false;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPass } : u))
    );
    addToast('Security Updated', 'Your password was changed successfully.', 'success');
    return true;
  };

  // USER ACTION: Submit App for Approval -> Triggers notification to Admin!
  const submitApp = (data: {
    name: string;
    platform: PlatformType;
    bundleId: string;
    storeUrl?: string;
    notes?: string;
  }) => {
    if (apps.some((a) => a.bundleId.toLowerCase() === data.bundleId.toLowerCase() && a.status !== 'rejected')) {
      addToast('Submission Error', 'An app with this Bundle ID / Package Name is already registered.', 'error');
      return false;
    }
    const newApp: App = {
      id: `app-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      name: data.name.trim(),
      platform: data.platform,
      bundleId: data.bundleId.trim(),
      storeUrl: data.storeUrl?.trim() || '',
      notes: data.notes?.trim() || '',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      links: [],
    };
    setApps((prev) => [newApp, ...prev]);

    // Create Notification for Admin
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'new_app',
      appId: newApp.id,
      appName: newApp.name,
      userId: newApp.userId,
      userName: newApp.userName,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('App Submitted', `"${newApp.name}" submitted. Admin received a notification badge.`, 'success');
    return true;
  };

  // ADMIN ACTION: Approve App
  const approveApp = (appId: string) => {
    const target = apps.find((a) => a.id === appId);
    if (!target) return;
    setApps((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              rejectionReason: undefined,
            }
          : a
      )
    );
    // Mark related notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.appId === appId ? { ...n, isRead: true } : n))
    );
    addToast('App Approved', `"${target.name}" is now approved.`, 'success');
  };

  // ADMIN ACTION: Multi-Link and Ad Account Provisioning in One Flow
  const approveAndProvisionApp = (
    appId: string,
    links: { title: string; url: string; linkType: AppLink['linkType'] }[],
    adAccountId?: string
  ) => {
    const target = apps.find((a) => a.id === appId);
    if (!target) return;

    const newLinks: AppLink[] = links
      .filter((l) => l.title.trim() && l.url.trim())
      .map((l, idx) => ({
        id: `link-${Date.now()}-${idx}`,
        appId,
        title: l.title.trim(),
        url: l.url.trim(),
        linkType: l.linkType,
        isActive: true,
        createdAt: new Date().toISOString(),
      }));

    // Approve and attach multiple links
    setApps((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              rejectionReason: undefined,
              links: [...newLinks, ...a.links],
            }
          : a
      )
    );

    // If ad account is selected, assign to this user
    if (adAccountId) {
      const alreadyHas = userAdAccounts.some(
        (m) => m.userId === target.userId && m.adAccountId === adAccountId
      );
      if (!alreadyHas) {
        const newMapping: UserAdAccountMapping = {
          id: `map-${Date.now()}`,
          userId: target.userId,
          adAccountId,
          assignedAt: new Date().toISOString(),
        };
        setUserAdAccounts((prev) => [...prev, newMapping]);
      }
    }

    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.appId === appId ? { ...n, isRead: true } : n))
    );

    addToast(
      'App Approved & Provisioned',
      `"${target.name}" approved with ${newLinks.length} link(s) and assigned ad account!`,
      'success'
    );
  };

  // ADMIN ACTION: Reject App
  const rejectApp = (appId: string, reason: string) => {
    const target = apps.find((a) => a.id === appId);
    if (!target) return;
    setApps((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'rejected',
              rejectionReason: reason.trim() || 'Did not meet submission guidelines.',
              reviewedAt: new Date().toISOString(),
            }
          : a
      )
    );
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.appId === appId ? { ...n, isRead: true } : n))
    );
    addToast('App Rejected', `"${target.name}" was rejected with feedback.`, 'warning');
  };

  // ADMIN ACTION: Assign Link to specific app
  const assignLinkToApp = (
    appId: string,
    linkData: { title: string; url: string; linkType: AppLink['linkType'] }
  ) => {
    const newLink: AppLink = {
      id: `link-${Date.now()}`,
      appId,
      title: linkData.title.trim(),
      url: linkData.url.trim(),
      linkType: linkData.linkType,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setApps((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              links: [newLink, ...a.links],
            }
          : a
      )
    );
    addToast('Link Assigned', `Added "${linkData.title}" to app.`, 'success');
  };

  // ADMIN ACTION: Remove Link from app
  const removeLinkFromApp = (appId: string, linkId: string) => {
    setApps((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              links: a.links.filter((l) => l.id !== linkId),
            }
          : a
      )
    );
    addToast('Link Removed', 'Assigned link was removed from app.', 'info');
  };

  // ADMIN ACTION: Assign Ad account to user
  const assignAdAccountToUser = (userId: string, adAccountId: string) => {
    const alreadyMapped = userAdAccounts.some(
      (m) => m.userId === userId && m.adAccountId === adAccountId
    );
    if (alreadyMapped) {
      addToast('Already Assigned', 'This ad account is already attached to this user.', 'warning');
      return false;
    }
    const newMapping: UserAdAccountMapping = {
      id: `map-${Date.now()}`,
      userId,
      adAccountId,
      assignedAt: new Date().toISOString(),
    };
    setUserAdAccounts((prev) => [...prev, newMapping]);
    const targetUser = users.find((u) => u.id === userId);
    const targetAcc = adAccounts.find((a) => a.id === adAccountId);
    addToast(
      'Ad Account Assigned',
      `Attached ${targetAcc?.accountName} to ${targetUser?.name}.`,
      'success'
    );
    return true;
  };

  // ADMIN ACTION: Remove Ad account from user
  const removeAdAccountFromUser = (userId: string, adAccountId: string) => {
    setUserAdAccounts((prev) =>
      prev.filter((m) => !(m.userId === userId && m.adAccountId === adAccountId))
    );
    addToast('Ad Account Revoked', 'Ad account access removed for user.', 'info');
  };

  // USER ACTION: Assign campaigns to a particular app
  const createCampaign = (data: {
    appId: string;
    adAccountId: string;
    name: string;
    utmSource?: string;
    budgetDaily: number;
  }) => {
    const targetApp = apps.find((a) => a.id === data.appId);
    const targetAcc = adAccounts.find((a) => a.id === data.adAccountId);
    if (!targetApp || !targetAcc) {
      addToast('Error', 'Invalid app or ad account selection.', 'error');
      return false;
    }
    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      userId: currentUser.id,
      appId: data.appId,
      appName: targetApp.name,
      adAccountId: data.adAccountId,
      adAccountName: targetAcc.accountName,
      name: data.name.trim(),
      utmSource: data.utmSource?.trim() || 'direct',
      status: 'active',
      budgetDaily: Number(data.budgetDaily) || 100,
      totalSpent: 0,
      revenue: 0,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    addToast('Campaign Created', `Assigned "${newCampaign.name}" to ${targetApp.name}.`, 'success');
    return true;
  };

  const updateCampaign = (
    campaignId: string,
    data: { name: string; budgetDaily: number; utmSource?: string; status: 'active' | 'paused' | 'completed' }
  ) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              name: data.name.trim(),
              budgetDaily: Number(data.budgetDaily) || c.budgetDaily,
              utmSource: data.utmSource !== undefined ? data.utmSource.trim() : c.utmSource,
              status: data.status,
            }
          : c
      )
    );
    addToast('Campaign Updated', 'Campaign changes saved successfully.', 'success');
    return true;
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    addToast('Campaign Deleted', 'Campaign removed from this application.', 'warning');
  };

  const getUserAdAccounts = (userId: string) => {
    const mappedIds = userAdAccounts.filter((m) => m.userId === userId).map((m) => m.adAccountId);
    return adAccounts.filter((a) => mappedIds.includes(a.id));
  };

  return (
    <AppContext.Provider
      value={{
        users,
        apps,
        adAccounts,
        userAdAccounts,
        campaigns,
        revenueMetrics,
        notifications,
        currentRole,
        currentUser,
        isAuthenticated,
        activeTab,
        toasts,
        adminSelectedUserId,
        unreadNotificationCount,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        setAdminSelectedUserId,
        setActiveTab,
        login,
        logout,
        switchRole,
        createUser,
        deleteUser,
        updateUserProfile,
        changeUserPassword,
        submitApp,
        approveApp,
        approveAndProvisionApp,
        rejectApp,
        assignLinkToApp,
        removeLinkFromApp,
        assignAdAccountToUser,
        removeAdAccountFromUser,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        addToast,
        removeToast,
        markNotificationAsRead,
        clearAllNotifications,
        getUserAdAccounts,
        getUserPendingAppCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
