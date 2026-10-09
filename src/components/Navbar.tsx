'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  User as UserIcon,
  Sparkles,
  LogOut,
  UserCheck,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Smartphone,
  Menu,
} from 'lucide-react';

export default function Navbar() {
  const {
    currentRole,
    currentUser,
    users,
    activeTab,
    setActiveTab,
    logout,
    adminSelectedUserId,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    clearAllNotifications,
    setAdminSelectedUserId,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Executive Platform Overview';
      case 'users': return 'User & Publisher Management';
      case 'user-portfolio': return 'User-Wise Portfolio Control';
      case 'approvals': return 'Application Review Queue';
      case 'links': return 'App Link Management';
      case 'ad-accounts': return 'Ad Account Allocations';
      case 'revenue': return 'Revenue & Performance Analytics';
      case 'apps': return 'My Applications';
      case 'my-links': return 'Assigned Tracking Links';
      case 'campaigns': return 'Campaign & Attribution Hub';
      case 'my-ad-accounts': return 'Connected Ad Accounts';
      case 'settings': return 'Profile & Security Settings';
      default: return 'Dashboard';
    }
  };

  const publisherUsers = users.filter((u) => u.role === 'user');
  const targetUserHandle = publisherUsers.find((u) => u.id === adminSelectedUserId);

  const handleReviewNotification = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    setAdminSelectedUserId(notif.userId);
    setActiveTab('approvals');
    setIsNotifOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <h1 className="page-title">{getPageTitle()}</h1>
        <div className={`role-pill ${currentRole}`}>
          {currentRole === 'admin' ? (
            <>
              <Shield size={12} />
              Admin Portal
            </>
          ) : (
            <>
              <UserIcon size={12} />
              Publisher Mode
            </>
          )}
        </div>

        {/* Admin User-Wise Handle Indicator */}
        {currentRole === 'admin' && (
          <div
            className="navbar-handle-indicator"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: adminSelectedUserId !== 'all' ? 'rgba(99, 102, 241, 0.12)' : '#f1f5f9',
              border: '1px solid',
              borderColor: adminSelectedUserId !== 'all' ? 'var(--primary)' : 'var(--border-subtle)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.74rem',
            }}
          >
            <UserCheck size={12} color="var(--primary)" />
            <span style={{ color: 'var(--text-muted)' }}>Handle:</span>
            <strong style={{ color: adminSelectedUserId !== 'all' ? 'var(--primary)' : 'var(--text-main)', fontWeight: 700 }}>
              {targetUserHandle ? targetUserHandle.name : 'All Users'}
            </strong>
          </div>
        )}
      </div>

      <div className="navbar-right">
        {/* Notification Bell for Admin */}
        {currentRole === 'admin' && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="btn btn-secondary btn-icon"
              style={{ position: 'relative' }}
              title="Admin Alerts & App Submissions"
            >
              <Bell size={16} />
              {unreadNotificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: 'var(--danger)',
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-surface)',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                  }}
                >
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  width: '360px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '16px',
                  zIndex: 100,
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    <Bell size={14} color="var(--primary)" />
                    <span>Publisher App Submissions</span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <CheckCircle2 size={24} style={{ opacity: 0.4, marginBottom: 6 }} />
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          background: n.isRead ? '#f8fafc' : 'rgba(99, 102, 241, 0.08)',
                          border: '1px solid',
                          borderColor: n.isRead ? 'var(--border-subtle)' : 'var(--primary)',
                          borderRadius: 'var(--radius-md)',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Smartphone size={12} /> New App Submitted
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                            {new Date(n.timestamp).toLocaleDateString()}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {n.appName}
                        </div>

                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          By: <strong style={{ color: 'var(--text-main)' }}>{n.userName}</strong>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                          <button
                            onClick={() => handleReviewNotification(n)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            <span>Review & Assign</span>
                            <ExternalLink size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}



        {/* Current Active User Profile Card */}
        {currentUser && (
          <div className="user-profile-widget">
            {currentUser.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentUser.avatar} alt={currentUser.name} className="avatar" />
            ) : (
              <div className="avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)' }}>
                <Sparkles size={16} />
              </div>
            )}
            <div>
              <div className="user-meta-name">{currentUser.name}</div>
              <div className="user-meta-sub">{currentUser.email}</div>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="btn btn-secondary btn-icon"
          title="Sign Out to Login Page"
        >
          <LogOut size={16} color="var(--danger)" />
        </button>
      </div>
    </header>
  );
}
