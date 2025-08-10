'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
        }
        
        console.log("Logout Successful");
        
        router.push('/auth/login');
    }, [router]);

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