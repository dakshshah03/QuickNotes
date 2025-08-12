'use client';
import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/utils/accessToken';

function RedirectHandler({ navigate_to }: { navigate_to: string }) {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                router.push('/auth/login');
                return;
            } else {
                router.push(navigate_to);
            }
        }
    }, [navigate_to, router]);

    return null;
}

export default async function VerifyRedirect({ 
    searchParams 
}: { 
    searchParams: Promise<{ navigate_to?: string }> 
}) {
    const resolvedSearchParams = await searchParams;
    const navigate_to = resolvedSearchParams?.navigate_to || '/';

    return <RedirectHandler navigate_to={navigate_to} />;
}