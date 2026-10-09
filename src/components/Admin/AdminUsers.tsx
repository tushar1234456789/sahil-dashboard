'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserPlus, Trash2, Search, Mail, Shield, UserCheck, AlertTriangle } from 'lucide-react';

export default function AdminUsers() {
  const { users, createUser, deleteUser, getUserAdAccounts, setAdminSelectedUserId, setActiveTab, getUserPendingAppCount } = useApp();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;
    const ok = createUser(formData);
    if (ok) {
      setFormData({ name: '', email: '', password: '' });
      setIsCreateOpen(false);
    }
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteUser(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const targetDeleteUser = users.find((u) => u.id === deleteTargetId);

  return (
    <div>
      {/* Top Bar */}
      <div className="page-header-flex">
        <div style={{ position: 'relative', maxWidth: '340px', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search publishers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: 38 }}
          />
        </div>

        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
          <UserPlus size={16} />
          <span>Create New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Status</th>
                <th>Assigned Ad Accounts</th>
                <th>Registered Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    No users found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const assignedAds = getUserAdAccounts(user.id);
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar} alt={user.name} className="avatar" />
                          ) : (
                            <div className="avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)' }}>
                              <UserCheck size={16} />
                            </div>
                          )}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
                              {getUserPendingAppCount(user.id) > 0 && (
                                <span
                                  className="badge badge-pending"
                                  style={{ fontSize: '0.68rem', cursor: 'pointer' }}
                                  onClick={() => {
                                    setAdminSelectedUserId(user.id);
                                    setActiveTab('approvals');
                                  }}
                                  title="Click to review pending app submissions for this user"
                                >
                                  ⚡ {getUserPendingAppCount(user.id)} Pending App
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Mail size={12} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'badge-role' : 'badge-tag'}`}>
                          {user.role === 'admin' ? (
                            <>
                              <Shield size={12} /> Admin
                            </>
                          ) : (
                            'Publisher'
                          )}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
                          ● Active
                        </span>
                      </td>

                      <td>
                        {assignedAds.length === 0 ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>None assigned</span>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {assignedAds.map((ad) => (
                              <span
                                key={ad.id}
                                className="badge"
                                style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}
                              >
                                {ad.accountName}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          {user.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => {
                                  setAdminSelectedUserId(user.id);
                                  setActiveTab('user-portfolio');
                                }}
                                className="btn btn-secondary btn-sm"
                                title="View User-Wise Portfolio"
                              >
                                <span>Portfolio</span>
                              </button>

                              <button
                                onClick={() => setDeleteTargetId(user.id)}
                                className="btn btn-danger btn-sm"
                                title="Delete User"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                          {user.role === 'admin' && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Protected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Provision New User</h3>
              <button onClick={() => setIsCreateOpen(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. marcus@publisher.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                  />
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    The user can update this password later from their profile settings.
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <UserPlus size={16} />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete User */}
      {deleteTargetId && (
        <div className="modal-overlay" onClick={() => setDeleteTargetId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} /> Confirm Deletion
              </h3>
              <button onClick={() => setDeleteTargetId(null)} className="modal-close">✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                Are you sure you want to permanently delete the user account for{' '}
                <strong>{targetDeleteUser?.name}</strong> ({targetDeleteUser?.email})?
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 10 }}>
                This will immediately revoke their access and remove their attached ad account permissions.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setDeleteTargetId(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-danger">
                <Trash2 size={16} />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
