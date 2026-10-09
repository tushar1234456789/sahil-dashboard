'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Link2,
  CreditCard,
  BarChart3,
  Smartphone,
  Layers,
  Settings,
  Layers3,
  UserCheck,
  LogOut,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    apps,
    logout,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useApp();

  const pendingApprovalsCount = apps.filter((a) => a.status === 'pending').length;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Layers3 size={20} />
          </div>
          <div className="sidebar-title-box" style={{ flex: 1 }}>
            <h2>OmniApp Hub</h2>
            <span>{currentRole === 'admin' ? 'Admin Portal' : 'Publisher Workspace'}</span>
          </div>
          {/* Mobile Close Button */}
          <button
            className="sidebar-mobile-close"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {currentRole === 'admin' ? (
          <>
            <div className="nav-section-label">Management Controls</div>
            <button
              onClick={() => handleNavClick('overview')}
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Platform Overview</span>
            </button>

            <button
              onClick={() => handleNavClick('users')}
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Manage Users</span>
            </button>

            <button
              onClick={() => handleNavClick('user-portfolio')}
              className={`nav-item ${activeTab === 'user-portfolio' ? 'active' : ''}`}
            >
              <UserCheck size={18} />
              <span>User-Wise Portfolio</span>
            </button>

            <button
              onClick={() => handleNavClick('approvals')}
              className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            >
              <CheckSquare size={18} />
              <span>App Approvals</span>
              {pendingApprovalsCount > 0 && (
                <span className="nav-badge">{pendingApprovalsCount}</span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('links')}
              className={`nav-item ${activeTab === 'links' ? 'active' : ''}`}
            >
              <Link2 size={18} />
              <span>Assign Links</span>
            </button>

            <button
              onClick={() => handleNavClick('ad-accounts')}
              className={`nav-item ${activeTab === 'ad-accounts' ? 'active' : ''}`}
            >
              <CreditCard size={18} />
              <span>Ad Accounts</span>
            </button>
          </>
        ) : (
          <>
            <div className="nav-section-label">Monetization & Growth</div>
            <button
              onClick={() => handleNavClick('revenue')}
              className={`nav-item ${activeTab === 'revenue' ? 'active' : ''}`}
            >
              <BarChart3 size={18} />
              <span>Revenue Metrics</span>
            </button>

            <button
              onClick={() => handleNavClick('apps')}
              className={`nav-item ${activeTab === 'apps' ? 'active' : ''}`}
            >
              <Smartphone size={18} />
              <span>My Applications</span>
            </button>

            <button
              onClick={() => handleNavClick('my-links')}
              className={`nav-item ${activeTab === 'my-links' ? 'active' : ''}`}
            >
              <Link2 size={18} />
              <span>Assigned Links</span>
            </button>

            <button
              onClick={() => handleNavClick('my-ad-accounts')}
              className={`nav-item ${activeTab === 'my-ad-accounts' ? 'active' : ''}`}
            >
              <CreditCard size={18} />
              <span>My Ad Accounts</span>
            </button>

            <div className="nav-section-label" style={{ marginTop: 14 }}>
              Account Settings
            </div>
            <button
              onClick={() => handleNavClick('settings')}
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>Profile & Password</span>
            </button>
          </>
        )}
      </nav>

      {/* Sidebar Footer Info & Logout */}
      <div className="sidebar-footer">
        <button
          onClick={() => {
            setIsMobileSidebarOpen(false);
            logout();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger)',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 12,
            transition: 'var(--transition)',
          }}
        >
          <LogOut size={14} />
          <span>Sign Out / Switch Login</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          <span>Version 1.1.0</span>
          <span style={{ color: 'var(--success)' }}>● System Online</span>
        </div>
      </div>
    </aside>
    </>
  );
}
