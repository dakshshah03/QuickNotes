import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getAccessToken } from '@/utils/accessToken';
import { notebook } from './dashboard';

interface chatItem {
    id: string;
    parent_notebook: string;
    name: string;
    updated_time: string;
}

interface documentItem {
    id: string;
    parent_notebook: string;
    name: string;
    creation_time: string;
}

interface loadResponse {
    chats: chatItem[];
    documents: documentItem[];
}

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
        
        const response = await fetch(`/api/notebook/create`, {
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
        return data.notebook_id;
    } catch (error) {
        console.error('Error creating notebook:', error);
        throw error;
    }
};

export const loadSidebar = async (
    router: AppRouterInstance,
    notebookId: string,
    setChats: (chats: chatItem[]) => void,
    setDocuments: (documents: documentItem[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    try {
        const accessToken = getAccessToken();

        const response = await fetch(`/api/notebook/load/${notebookId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 401) {
            router.push('/auth/login');
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data: loadResponse = await response.json();
        setChats(data.chats);
        console.log("chats loaded");
        setDocuments(data.documents);
        console.log("documents loaded");

        return data;
    } catch (error) {
        console.error('Error loading notebooks:', error);
        throw error;
    }
};
export {type chatItem, type documentItem}