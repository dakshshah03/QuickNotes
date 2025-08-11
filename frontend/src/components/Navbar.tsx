'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <nav className="
      h-[70px]
      flex-shrink-0
      bg-linear-to-t from-[#2c2c2c] to-[#3d3d3d8c]
      border-b
      border-gray-200
      flex
      items-center
      px-6
    ">
      <div className="flex space-x-6">
        <Link href="/" className="text-white hover:text-gray-100 font-medium">
          Home
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" className="text-white hover:text-gray-100 font-medium">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-100 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-white hover:text-gray-100 font-medium">
              Login
            </Link>
            <Link href="/auth/create" className="text-white hover:text-gray-100 font-medium">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
