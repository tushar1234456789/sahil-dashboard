'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Link2, Plus, Trash2, ExternalLink, Copy, Check, Smartphone } from 'lucide-react';
import { AppLink } from '@/types';

export default function AdminLinks() {
  const { apps, assignLinkToApp, removeLinkFromApp, addToast, adminSelectedUserId } = useApp();
  const approvedApps = apps.filter((a) => {
    if (a.status !== 'approved') return false;
    if (adminSelectedUserId !== 'all' && a.userId !== adminSelectedUserId) return false;
    return true;
  });

  const [selectedAppId, setSelectedAppId] = useState<string>(approvedApps[0]?.id || '');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    url: string;
    linkType: AppLink['linkType'];
  }>({
    title: '',
    url: '',
    linkType: 'Tracking URL',
  });

  const activeApp = apps.find((a) => a.id === selectedAppId) || approvedApps[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url || !activeApp) return;
    assignLinkToApp(activeApp.id, formData);
    setFormData({ title: '', url: '', linkType: 'Tracking URL' });
    setIsAddOpen(false);
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkId(id);
    addToast('Copied to Clipboard', url, 'info');
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  if (approvedApps.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <Link2 size={44} style={{ opacity: 0.3, marginBottom: 12 }} />
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: 6 }}>No Approved Apps Yet</h3>
        <p style={{ fontSize: '0.85rem' }}>You can assign tracking links once at least one user-submitted app is approved.</p>
      </div>
    );
  }

  return (
    <div>
      {/* App Selector and Add Button */}
      <div className="page-header-flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 }}>
          <label className="form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>
            Select Target App:
          </label>
          <select
            value={activeApp?.id || ''}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="select"
            style={{ maxWidth: '360px', width: '100%', flex: 1 }}
          >
            {approvedApps.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.platform} - {a.userName})
              </option>
            ))}
          </select>
        </div>

        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Assign New Link</span>
        </button>
      </div>

      {/* Target App Card Banner */}
      {activeApp && (
        <div className="card" style={{ marginBottom: 24, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Smartphone size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{activeApp.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Publisher: <strong style={{ color: 'var(--text-main)' }}>{activeApp.userName}</strong> • Bundle:{' '}
                  <code>{activeApp.bundleId}</code>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-approved">Approved</span>
              <span className="badge badge-tag">{activeApp.links.length} Active Link(s)</span>
            </div>
          </div>
        </div>
      )}

      {/* Links Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Link Title</th>
                <th>Type</th>
                <th>Target URL / URI</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!activeApp || activeApp.links.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                    <Link2 size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <p style={{ fontWeight: 600 }}>No links assigned to this app yet.</p>
                    <p style={{ fontSize: '0.78rem', marginTop: 4 }}>
                      Click &quot;Assign New Link&quot; above to attach a tracking URL or deep link.
                    </p>
                  </td>
                </tr>
              ) : (
                activeApp.links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{link.title}</strong>
                    </td>
                    <td>
                      <span className="badge badge-tag">{link.linkType}</span>
                    </td>
                    <td style={{ maxWidth: '380px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontFamily: 'monospace',
                          fontSize: '0.82rem',
                          color: 'var(--primary)',
                          background: 'rgba(99, 102, 241, 0.08)',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.url}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
                        ● Active
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => copyToClipboard(link.url, link.id)}
                          className="btn btn-secondary btn-icon"
                          title="Copy Link URL"
                        >
                          {copiedLinkId === link.id ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-icon"
                          title="Test Link"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => removeLinkFromApp(activeApp.id, link.id)}
                          className="btn btn-danger btn-icon"
                          title="Remove Link"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Assign New Link */}
      {isAddOpen && activeApp && (
        <div className="modal-overlay" onClick={() => setIsAddOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign Link to {activeApp.name}</h3>
              <button onClick={() => setIsAddOpen(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Link Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Primary Branch Attribution, Facebook Dynamic Deep Link"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Link Classification / Type</label>
                  <select
                    value={formData.linkType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        linkType: e.target.value as AppLink['linkType'],
                      })
                    }
                    className="select"
                  >
                    <option value="Tracking URL">Tracking URL (MMP Attribution)</option>
                    <option value="Deep Link">Deep Link (In-app routing URI)</option>
                    <option value="Fallback URL">Fallback URL (Landing page)</option>
                    <option value="Affiliate">Affiliate / Partner Link</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Destination URL / URI</label>
                  <input
                    type="text"
                    required
                    placeholder="https://track.platform.io/c/sample or appname://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input"
                  />
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    Multiple links can be assigned to this single app. The publisher can view and copy them anytime.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>Assign Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
