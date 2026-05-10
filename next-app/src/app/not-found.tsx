'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 2 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
      <div className="text-4xl font-bold text-white">404 - Not Found</div>
      <div className="text-lg text-gray-400">Mrrrrrrp</div>
    </div>
  );
}