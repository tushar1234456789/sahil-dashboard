'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CreditCard, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function UserAdAccounts() {
  const { currentUser, getUserAdAccounts, campaigns } = useApp();
  const assignedAccounts = getUserAdAccounts(currentUser.id);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>My Connected Ad Accounts</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Ad networks authorized for your publisher account by platform administrators.
        </p>
      </div>

      {assignedAccounts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <ShieldAlert size={44} style={{ opacity: 0.3, marginBottom: 12, color: 'var(--warning)' }} />
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: 6 }}>No Ad Accounts Assigned</h3>
          <p style={{ fontSize: '0.85rem' }}>
            You do not currently have any active ad accounts mapped to your user profile.
            Please reach out to the platform administrator to allocate an ad account.
          </p>
        </div>
      ) : (
        <div className="cards-responsive-grid">
          {assignedAccounts.map((account) => {
            const activeCampaigns = campaigns.filter(
              (c) => c.userId === currentUser.id && c.adAccountId === account.id
            );

            return (
              <div key={account.id} className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <CreditCard size={20} />
                  </div>
                  <span className="badge badge-approved" style={{ fontSize: '0.72rem' }}>
                    <CheckCircle2 size={12} /> Assigned & Active
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{account.accountName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Network: <strong style={{ color: 'var(--text-main)' }}>{account.network}</strong>
                  </div>
                </div>

                <div style={{ padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                  Account CID / ID: {account.externalAccountId}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Active Campaigns:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{activeCampaigns.length} assigned</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
