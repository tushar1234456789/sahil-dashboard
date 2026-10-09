'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Layers, Plus, Target, DollarSign, BarChart2 } from 'lucide-react';

export default function UserCampaigns() {
  const { campaigns, apps, currentUser, getUserAdAccounts, createCampaign } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const userApprovedApps = apps.filter(
    (a) => a.userId === currentUser.id && a.status === 'approved'
  );
  const userAdAccounts = getUserAdAccounts(currentUser.id);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    appId: userApprovedApps[0]?.id || '',
    adAccountId: userAdAccounts[0]?.id || '',
    utmSource: 'ad_network',
    budgetDaily: 150,
  });

  const myCampaigns = campaigns.filter((c) => c.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.appId || !formData.adAccountId) return;
    const ok = createCampaign(formData);
    if (ok) {
      setFormData({
        name: '',
        appId: userApprovedApps[0]?.id || '',
        adAccountId: userAdAccounts[0]?.id || '',
        utmSource: 'ad_network',
        budgetDaily: 150,
      });
      setIsCreateOpen(false);
    }
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Ad Campaigns & App Attribution</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Map marketing campaigns and ad accounts to your approved apps to monitor ROI and attribution.
          </p>
        </div>

        <button
          onClick={() => {
            // update form defaults if needed
            setFormData((prev) => ({
              ...prev,
              appId: userApprovedApps[0]?.id || '',
              adAccountId: userAdAccounts[0]?.id || '',
            }));
            setIsCreateOpen(true);
          }}
          className="btn btn-primary"
          disabled={userApprovedApps.length === 0 || userAdAccounts.length === 0}
        >
          <Plus size={16} />
          <span>Assign New Campaign</span>
        </button>
      </div>

      {userApprovedApps.length === 0 && (
        <div className="card" style={{ marginBottom: 20, background: 'var(--warning-bg)', borderColor: 'var(--warning-border)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--warning)' }}>
            ⚠️ You need at least one <strong>Approved Application</strong> before you can assign campaigns.
          </p>
        </div>
      )}

      {userAdAccounts.length === 0 && (
        <div className="card" style={{ marginBottom: 20, background: 'var(--info-bg)', borderColor: 'var(--info-border)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--info)' }}>
            ℹ️ No ad accounts assigned to your profile yet. Ask your Platform Administrator to attach an ad account (Google Ads, Meta, TikTok) to your user account.
          </p>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Target App</th>
                <th>Linked Ad Account</th>
                <th>Daily Budget</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th style={{ textAlign: 'right' }}>Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {myCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                    <Layers size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <p style={{ fontWeight: 600 }}>No campaigns assigned yet.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: 4 }}>
                      Click &quot;Assign New Campaign&quot; above to link your ad account to an approved app.
                    </p>
                  </td>
                </tr>
              ) : (
                myCampaigns.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={16} color="var(--primary)" />
                        <strong style={{ color: 'var(--text-main)' }}>{c.name}</strong>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: 2 }}>
                        UTM: <code>{c.utmSource}</code>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-tag">{c.appName}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        {c.adAccountName}
                      </span>
                    </td>

                    <td style={{ fontWeight: 600 }}>${c.budgetDaily}/day</td>

                    <td>{c.impressions.toLocaleString()}</td>
                    <td>{c.clicks.toLocaleString()}</td>

                    <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 700 }}>
                      ${c.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Assign Campaign */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign Campaign to Application</h3>
              <button onClick={() => setIsCreateOpen(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Campaign Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. US Tier-1 Scaling Blitz"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Approved App</label>
                  <select
                    value={formData.appId}
                    onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                    className="select"
                  >
                    {userApprovedApps.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.platform})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ad Account (Assigned by Admin)</label>
                  <select
                    value={formData.adAccountId}
                    onChange={(e) => setFormData({ ...formData, adAccountId: e.target.value })}
                    className="select"
                  >
                    {userAdAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        [{a.network}] {a.accountName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">UTM / Tracking Source Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. google_uac, meta_advantage"
                    value={formData.utmSource}
                    onChange={(e) => setFormData({ ...formData, utmSource: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Daily Budget (USD)</label>
                  <input
                    type="number"
                    min={10}
                    step={10}
                    value={formData.budgetDaily}
                    onChange={(e) => setFormData({ ...formData, budgetDaily: Number(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>Assign Campaign</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
