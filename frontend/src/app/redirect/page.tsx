import React, {useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/utils/accessToken';

export default function verify_redirect(navigate_to: string) {
    const router = useRouter();
    const accessToken = getAccessToken();


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
    }, []);
}