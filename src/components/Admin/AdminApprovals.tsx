'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Check,
  X,
  Smartphone,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  CreditCard,
  Link2,
  Sparkles,
} from 'lucide-react';
import { AppStatus, AppLink } from '@/types';

export default function AdminApprovals() {
  const {
    apps,
    approveApp,
    rejectApp,
    approveAndProvisionApp,
    adAccounts,
    getUserAdAccounts,
    setActiveTab,
    adminSelectedUserId,
    users,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<AppStatus | 'all'>('pending');
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Multi-Link & Ad Account Provisioning Modal State
  const [provisioningAppId, setProvisioningAppId] = useState<string | null>(null);
  const [linksToAssign, setLinksToAssign] = useState<
    { title: string; url: string; linkType: AppLink['linkType'] }[]
  >([
    { title: 'Primary Tracking URL', url: '', linkType: 'Tracking URL' },
    { title: 'Fallback Landing Page', url: '', linkType: 'Fallback URL' },
  ]);
  const [selectedAdAccountToAssign, setSelectedAdAccountToAssign] = useState<string>('');

  const targetAppToProvision = apps.find((a) => a.id === provisioningAppId);
  const targetUserForApp = targetAppToProvision
    ? users.find((u) => u.id === targetAppToProvision.userId)
    : null;
  const userCurrentAds = targetUserForApp ? getUserAdAccounts(targetUserForApp.id) : [];

  const filteredApps = apps.filter((app) => {
    if (adminSelectedUserId !== 'all' && app.userId !== adminSelectedUserId) return false;
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const handleOpenProvisionModal = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    setProvisioningAppId(appId);
    setLinksToAssign([
      { title: 'Primary MMP Tracking Link', url: `https://track.platform.io/c/${app?.bundleId || 'app'}`, linkType: 'Tracking URL' },
      { title: 'Universal Deep Link', url: `${app?.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'app'}://open`, linkType: 'Deep Link' },
    ]);
    setSelectedAdAccountToAssign(adAccounts[0]?.id || '');
  };

  const handleAddLinkRow = () => {
    setLinksToAssign((prev) => [
      ...prev,
      { title: `Custom Link #${prev.length + 1}`, url: '', linkType: 'Tracking URL' },
    ]);
  };

  const handleRemoveLinkRow = (index: number) => {
    setLinksToAssign((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateLinkRow = (
    index: number,
    field: 'title' | 'url' | 'linkType',
    val: string
  ) => {
    setLinksToAssign((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provisioningAppId) return;

    approveAndProvisionApp(
      provisioningAppId,
      linksToAssign,
      selectedAdAccountToAssign || undefined
    );

    setProvisioningAppId(null);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingAppId) {
      rejectApp(rejectingAppId, rejectionReason);
      setRejectingAppId(null);
      setRejectionReason('');
    }
  };

  const targetRejectApp = apps.find((a) => a.id === rejectingAppId);

  return (
    <div>
      {/* Filters and Status Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => {
            const count = status === 'all'
              ? apps.filter((a) => adminSelectedUserId === 'all' || a.userId === adminSelectedUserId).length
              : apps.filter((a) => a.status === status && (adminSelectedUserId === 'all' || a.userId === adminSelectedUserId)).length;

            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {adminSelectedUserId !== 'all' && (
          <span className="badge badge-tag">
            User Filter Active: {users.find((u) => u.id === adminSelectedUserId)?.name}
          </span>
        )}
      </div>

      {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredApps.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <Clock size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: 4 }}>No Applications Found</h3>
            <p style={{ fontSize: '0.85rem' }}>No applications currently match the filter.</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div key={app.id} className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Smartphone size={24} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{app.name}</h3>
                      <span className={`badge badge-${app.status}`}>
                        {app.status === 'pending' && '● Pending Review'}
                        {app.status === 'approved' && '✓ Approved'}
                        {app.status === 'rejected' && '✕ Rejected'}
                      </span>
                      <span className="badge badge-tag">{app.platform}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 18, marginTop: 8, fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <div>
                        Bundle ID: <strong style={{ color: 'var(--text-main)' }}>{app.bundleId}</strong>
                      </div>
                      <div>
                        Publisher: <strong style={{ color: 'var(--text-main)' }}>{app.userName}</strong>
                      </div>
                      <div>
                        Submitted: <span style={{ color: 'var(--text-dim)' }}>{new Date(app.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {app.storeUrl && (
                      <div style={{ marginTop: 8 }}>
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
                          <ExternalLink size={12} /> Store / Preview Listing
                        </a>
                      </div>
                    )}

                    {app.notes && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <strong>Publisher Notes:</strong> {app.notes}
                      </div>
                    )}

                    {app.status === 'rejected' && app.rejectionReason && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--danger)' }}>
                        <strong>Rejection Reason:</strong> {app.rejectionReason}
                      </div>
                    )}

                    {app.status === 'approved' && (
                      <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--success)' }}>
                        ✓ {app.links.length} assigned link(s).
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {app.status === 'pending' && (
                    <>
                      {/* One-Flow Approve + Assign Multiple Links + Ad Account */}
                      <button
                        onClick={() => handleOpenProvisionModal(app.id)}
                        className="btn btn-primary btn-sm"
                        title="Approve and assign multiple links and ad account together"
                      >
                        <Sparkles size={14} />
                        <span>Approve & Assign Links + Ad Acc</span>
                      </button>

                      {/* Quick Approve without modal */}
                      <button
                        onClick={() => approveApp(app.id)}
                        className="btn btn-success btn-sm"
                        title="Quick approve app"
                      >
                        <Check size={14} />
                        <span>Quick Approve</span>
                      </button>

                      <button
                        onClick={() => {
                          setRejectingAppId(app.id);
                          setRejectionReason('');
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {app.status === 'approved' && (
                    <button
                      onClick={() => setActiveTab('links')}
                      className="btn btn-secondary btn-sm"
                    >
                      <ExternalLink size={14} />
                      <span>Manage Links ({app.links.length})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Full Approve & Provision (Multi-Links + Ad Account) */}
      {provisioningAppId && targetAppToProvision && (
        <div className="modal-overlay" onClick={() => setProvisioningAppId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="var(--primary)" />
                Approve & Provision &quot;{targetAppToProvision.name}&quot;
              </h3>
              <button onClick={() => setProvisioningAppId(null)} className="modal-close">✕</button>
            </div>

            <form onSubmit={handleProvisionSubmit}>
              <div className="modal-body">
                <div style={{ padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Publisher: <strong style={{ color: 'var(--text-main)' }}>{targetAppToProvision.userName}</strong> • Platform:{' '}
                  <span className="badge badge-tag">{targetAppToProvision.platform}</span>
                </div>

                {/* Section 1: Assign Multiple Links */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label className="form-label" style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      <Link2 size={16} color="var(--primary)" />
                      <span>Assign Multiple Links to this App:</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddLinkRow}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.74rem' }}
                    >
                      <Plus size={12} /> Add Another Link
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {linksToAssign.map((linkItem, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            type="text"
                            required
                            placeholder="Link Title (e.g. Branch MMP, Deep Link)"
                            value={linkItem.title}
                            onChange={(e) => handleUpdateLinkRow(idx, 'title', e.target.value)}
                            className="input"
                            style={{ flex: 2, padding: '7px 10px', fontSize: '0.82rem' }}
                          />
                          <select
                            value={linkItem.linkType}
                            onChange={(e) => handleUpdateLinkRow(idx, 'linkType', e.target.value)}
                            className="select"
                            style={{ flex: 1, padding: '7px 10px', fontSize: '0.82rem' }}
                          >
                            <option value="Tracking URL">Tracking URL</option>
                            <option value="Deep Link">Deep Link</option>
                            <option value="Fallback URL">Fallback URL</option>
                            <option value="Affiliate">Affiliate</option>
                          </select>
                          {linksToAssign.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLinkRow(idx)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          required
                          placeholder="URL or URI (e.g. https://track.io/... or app://...)"
                          value={linkItem.url}
                          onChange={(e) => handleUpdateLinkRow(idx, 'url', e.target.value)}
                          className="input"
                          style={{ padding: '7px 10px', fontSize: '0.82rem' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Assign Ad Account to User */}
                <div>
                  <label className="form-label" style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: 8 }}>
                    <CreditCard size={16} color="var(--warning)" />
                    <span>Assign Ad Account to {targetAppToProvision.userName}:</span>
                  </label>

                  <select
                    value={selectedAdAccountToAssign}
                    onChange={(e) => setSelectedAdAccountToAssign(e.target.value)}
                    className="select"
                  >
                    <option value="">-- Do Not Assign New Ad Account (Skip) --</option>
                    {adAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        [{acc.network}] {acc.accountName} ({acc.externalAccountId})
                      </option>
                    ))}
                  </select>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: 6 }}>
                    Currently assigned ad accounts to this user: {userCurrentAds.length > 0 ? userCurrentAds.map((a) => a.accountName).join(', ') : 'None'}.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setProvisioningAppId(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Approve & Provision Everything</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rejection Reason */}
      {rejectingAppId && (
        <div className="modal-overlay" onClick={() => setRejectingAppId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--warning)' }}>
                <AlertCircle size={18} /> Reject &quot;{targetRejectApp?.name}&quot;
              </h3>
              <button onClick={() => setRejectingAppId(null)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleRejectSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    <span>Rejection Reason / Guidance for Publisher</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="e.g. Missing valid bundle ID or store link..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setRejectingAppId(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  <MessageSquare size={16} />
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
