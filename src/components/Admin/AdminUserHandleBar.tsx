'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UserCheck, X, ChevronRight, Smartphone, CreditCard, DollarSign } from 'lucide-react';

export default function AdminUserHandleBar() {
  const {
    users,
    adminSelectedUserId,
    setAdminSelectedUserId,
    apps,
    getUserAdAccounts,
    revenueMetrics,
    setActiveTab,
    getUserPendingAppCount,
  } = useApp();

  const publisherUsers = users.filter((u) => u.role === 'user');
  const selectedUser = publisherUsers.find((u) => u.id === adminSelectedUserId);

  // If a specific user is selected, gather their user-wise metrics
  const userApps = selectedUser ? apps.filter((a) => a.userId === selectedUser.id) : [];
  const userAds = selectedUser ? getUserAdAccounts(selectedUser.id) : [];
  const userAppIds = userApps.map((a) => a.id);
  const userRevenue = selectedUser
    ? revenueMetrics
        .filter((m) => m.userId === selectedUser.id || userAppIds.includes(m.appId))
        .reduce((sum, m) => sum + m.revenueUsd, 0)
    : 0;

  return (
    <div className="admin-handle-container">
      <div className="admin-handle-inner">
        {/* User Handle Selector */}
        <div className="admin-handle-left">
          <div className="admin-handle-label">
            <UserCheck size={16} color="var(--primary)" />
            <span>User-Wise Handle:</span>
          </div>

          <div className="admin-handle-select-group">
            <select
              value={adminSelectedUserId}
              onChange={(e) => setAdminSelectedUserId(e.target.value)}
              className="select admin-handle-select"
            >
              <option value="all">🌐 All Users (Global Platform View)</option>
              {publisherUsers.map((u) => {
                const pendingCount = getUserPendingAppCount(u.id);
                return (
                  <option key={u.id} value={u.id}>
                    👤 {u.name} {pendingCount > 0 ? `(⚡ ${pendingCount} pending)` : ''}
                  </option>
                );
              })}
            </select>

            {adminSelectedUserId !== 'all' && (
              <button
                onClick={() => setAdminSelectedUserId('all')}
                className="btn btn-secondary btn-sm admin-handle-clear-btn"
                title="Reset to All Users"
              >
                <X size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* User-wise Quick Stats & Actions */}
        {selectedUser ? (
          <div className="admin-handle-right">
            <div className="admin-handle-metrics">
              <span className="admin-handle-metric-pill">
                <Smartphone size={13} color="var(--primary)" />
                <strong>{userApps.length}</strong> Apps
              </span>
              <span className="admin-handle-metric-pill">
                <CreditCard size={13} color="var(--warning)" />
                <strong>{userAds.length}</strong> Ad Acc
              </span>
              <span className="admin-handle-metric-pill">
                <DollarSign size={13} color="var(--success)" />
                <strong style={{ color: 'var(--success)' }}>${userRevenue.toFixed(2)}</strong>
              </span>
            </div>

            <button
              onClick={() => setActiveTab('user-portfolio')}
              className="btn btn-secondary btn-sm admin-handle-portfolio-btn"
            >
              <span>Full Portfolio</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="admin-handle-hint">
            Filter all platform approvals, links, and accounts by publisher handle.
          </div>
        )}
      </div>
    </div>
  );
}
