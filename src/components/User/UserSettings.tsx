'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { User, Lock, Save, KeyRound } from 'lucide-react';

export default function UserSettings() {
  const { currentUser, updateUserProfile, changeUserPassword } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(name);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    const ok = changeUserPassword(passwordState.currentPassword, passwordState.newPassword);
    if (ok) {
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Account & Security Preferences</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Manage your personal publisher identity and access credentials.
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">
            <User size={18} color="var(--primary)" />
            Personal Profile Information
          </h3>
        </div>

        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Managed by Admin)</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="input"
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Contact your platform administrator if you need to update your registered email address.
            </span>
          </div>

          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Update Profile</span>
          </button>
        </form>
      </div>

      {/* Password Update Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Lock size={18} color="var(--warning)" />
            Change Password
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              required
              placeholder="Enter existing password"
              value={passwordState.currentPassword}
              onChange={(e) =>
                setPasswordState({ ...passwordState, currentPassword: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={passwordState.newPassword}
              onChange={(e) =>
                setPasswordState({ ...passwordState, newPassword: e.target.value })
              }
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Re-enter new password"
              value={passwordState.confirmPassword}
              onChange={(e) =>
                setPasswordState({ ...passwordState, confirmPassword: e.target.value })
              }
              className="input"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <KeyRound size={16} />
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
}
