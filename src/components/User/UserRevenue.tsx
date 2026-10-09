'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DollarSign, BarChart3, TrendingUp, Eye, MousePointer, Filter } from 'lucide-react';

export default function UserRevenue() {
  const { revenueMetrics, apps, currentUser } = useApp();
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>('all');

  // Filter metrics belonging to this user's apps
  const userApps = apps.filter((a) => a.userId === currentUser.id);
  const userAppIds = userApps.map((a) => a.id);

  const filteredMetrics = revenueMetrics.filter((m) => {
    // If metric is tied to user or to an app owned by user
    const isUserMetric = m.userId === currentUser.id || userAppIds.includes(m.appId);
    if (!isUserMetric) return false;
    if (selectedAppFilter !== 'all' && m.appId !== selectedAppFilter) return false;
    return true;
  });

  // Calculate totals
  const totalRevenue = filteredMetrics.reduce((sum, m) => sum + m.revenueUsd, 0);
  const totalImpressions = filteredMetrics.reduce((sum, m) => sum + m.impressions, 0);
  const totalClicks = filteredMetrics.reduce((sum, m) => sum + m.clicks, 0);
  const avgEcpm =
    totalImpressions > 0 ? (totalRevenue / (totalImpressions / 1000)).toFixed(2) : '0.00';
  const ctr =
    totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  // Group by date for daily chart
  const dateMap: { [date: string]: number } = {};
  filteredMetrics.forEach((m) => {
    dateMap[m.date] = (dateMap[m.date] || 0) + m.revenueUsd;
  });
  const chartDates = Object.keys(dateMap).sort();
  const maxRevenueInChart = Math.max(...Object.values(dateMap), 100);

  return (
    <div>
      {/* Top Filter Bar */}
      <div className="page-header-flex">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Publisher Monetization Dashboard</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time revenue attribution, ad network earnings, and monetization KPIs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Filter size={16} color="var(--text-dim)" />
          <select
            value={selectedAppFilter}
            onChange={(e) => setSelectedAppFilter(e.target.value)}
            className="select"
            style={{ width: '200px', maxWidth: '100%' }}
          >
            <option value="all">All My Applications</option>
            {userApps.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Net Ad Revenue</span>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            <span>Monetized ad returns</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Average eCPM</span>
            <div className="stat-icon">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="stat-value">${avgEcpm}</div>
          <div className="stat-change positive">
            <span>Effective revenue per 1K impressions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Total Impressions</span>
            <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              <Eye size={20} />
            </div>
          </div>
          <div className="stat-value">{totalImpressions.toLocaleString()}</div>
          <div className="stat-change neutral">
            <span>Delivered across ad units</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-label">Ad Clicks (CTR)</span>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <MousePointer size={20} />
            </div>
          </div>
          <div className="stat-value">
            {totalClicks.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>({ctr}%)</span>
          </div>
          <div className="stat-change positive">
            <span>Click-through interaction</span>
          </div>
        </div>
      </div>

      {/* Visual Chart: Revenue Over Time */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Daily Revenue Trend</h3>
            <p className="card-subtitle">Aggregated earnings day-by-day across connected ad networks</p>
          </div>
          <span className="badge badge-tag">Last 7 Days</span>
        </div>

        {chartDates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No revenue recorded for the selected filter.
          </div>
        ) : (
          <div className="chart-container">
            {chartDates.map((date) => {
              const amount = dateMap[date] || 0;
              const heightPct = Math.round((amount / maxRevenueInChart) * 180);
              const dayLabel = new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });

              return (
                <div key={date} className="chart-bar-group">
                  <div className="chart-bar-val">${amount.toFixed(0)}</div>
                  <div
                    className="chart-bar"
                    style={{ height: `${Math.max(heightPct, 15)}px` }}
                    title={`${date}: $${amount.toFixed(2)}`}
                  />
                  <div className="chart-bar-label">{dayLabel}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Breakdown Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 className="card-title">Detailed Revenue Performance Logs</h3>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Application</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>eCPM</th>
                <th style={{ textAlign: 'right' }}>Revenue (USD)</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    No revenue log entries found.
                  </td>
                </tr>
              ) : (
                filteredMetrics.map((m) => (
                  <tr key={m.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.date}</td>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{m.appName}</strong>
                    </td>
                    <td>{m.impressions.toLocaleString()}</td>
                    <td>{m.clicks.toLocaleString()}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>${m.ecpm.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 700 }}>
                      ${m.revenueUsd.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
