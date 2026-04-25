'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const serviceType = localStorage.getItem('serviceType');
    
    if (serviceType === 'airtime') {
      router.replace('/dashboard/airtime');
    } else if (serviceType === 'payment') {
      router.replace('/dashboard/payments');
    } else {
      // Fallback - default to payments
      router.replace('/dashboard/payments');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#8B1D1D] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}