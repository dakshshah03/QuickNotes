import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { getAccessToken } from '@/utils/accessToken';

interface LoadNotebookDashboardSuccessResponse {
    notebooks: any[]; // Define proper notebook type
}

export const loadNotebookList = async (
    router: AppRouterInstance,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    try {
        const accessToken = getAccessToken();

        const response = await fetch('http://localhost:8000/dashboard/notebooks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });
        
        // Access token is expired or doesnt exist, redirect to login
        if (response.status === 401) {
            router.push('/login');
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data: LoadNotebookDashboardSuccessResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading notebooks:', error);
        throw error;
    }
};