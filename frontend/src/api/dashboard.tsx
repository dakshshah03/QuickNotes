import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { getAccessToken } from '@/utils/accessToken';

interface notebook {
    notebook_name: string;
    updated_time: string;
}

interface NotebookList {
    notebooks: notebook[]; // Define proper notebook type
}

export const loadNotebookList = async (
    router: AppRouterInstance,
    setNotebooks: (notebooks: notebook[]) => void,
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
            router.push('/auth/login');
            return;
        }

        // TODO: handle this in caller? 
        // if (response.status === 403) {
        //     setMessage(`Access Forbidden: ${response.status} Forbidden`);
        //     return;
        // }
        console.log("Dashboard Loaded");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data: NotebookList = await response.json();
        setNotebooks(data.notebooks)
        return data;
    } catch (error) {
        console.error('Error loading notebooks:', error);
        throw error;
    }
};

export default notebook;