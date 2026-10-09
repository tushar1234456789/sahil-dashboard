'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'error') Icon = AlertCircle;
        if (toast.type === 'warning') Icon = AlertTriangle;

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div className="toast-content" style={{ flex: 1 }}>
              <h4>{toast.title}</h4>
              <p>{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
