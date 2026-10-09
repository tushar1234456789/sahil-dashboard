'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ToastContainer from './ToastContainer';
import LoginPage from './Auth/LoginPage';

// Admin Views
import AdminOverview from './Admin/AdminOverview';
import AdminUsers from './Admin/AdminUsers';
import AdminApprovals from './Admin/AdminApprovals';
import AdminLinks from './Admin/AdminLinks';
import AdminAdAccounts from './Admin/AdminAdAccounts';
import AdminUserPortfolio from './Admin/AdminUserPortfolio';
import AdminUserHandleBar from './Admin/AdminUserHandleBar';

// User Views
import UserRevenue from './User/UserRevenue';
import UserApps from './User/UserApps';
import UserLinks from './User/UserLinks';
import UserCampaigns from './User/UserCampaigns';
import UserAdAccounts from './User/UserAdAccounts';
import UserSettings from './User/UserSettings';

export default function DashboardShell() {
  const { currentRole, activeTab, isAuthenticated } = useApp();

  // If user is not logged in, show the Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'overview': return <AdminOverview />;
        case 'users': return <AdminUsers />;
        case 'user-portfolio': return <AdminUserPortfolio />;
        case 'approvals': return <AdminApprovals />;
        case 'links': return <AdminLinks />;
        case 'ad-accounts': return <AdminAdAccounts />;
        default: return <AdminOverview />;
      }
    } else {
      switch (activeTab) {
        case 'revenue': return <UserRevenue />;
        case 'apps': return <UserApps />;
        case 'my-links': return <UserLinks />;
        case 'campaigns': return <UserApps />;
        case 'my-ad-accounts': return <UserAdAccounts />;
        case 'settings': return <UserSettings />;
        default: return <UserRevenue />;
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content-body">
          {/* Admin User-Wise Handle Bar */}
          {currentRole === 'admin' && activeTab !== 'user-portfolio' && (
            <AdminUserHandleBar />
          )}
          {renderActiveView()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
