import React, { ReactNode } from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Navbar />
    <main className="max-w-6xl mx-auto p-6">{children}</main>
  </div>
);

export default MainLayout; 