import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getAccessToken } from '@/utils/accessToken';
import { notebook } from './dashboard';

export const createNotebook = async (
    router: AppRouterInstance,
    notebookName: string,
    notebooks: notebook[],
    setNotebooks: (notebooks: notebook[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    try {
        const accessToken = getAccessToken();

        const formData = new FormData();
        formData.append('notebook_name', notebookName);
        
        const response = await fetch('http://localhost:8000/notebook/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: formData
        });

        if (response.status === 401) {
            router.push('/auth/login');
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        console.log("Created new notebook");
        const data: notebook = await response.json();
        setNotebooks([data, ...notebooks]);
    } catch (error) {
        console.error('Error creating notebook:', error);
        throw error;
    }
};

