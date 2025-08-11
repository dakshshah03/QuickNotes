'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Logout() {
    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <div className="flex items-center justify-center h-full">
            <div 
                className={`
                    flex
                    items-center
                    justify-center
                    rounded-[20px]
                    bg-[#ffffff1a]
                    h-[500px]
                    w-[400px]
                `}>
                <div className="text-center text-white">
                    <h2 className="text-xl font-semibold mb-4">Logging out...</h2>
                    <p>You are being logged out and redirected.</p>
                </div>
            </div>
        </div>
    );
}