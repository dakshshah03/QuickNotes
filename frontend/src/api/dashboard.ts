import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { getAccessToken } from '@/utils/accessToken';

interface notebook {
    notebook_name: string;
    updated_time: string;
    notebook_id: string;
}

export const loadNotebookList = async (
    router: AppRouterInstance,
    setNotebooks: (notebooks: notebook[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    try {
        const accessToken = getAccessToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/notebooks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });
        
        // Access token is expired or doesnt exist, redirect to login
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            router.push('/auth/login');
            return;
        }

        // TODO: handle this
        // if (response.status === 403) {
        //     setMessage(`Access Forbidden: ${response.status} Forbidden`);
        //     return;
        // }

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data: notebook[] = await response.json();
        setNotebooks(data);
        console.log("Dashboard Loaded");

        return data;
    } catch (error) {
        console.error('Error loading notebooks:', error);
        throw error;
    }
};

export {type notebook};