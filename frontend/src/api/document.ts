import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getAccessToken } from '@/utils/accessToken';
import { documentItem } from './notebooks';

export const uploadPDF = async (
    router: AppRouterInstance,
    notebookId: string,
    selectedFile: File,
    documents: documentItem[],
    setDocuments: (documents: documentItem[]) => void
) => {
    try {
        const accessToken = getAccessToken();
        const pdfData = new FormData();
        pdfData.append('file', selectedFile);
        pdfData.append('parent_notebook', notebookId);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notebook/document/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: pdfData
        });

        if (response.status === 401) {
            router.push('/auth/login');
            return;
        }

        if (!response.ok) {
            console.error('Error uploading file:', response.status);
            throw new Error(`Failed to upload file: ${response.status}`);
        }

        try {
            const data: documentItem = await response.json();
            setDocuments([data, ...documents]);
        } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
            throw new Error('Invalid JSON response from server');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};