'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Smartphone,
  CreditCard,
  Layers,
  DollarSign,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  X,
  Eye,
  ShieldAlert,
  Search,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppLink } from '@/types';

export default function AdminUserPortfolio() {
  const {
    users,
    apps,
    adAccounts,
    userAdAccounts,
    campaigns,
    revenueMetrics,
    adminSelectedUserId,
    setAdminSelectedUserId,
    getUserAdAccounts,
    getUserPendingAppCount,
    assignAdAccountToUser,
    removeAdAccountFromUser,
    assignLinkToApp,
    removeLinkFromApp,
    approveApp,
    rejectApp,
    switchRole,
  } = useApp();

  const [userSearch, setUserSearch] = useState('');

  const publisherUsers = users.filter((u) => u.role === 'user');
  const activeUserId =
    adminSelectedUserId !== 'all' ? adminSelectedUserId : publisherUsers[0]?.id || '';
  const selectedUser = publisherUsers.find((u) => u.id === activeUserId) || publisherUsers[0];

  // Filtered users for left-side list
  const filteredUsersList = publisherUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Modal states
  const [isAssignAdOpen, setIsAssignAdOpen] = useState(false);
  const [selectedAdToAssign, setSelectedAdToAssign] = useState(adAccounts[0]?.id || '');

  const [isAssignLinkOpen, setIsAssignLinkOpen] = useState(false);
  const [targetAppIdForLink, setTargetAppIdForLink] = useState('');
  const [linkForm, setLinkForm] = useState<{
    title: string;
    url: string;
    linkType: AppLink['linkType'];
  }>({
    title: '',
    url: '',
    linkType: 'Tracking URL',
  });

  if (!selectedUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <ShieldAlert size={44} style={{ opacity: 0.3, marginBottom: 12 }} />
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>No Publishers Found</h3>
        <p style={{ fontSize: '0.85rem' }}>Provision a publisher account first to inspect their user-wise portfolio.</p>
      </div>
    );
  }

  // Gather selected user's assets
  const userApps = apps.filter((a) => a.userId === selectedUser.id);
  const userAds = getUserAdAccounts(selectedUser.id);
  const userAppIds = userApps.map((a) => a.id);
  const userCampaigns = campaigns.filter((c) => c.userId === selectedUser.id);
  const userRevenue = revenueMetrics
    .filter((m) => m.userId === selectedUser.id || userAppIds.includes(m.appId))
    .reduce((sum, m) => sum + m.revenueUsd, 0);

  const handleAssignAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdToAssign) return;
    const ok = assignAdAccountToUser(selectedUser.id, selectedAdToAssign);
    if (ok) setIsAssignAdOpen(false);
  };

  const handleAssignLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppIdForLink || !linkForm.title || !linkForm.url) return;
    assignLinkToApp(targetAppIdForLink, linkForm);
    setLinkForm({ title: '', url: '', linkType: 'Tracking URL' });
    setIsAssignLinkOpen(false);
  };

  return (
    <div>
      {/* Page Title & Context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>User-Wise Portfolio Management</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Select any user from the list to view and manage their submitted apps, tracking links, and ad accounts.
          </p>
        </div>
      </div>

      {/* Master-Detail Split Layout */}
      <div className="portfolio-master-detail">
        {/* Left Column: All Users List */}
        <div className="card portfolio-master-list" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              <Users size={18} color="var(--primary)" />
              <span>All Publishers ({publisherUsers.length})</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Click to view</span>
          </div>

          {/* User Search Input */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search user by name..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 32, paddingBlock: 8, fontSize: '0.82rem' }}
            />
          </div>

          {/* Clickable User Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', paddingRight: 4 }}>
            {filteredUsersList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No users found.
              </div>
            ) : (
              filteredUsersList.map((u) => {
                const isSelected = u.id === selectedUser.id;
                const pendingApps = getUserPendingAppCount(u.id);
                const userAppsCount = apps.filter((a) => a.userId === u.id).length;
                const userAdsCount = getUserAdAccounts(u.id).length;

                return (
                  <div
                    key={u.id}
                    onClick={() => setAdminSelectedUserId(u.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.12) 100%)'
                        : 'var(--bg-surface-elevated)',
                      border: '1.5px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                      boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none',
                    }}
                  >
                    {u.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          background: isSelected ? 'var(--primary)' : 'rgba(99, 102, 241, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#fff' : 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                          border: isSelected ? 'none' : '1px solid rgba(99, 102, 241, 0.2)',
                        }}
                      >
                        {u.name.charAt(0)}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.name}
                        </span>
                        {pendingApps > 0 && (
                          <span className="badge badge-pending" style={{ fontSize: '0.62rem', padding: '1px 5px', flexShrink: 0 }}>
                            ⚡ {pendingApps}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.email}
                      </div>

                      <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        <span>{userAppsCount} apps</span>
                        <span>•</span>
                        <span>{userAdsCount} ad acc</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected User Full Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* User Profile Banner Header */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {selectedUser.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                    }}
                  >
                    {selectedUser.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedUser.name}</h2>
                    <span className="badge badge-tag">Publisher Account</span>
                    <span className="badge badge-approved">Active</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Email: <strong style={{ color: 'var(--text-main)' }}>{selectedUser.email}</strong> • Registered on{' '}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Attributed Revenue
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '-0.02em' }}>
                  ${userRevenue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Grid: Applications & Connected Ad Accounts */}
          <div className="portfolio-cards-grid">
            {/* User's Submitted Applications */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <Smartphone size={18} color="var(--primary)" />
                    Submitted Applications ({userApps.length})
                  </h3>
                  <p className="card-subtitle">Manage approvals and assigned links for {selectedUser.name}</p>
                </div>
              </div>

              {userApps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Smartphone size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p>No applications submitted by this user yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {userApps.map((app) => (
                    <div
                      key={app.id}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: 16,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{app.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>
                            {app.platform} • <code>{app.bundleId}</code>
                          </div>
                        </div>

                        <span className={`badge badge-${app.status}`}>
                          {app.status === 'pending' && '● Pending Review'}
                          {app.status === 'approved' && '✓ Approved'}
                          {app.status === 'rejected' && '✕ Rejected'}
                        </span>
                      </div>

                      {app.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <button
                            onClick={() => approveApp(app.id)}
                            className="btn btn-success btn-sm"
                          >
                            <Check size={14} /> Approve App
                          </button>
                          <button
                            onClick={() => rejectApp(app.id, 'Submission guidelines not met.')}
                            className="btn btn-danger btn-sm"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}

                      {/* Assigned Links under this app */}
                      {app.status === 'approved' && (
                        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              Assigned Links ({app.links.length})
                            </span>
                            <button
                              onClick={() => {
                                setTargetAppIdForLink(app.id);
                                setIsAssignLinkOpen(true);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            >
                              <Plus size={12} /> Add Link
                            </button>
                          </div>

                          {app.links.length === 0 ? (
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>No links assigned yet.</div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {app.links.map((link) => (
                                <div
                                  key={link.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    padding: '8px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.76rem',
                                  }}
                                >
                                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                                    <strong style={{ color: 'var(--primary)' }}>[{link.linkType}]</strong>{' '}
                                    <span style={{ color: 'var(--text-main)' }}>{link.title}</span>
                                  </div>
                                  <button
                                    onClick={() => removeLinkFromApp(app.id, link.id)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                                    title="Remove link"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User's Connected Ad Accounts */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    <CreditCard size={18} color="var(--warning)" />
                    Connected Ad Accounts ({userAds.length})
                  </h3>
                  <p className="card-subtitle">Manage authorized ad accounts for {selectedUser.name}</p>
                </div>
                <button onClick={() => setIsAssignAdOpen(true)} className="btn btn-primary btn-sm">
                  <Plus size={14} /> Assign Ad Account
                </button>
              </div>

              {userAds.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <CreditCard size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p>No ad accounts currently mapped to this user.</p>
                  <div style={{ marginTop: 10 }}>
                    <button onClick={() => setIsAssignAdOpen(true)} className="btn btn-secondary btn-sm">
                      <Plus size={14} /> Allocate an Ad Account
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {userAds.map((acc) => (
                    <div
                      key={acc.id}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>{acc.accountName}</strong>
                          <span className="badge badge-tag" style={{ fontSize: '0.68rem' }}>{acc.network}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'monospace', marginTop: 2 }}>
                          CID: {acc.externalAccountId}
                        </div>
                      </div>

                      <button
                        onClick={() => removeAdAccountFromUser(selectedUser.id, acc.id)}
                        className="btn btn-danger btn-sm"
                        title="Revoke access"
                      >
                        <Trash2 size={13} /> Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* User's Active Campaigns list */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={14} color="var(--primary)" /> User&apos;s Active Campaigns ({userCampaigns.length})
                </h4>
                {userCampaigns.length === 0 ? (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>No campaigns created yet by this publisher.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {userCampaigns.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--text-main)' }}>{c.name}</strong> → <span>{c.appName}</span>
                        </div>
                        <div style={{ color: 'var(--success)', fontWeight: 600 }}>
                          ${c.revenue.toFixed(2)} generated
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Assign Ad Account to this user */}
      {isAssignAdOpen && (
        <div className="modal-overlay" onClick={() => setIsAssignAdOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign Ad Account to {selectedUser.name}</h3>
              <button onClick={() => setIsAssignAdOpen(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleAssignAdSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Ad Account</label>
                  <select
                    value={selectedAdToAssign}
                    onChange={(e) => setSelectedAdToAssign(e.target.value)}
                    className="select"
                  >
                    {adAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        [{a.network}] {a.accountName} ({a.externalAccountId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsAssignAdOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> Assign Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Link to user's app */}
      {isAssignLinkOpen && (
        <div className="modal-overlay" onClick={() => setIsAssignLinkOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign Link to Application</h3>
              <button onClick={() => setIsAssignLinkOpen(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleAssignLinkSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Link Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Branch Universal Attribution Link"
                    value={linkForm.title}
                    onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Classification / Type</label>
                  <select
                    value={linkForm.linkType}
                    onChange={(e) =>
                      setLinkForm({
                        ...linkForm,
                        linkType: e.target.value as AppLink['linkType'],
                      })
                    }
                    className="select"
                  >
                    <option value="Tracking URL">Tracking URL (MMP Attribution)</option>
                    <option value="Deep Link">Deep Link (App Routing URI)</option>
                    <option value="Fallback URL">Fallback URL (Landing Page)</option>
                    <option value="Affiliate">Affiliate Link</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target URL / URI</label>
                  <input
                    type="text"
                    required
                    placeholder="https://track.platform.io/c/..."
                    value={linkForm.url}
                    onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsAssignLinkOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> Assign Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
