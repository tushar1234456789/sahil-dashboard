'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CreditCard, UserPlus, UserMinus, ShieldCheck } from 'lucide-react';

export default function AdminAdAccounts() {
  const { users, adAccounts, userAdAccounts, assignAdAccountToUser, removeAdAccountFromUser, adminSelectedUserId } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string>(
    adminSelectedUserId !== 'all'
      ? adminSelectedUserId
      : users.find((u) => u.role === 'user')?.id || users[0]?.id || ''
  );
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>(adAccounts[0]?.id || '');
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const publisherUsers = users.filter((u) => u.role === 'user');

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedAdAccountId) return;
    const ok = assignAdAccountToUser(selectedUserId, selectedAdAccountId);
    if (ok) {
      setIsAssignOpen(false);
    }
  };

  return (
    <div>
      {/* Top Banner and Action */}
      <div className="page-header-flex">
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Ad Account Directory & Allocations</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Provision network ad accounts (Google, Meta, TikTok, Unity) to specific publisher profiles.
          </p>
        </div>

        <button onClick={() => setIsAssignOpen(true)} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Assign Ad Account to User</span>
        </button>
      </div>

      {/* Available Ad Accounts Catalog */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <h3 className="card-title">
            <CreditCard size={18} color="var(--primary)" />
            Master Ad Accounts Catalog
          </h3>
          <span className="badge badge-tag">{adAccounts.length} Connected Networks</span>
        </div>

        <div className="catalog-grid">
          {adAccounts.map((account) => {
            const mappedUserCount = userAdAccounts.filter((m) => m.adAccountId === account.id).length;
            return (
              <div
                key={account.id}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-role">{account.network}</span>
                  <span className="badge badge-approved" style={{ fontSize: '0.68rem' }}>
                    ● Active
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{account.accountName}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                  ID: {account.externalAccountId}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Assigned to:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{mappedUserCount} user(s)</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active User Allocations Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="card-title" style={{ fontSize: '1.05rem' }}>
            <ShieldCheck size={18} color="var(--success)" />
            Active User & Ad Account Allocations
          </h3>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Publisher / User</th>
                <th>Network</th>
                <th>Ad Account Name</th>
                <th>External Account ID</th>
                <th>Assigned Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userAdAccounts.filter((m) => adminSelectedUserId === 'all' || m.userId === adminSelectedUserId).length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    No ad accounts currently mapped to {adminSelectedUserId === 'all' ? 'users' : 'this user'}.
                  </td>
                </tr>
              ) : (
                userAdAccounts
                  .filter((m) => adminSelectedUserId === 'all' || m.userId === adminSelectedUserId)
                  .map((mapping) => {
                  const targetUser = users.find((u) => u.id === mapping.userId);
                  const targetAccount = adAccounts.find((a) => a.id === mapping.adAccountId);

                  return (
                    <tr key={mapping.id}>
                      <td>
                        <strong>{targetUser?.name || 'Unknown User'}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{targetUser?.email}</div>
                      </td>
                      <td>
                        <span className="badge badge-tag">{targetAccount?.network || 'Ad Network'}</span>
                      </td>
                      <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>{targetAccount?.accountName}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {targetAccount?.externalAccountId}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {new Date(mapping.assignedAt).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => removeAdAccountFromUser(mapping.userId, mapping.adAccountId)}
                          className="btn btn-danger btn-sm"
                          title="Revoke access"
                        >
                          <UserMinus size={14} />
                          <span>Revoke Access</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Assign Ad Account */}
      {isAssignOpen && (
        <div className="modal-overlay" onClick={() => setIsAssignOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Assign Ad Account to User</h3>
              <button onClick={() => setIsAssignOpen(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleAssignSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Target User / Publisher</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="select"
                  >
                    {publisherUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Ad Account to Grant</label>
                  <select
                    value={selectedAdAccountId}
                    onChange={(e) => setSelectedAdAccountId(e.target.value)}
                    className="select"
                  >
                    {adAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        [{a.network}] {a.accountName} ({a.externalAccountId})
                      </option>
                    ))}
                  </select>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Once assigned, this ad account will immediately become available in the publisher&apos;s workspace to link campaigns and review performance.
                </p>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsAssignOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <UserPlus size={16} />
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
