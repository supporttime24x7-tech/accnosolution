import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#070B0A] text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="text-8xl font-extrabold text-[#5ED29C] font-mono mb-4">404</div>
      <h1 className="text-2xl font-extrabold uppercase">PAGE NOT FOUND</h1>
      <p className="text-xs text-white/60 mt-2 max-w-sm">The requested URL was not found on ACCNO SOLUTION server.</p>
      <Link href="/" className="mt-6 px-6 py-3 bg-[#5ED29C] text-[#070B0A] font-extrabold text-xs uppercase rounded-full">
        Return to Home Page
      </Link>
    </main>
  );
}
