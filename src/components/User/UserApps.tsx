'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Smartphone,
  Plus,
  ExternalLink,
  Link2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  Copy,
  Check,
  Edit2,
  Trash2,
  Target,
  DollarSign,
  BarChart2,
  X,
} from 'lucide-react';
import { PlatformType, Campaign } from '@/types';

export default function UserApps() {
  const {
    apps,
    campaigns,
    currentUser,
    submitApp,
    addToast,
    getUserAdAccounts,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  } = useApp();

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // App Submission Form State
  const [formData, setFormData] = useState<{
    name: string;
    platform: PlatformType;
    bundleId: string;
    storeUrl: string;
    notes: string;
  }>({
    name: '',
    platform: 'Android',
    bundleId: '',
    storeUrl: '',
    notes: '',
  });

  // Modal 1: Attached Links Modal
  const [activeLinksAppId, setActiveLinksAppId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Modal 2: App Campaigns Modal
  const [activeCampaignsAppId, setActiveCampaignsAppId] = useState<string | null>(null);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // New Campaign Form State
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    adAccountId: '',
    utmSource: 'app_direct',
    budgetDaily: 150,
  });

  // Edit Campaign Form State
  const [editCampaignForm, setEditCampaignForm] = useState({
    name: '',
    budgetDaily: 150,
    utmSource: '',
    status: 'active' as Campaign['status'],
  });

  const myApps = apps.filter((a) => a.userId === currentUser.id);
  const userAdAccounts = getUserAdAccounts(currentUser.id);

  const activeLinksApp = apps.find((a) => a.id === activeLinksAppId);
  const activeCampaignsApp = apps.find((a) => a.id === activeCampaignsAppId);
  const activeAppCampaigns = activeCampaignsApp
    ? campaigns.filter((c) => c.appId === activeCampaignsApp.id)
    : [];

  const handleAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.bundleId) return;
    const ok = submitApp(formData);
    if (ok) {
      setFormData({
        name: '',
        platform: 'Android',
        bundleId: '',
        storeUrl: '',
        notes: '',
      });
      setIsSubmitOpen(false);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkId(id);
    addToast('Link Copied!', 'Tracking URL copied to clipboard.', 'success');
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCampaignsApp || !newCampaignForm.name || !newCampaignForm.adAccountId) return;
    const ok = createCampaign({
      appId: activeCampaignsApp.id,
      adAccountId: newCampaignForm.adAccountId,
      name: newCampaignForm.name,
      utmSource: newCampaignForm.utmSource,
      budgetDaily: Number(newCampaignForm.budgetDaily) || 100,
    });
    if (ok) {
      setNewCampaignForm({
        name: '',
        adAccountId: userAdAccounts[0]?.id || '',
        utmSource: 'app_direct',
        budgetDaily: 150,
      });
      setIsNewCampaignOpen(false);
    }
  };

  const handleEditCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    updateCampaign(editingCampaign.id, editCampaignForm);
    setEditingCampaign(null);
  };

  return (
    <div>
      {/* Top Banner & Submission Button */}
      <div className="page-header-flex">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>My Applications & Monetization</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Manage your apps, inspect attached tracking links, and configure marketing campaigns per app.
          </p>
        </div>

        <button onClick={() => setIsSubmitOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Submit App for Approval</span>
        </button>
      </div>

      {/* Apps Grid */}
      <div className="apps-grid">
        {myApps.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Smartphone size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: 4 }}>No Applications Yet</h3>
            <p style={{ fontSize: '0.85rem' }}>Submit your first application to start receiving tracking links and running campaigns.</p>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="btn btn-primary"
              style={{ marginTop: 18 }}
            >
              <Plus size={16} />
              <span>Submit Now</span>
            </button>
          </div>
        ) : (
          myApps.map((app) => {
            const appCampaignsCount = campaigns.filter((c) => c.appId === app.id).length;

            return (
              <div key={app.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 22 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Smartphone size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{app.name}</h3>
                      <span className="badge badge-tag" style={{ fontSize: '0.7rem' }}>
                        {app.platform}
                      </span>
                    </div>
                  </div>

                  <span className={`badge badge-${app.status}`}>
                    {app.status === 'pending' && <><Clock size={12} /> Pending</>}
                    {app.status === 'approved' && <><CheckCircle2 size={12} /> Approved</>}
                    {app.status === 'rejected' && <><AlertCircle size={12} /> Rejected</>}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Bundle ID:{' '}
                  <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#1e293b', fontWeight: 600 }}>
                    {app.bundleId}
                  </code>
                </div>

                {app.storeUrl && (
                  <div style={{ marginBottom: 12 }}>
                    <a
                      href={app.storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.78rem',
                        color: 'var(--primary)',
                        textDecoration: 'underline',
                      }}
                    >
                      <ExternalLink size={12} /> Store Listing
                    </a>
                  </div>
                )}

                {/* Status Specific Notes */}
                {app.status === 'rejected' && app.rejectionReason && (
                  <div
                    style={{
                      padding: '10px 12px',
                      background: 'var(--danger-bg)',
                      border: '1px solid var(--danger-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      color: 'var(--danger)',
                      marginBottom: 16,
                    }}
                  >
                    <strong>Admin Feedback:</strong> {app.rejectionReason}
                  </div>
                )}

                {app.status === 'pending' && (
                  <div
                    style={{
                      padding: '8px 12px',
                      background: 'var(--warning-bg)',
                      border: '1px solid var(--warning-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      color: 'var(--warning)',
                      marginBottom: 16,
                    }}
                  >
                    Submitted on {new Date(app.submittedAt).toLocaleDateString()}. Waiting for administrator approval.
                  </div>
                )}

                {/* App-Wise Buttons Footer: Attached Links & Campaigns */}
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {/* Button 1: View Attached Links */}
                  <button
                    onClick={() => setActiveLinksAppId(app.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                    disabled={app.status !== 'approved'}
                    title={app.status === 'approved' ? 'View all links attached to this app' : 'Available upon approval'}
                  >
                    <Link2 size={14} color="var(--primary)" />
                    <span>Attached Links ({app.links.length})</span>
                  </button>

                  {/* Button 2: View App Campaigns */}
                  <button
                    onClick={() => {
                      setActiveCampaignsAppId(app.id);
                      setNewCampaignForm((prev) => ({
                        ...prev,
                        adAccountId: userAdAccounts[0]?.id || '',
                      }));
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                    disabled={app.status !== 'approved'}
                    title={app.status === 'approved' ? 'Manage campaigns assigned to this app' : 'Available upon approval'}
                  >
                    <Layers size={14} />
                    <span>Campaigns ({appCampaignsCount})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Show Attached Links for App */}
      {activeLinksApp && (
        <div className="modal-overlay" onClick={() => setActiveLinksAppId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Link2 size={18} color="var(--primary)" />
                  Attached Links: {activeLinksApp.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Platform: {activeLinksApp.platform} • Bundle: {activeLinksApp.bundleId}
                </span>
              </div>
              <button onClick={() => setActiveLinksAppId(null)} className="modal-close">✕</button>
            </div>

            <div className="modal-body">
              {activeLinksApp.links.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 10px', color: 'var(--text-muted)' }}>
                  <Link2 size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No links currently assigned</p>
                  <p style={{ fontSize: '0.8rem', marginTop: 4 }}>
                    Platform administrators have not yet attached tracking links to this app.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activeLinksApp.links.map((link) => (
                    <div
                      key={link.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <div style={{ minWidth: 240 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{link.title}</strong>
                          <span className="badge badge-tag" style={{ fontSize: '0.68rem' }}>
                            {link.linkType}
                          </span>
                        </div>
                        <div
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.82rem',
                            color: 'var(--primary)',
                            marginTop: 4,
                            maxWidth: '440px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {link.url}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => copyToClipboard(link.url, link.id)}
                          className="btn btn-primary btn-sm"
                        >
                          {copiedLinkId === link.id ? (
                            <>
                              <Check size={14} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          <ExternalLink size={14} />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setActiveLinksAppId(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: App Campaigns Manager (View, Add, Edit, Delete) */}
      {activeCampaignsApp && (
        <div className="modal-overlay" onClick={() => { setActiveCampaignsAppId(null); setIsNewCampaignOpen(false); setEditingCampaign(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 740 }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Layers size={18} color="var(--primary)" />
                  Campaigns: {activeCampaignsApp.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Manage ad attribution, edit budgets, and track performance for this app.
                </span>
              </div>
              <button onClick={() => { setActiveCampaignsAppId(null); setIsNewCampaignOpen(false); setEditingCampaign(null); }} className="modal-close">✕</button>
            </div>

            <div className="modal-body">
              {/* Header inside modal with Add Campaign button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Active Campaigns ({activeAppCampaigns.length})
                </span>

                {!isNewCampaignOpen && !editingCampaign && (
                  <button
                    onClick={() => setIsNewCampaignOpen(true)}
                    className="btn btn-primary btn-sm"
                    disabled={userAdAccounts.length === 0}
                  >
                    <Plus size={14} />
                    <span>Create Campaign for this App</span>
                  </button>
                )}
              </div>

              {userAdAccounts.length === 0 && (
                <div style={{ padding: '10px 14px', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-sm)', marginBottom: 14, fontSize: '0.8rem', color: 'var(--warning)' }}>
                  ⚠️ You need at least one assigned Ad Account before creating campaigns. Contact your administrator.
                </div>
              )}

              {/* Section: Create New Campaign Form */}
              {isNewCampaignOpen && (
                <form onSubmit={handleCreateCampaignSubmit} style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 18, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>New Campaign for {activeCampaignsApp.name}</h4>
                    <button type="button" onClick={() => setIsNewCampaignOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>✕</button>
                  </div>

                  <div className="modal-form-grid">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Campaign Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. US Tier 1 Launch"
                        value={newCampaignForm.name}
                        onChange={(e) => setNewCampaignForm({ ...newCampaignForm, name: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Ad Account</label>
                      <select
                        value={newCampaignForm.adAccountId}
                        onChange={(e) => setNewCampaignForm({ ...newCampaignForm, adAccountId: e.target.value })}
                        className="select"
                        required
                      >
                        <option value="" disabled>Select Ad Account...</option>
                        {userAdAccounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            [{a.network}] {a.accountName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-form-grid">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">UTM / Tracking Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. google_uac"
                        value={newCampaignForm.utmSource}
                        onChange={(e) => setNewCampaignForm({ ...newCampaignForm, utmSource: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Daily Budget (USD)</label>
                      <input
                        type="number"
                        min={10}
                        step={10}
                        value={newCampaignForm.budgetDaily}
                        onChange={(e) => setNewCampaignForm({ ...newCampaignForm, budgetDaily: Number(e.target.value) })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" onClick={() => setIsNewCampaignOpen(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Plus size={14} /> Save Campaign
                    </button>
                  </div>
                </form>
              )}

              {/* Section: Edit Campaign Form */}
              {editingCampaign && (
                <form onSubmit={handleEditCampaignSubmit} style={{ background: '#f8fafc', border: '1.5px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: 18, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Edit2 size={14} color="var(--primary)" /> Edit Campaign: {editingCampaign.name}
                    </h4>
                    <button type="button" onClick={() => setEditingCampaign(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>✕</button>
                  </div>

                  <div className="modal-form-grid">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Campaign Name</label>
                      <input
                        type="text"
                        required
                        value={editCampaignForm.name}
                        onChange={(e) => setEditCampaignForm({ ...editCampaignForm, name: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Status</label>
                      <select
                        value={editCampaignForm.status}
                        onChange={(e) => setEditCampaignForm({ ...editCampaignForm, status: e.target.value as Campaign['status'] })}
                        className="select"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-form-grid">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">UTM / Tracking Tag</label>
                      <input
                        type="text"
                        value={editCampaignForm.utmSource}
                        onChange={(e) => setEditCampaignForm({ ...editCampaignForm, utmSource: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Daily Budget (USD)</label>
                      <input
                        type="number"
                        min={10}
                        step={10}
                        value={editCampaignForm.budgetDaily}
                        onChange={(e) => setEditCampaignForm({ ...editCampaignForm, budgetDaily: Number(e.target.value) })}
                        className="input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" onClick={() => setEditingCampaign(null)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Campaigns List for this App */}
              {activeAppCampaigns.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 10px', color: 'var(--text-muted)' }}>
                  <Layers size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>No campaigns assigned to this app yet.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: 4 }}>
                    Click &quot;Create Campaign for this App&quot; above to bind an ad account and monitor revenue.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activeAppCampaigns.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <div style={{ minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Target size={16} color="var(--primary)" />
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.96rem' }}>{c.name}</strong>
                          <span className={`badge ${c.status === 'active' ? 'badge-approved' : 'badge-role'}`} style={{ fontSize: '0.68rem' }}>
                            {c.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          Account: <strong style={{ color: 'var(--text-main)' }}>{c.adAccountName}</strong> • Budget:{' '}
                          <strong>${c.budgetDaily}/day</strong> • UTM: <code>{c.utmSource}</code>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Revenue Generated</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--success)' }}>
                            ${c.revenue.toFixed(2)}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => {
                              setEditingCampaign(c);
                              setEditCampaignForm({
                                name: c.name,
                                budgetDaily: c.budgetDaily,
                                utmSource: c.utmSource || '',
                                status: c.status,
                              });
                              setIsNewCampaignOpen(false);
                            }}
                            className="btn btn-secondary btn-icon"
                            title="Edit Campaign"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            onClick={() => deleteCampaign(c.id)}
                            className="btn btn-danger btn-icon"
                            title="Delete Campaign"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => { setActiveCampaignsAppId(null); setIsNewCampaignOpen(false); setEditingCampaign(null); }} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Submit New App */}
      {isSubmitOpen && (
        <div className="modal-overlay" onClick={() => setIsSubmitOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Submit Application for Approval</h3>
              <button onClick={() => setIsSubmitOpen(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleAppSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Application Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Speed Racer 3D, Daily Habit Pulse"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        platform: e.target.value as PlatformType,
                      })
                    }
                    className="select"
                  >
                    <option value="Android">Android (Google Play)</option>
                    <option value="iOS">iOS (Apple App Store)</option>
                    <option value="Web">Web Application</option>
                    <option value="Desktop">Desktop Client</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Bundle ID / Package Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. com.company.gamename"
                    value={formData.bundleId}
                    onChange={(e) => setFormData({ ...formData, bundleId: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Store / TestFlight URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    value={formData.storeUrl}
                    onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Submission Notes / Target Market</label>
                  <textarea
                    rows={3}
                    placeholder="Optional notes for Admin reviewing this app..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="textarea"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsSubmitOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
