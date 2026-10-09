'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, User, Lock, Mail, ArrowRight, Layers3, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [activeTab, setActiveTab] = useState<'admin' | 'user'>('admin');
  const [email, setEmail] = useState('admin@platform.io');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (tab: 'admin' | 'user') => {
    setActiveTab(tab);
    if (tab === 'admin') {
      setEmail('admin@platform.io');
      setPassword('password123');
    } else {
      setEmail('alex@hypergrowth.games');
      setPassword('password123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(email, password);
      setIsSubmitting(false);
    }, 300);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    login(demoEmail, 'password123');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(20px)',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: 16,
              color: '#fff',
            }}
          >
            <Layers3 size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            OmniApp Hub
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Enterprise App Approvals & Ad Revenue Platform
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
            background: 'var(--bg-surface-elevated)',
            padding: 4,
            borderRadius: 'var(--radius-md)',
            marginBottom: 24,
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'var(--transition)',
              background: activeTab === 'admin' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'admin' ? '#fff' : 'var(--text-muted)',
              boxShadow: activeTab === 'admin' ? '0 2px 8px rgba(99, 102, 241, 0.35)' : 'none',
            }}
          >
            <Shield size={16} />
            <span>Admin Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('user')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'var(--transition)',
              background: activeTab === 'user' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'user' ? '#fff' : 'var(--text-muted)',
              boxShadow: activeTab === 'user' ? '0 2px 8px rgba(99, 102, 241, 0.35)' : 'none',
            }}
          >
            <User size={16} />
            <span>Publisher Portal</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span>{activeTab === 'admin' ? 'Admin Email Address' : 'Publisher Email Address'}</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-dim)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">
              <span>Password</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-dim)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {activeTab === 'admin' ? 'Administrator' : 'Publisher'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Access Section */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>
            ⚡ Instant Demo Login
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@platform.io')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} color="#c084fc" />
                <span><strong>Sahil Admin</strong> (admin@platform.io)</span>
              </div>
              <span className="badge badge-role" style={{ fontSize: '0.65rem' }}>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('alex@hypergrowth.games')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={14} color="#38bdf8" />
                <span><strong>Alex Turner</strong> (HyperGrowth Games)</span>
              </div>
              <span className="badge badge-tag" style={{ fontSize: '0.65rem' }}>Publisher</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('elena@vortexapps.dev')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={14} color="#38bdf8" />
                <span><strong>Elena Rostova</strong> (VortexApps Dev)</span>
              </div>
              <span className="badge badge-tag" style={{ fontSize: '0.65rem' }}>Publisher</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
