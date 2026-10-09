'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Users, CheckSquare, Smartphone, DollarSign, ArrowUpRight, Clock, Plus, ExternalLink } from 'lucide-react';

export default function AdminOverview() {
  const { users, apps, revenueMetrics, setActiveTab } = useApp();

  const totalUsers = users.length;
  const pendingApps = apps.filter((a) => a.status === 'pending');
  const approvedApps = apps.filter((a) => a.status === 'approved');
  const totalRevenue = revenueMetrics.reduce((sum, r) => sum + r.revenueUsd, 0);

  return (
    <div>
      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Total Users</span>
            <div className="stat-icon">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} />
            <span>Active publishers & managers</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Pending Reviews</span>
            <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: pendingApps.length > 0 ? 'var(--warning)' : 'var(--text-main)' }}>
            {pendingApps.length}
          </div>
          <div className="stat-change neutral">
            <span>Awaiting administrator approval</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Approved Apps</span>
            <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
              <Smartphone size={20} />
            </div>
          </div>
          <div className="stat-value">{approvedApps.length}</div>
          <div className="stat-change positive">
            <span>Ready with assigned links</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Platform Gross Revenue</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} />
            <span>Past 7 days aggregated</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Quick Shortcuts */}
      <div className="overview-main-grid">
        {/* Pending Apps Queue */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <CheckSquare size={18} color="var(--primary)" />
                Apps Requiring Immediate Review
              </h3>
              <p className="card-subtitle">Publishers waiting for approval and link assignments</p>
            </div>
            <button onClick={() => setActiveTab('approvals')} className="btn btn-secondary btn-sm">
              View All Approvals
            </button>
          </div>

          {pendingApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <CheckSquare size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p style={{ fontWeight: 600 }}>All applications have been reviewed!</p>
              <p style={{ fontSize: '0.8rem', marginTop: 4 }}>New publisher submissions will appear here automatically.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>App Name</th>
                    <th>Publisher</th>
                    <th>Platform</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApps.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{app.bundleId}</div>
                      </td>
                      <td>{app.userName}</td>
                      <td>
                        <span className="badge badge-tag">{app.platform}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => setActiveTab('approvals')}
                          className="btn btn-primary btn-sm"
                        >
                          Review Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Operations Sidebar Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Operations</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setActiveTab('users')}
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start' }}
            >
              <Plus size={16} />
              <span>Provision New User</span>
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start' }}
            >
              <CheckSquare size={16} />
              <span>Process App Approvals</span>
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start' }}
            >
              <ExternalLink size={16} />
              <span>Assign Links to Apps</span>
            </button>

            <button
              onClick={() => setActiveTab('ad-accounts')}
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start' }}
            >
              <Users size={16} />
              <span>Manage Ad Accounts</span>
            </button>
          </div>

          <div style={{ marginTop: 24, padding: 14, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
              Administrator Privilege
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              You have full administrative authority to create and delete users, approve or reject applications, assign multiple tracking links, and manage ad accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
