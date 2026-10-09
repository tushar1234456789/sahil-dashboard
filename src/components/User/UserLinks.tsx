'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Link2, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';

export default function UserLinks() {
  const { apps, currentUser, addToast } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const approvedApps = apps.filter(
    (a) => a.userId === currentUser.id && a.status === 'approved'
  );

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addToast('Link Copied!', 'Tracking link is ready to be pasted in your ad campaigns.', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Approved Application Links</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Tracking links, deep links, and attribution URLs provisioned by platform administrators.
        </p>
      </div>

      {approvedApps.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Link2 size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: 4 }}>No Approved Links Available</h3>
          <p style={{ fontSize: '0.85rem' }}>
            Once the Admin approves your submitted applications and attaches tracking links, they will be listed here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {approvedApps.map((app) => (
            <div key={app.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{app.name}</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Platform: <strong style={{ color: 'var(--text-main)' }}>{app.platform}</strong> • Bundle ID:{' '}
                      <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#334155' }}>{app.bundleId}</code>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-approved">Approved</span>
                  <span className="badge badge-tag">{app.links.length} Link(s)</span>
                </div>
              </div>

              {app.links.length === 0 ? (
                <div style={{ padding: '20px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  This app is approved, but the administrator has not yet assigned any tracking links to it.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {app.links.map((link) => (
                    <div
                      key={link.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <div style={{ minWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.96rem' }}>{link.title}</strong>
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
                            maxWidth: '560px',
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
                          {copiedId === link.id ? (
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
          ))}
        </div>
      )}
    </div>
  );
}
