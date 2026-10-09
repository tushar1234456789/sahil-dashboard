'use client';

import dynamic from 'next/dynamic';
import { AppProvider } from '@/context/AppContext';

const DashboardShell = dynamic(() => import('@/components/DashboardShell'), {
  ssr: false,
});

export default function Home() {
  return (
    <AppProvider>
      <DashboardShell />
    </AppProvider>
  );
}
