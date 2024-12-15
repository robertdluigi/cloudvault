'use client';

import Dashboard from "@/sections/dashboard/Dashboard";

export default function Home() {
  return (
    <div className="space-y-8">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Main content centered and responsive */}
        <Dashboard />
      </main>
    </div>
  );
}
