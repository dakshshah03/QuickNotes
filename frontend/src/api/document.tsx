import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getAccessToken } from '@/utils/accessToken';
import { metadata } from '@/app/layout';

export const uploadPDF = async (
    router: AppRouterInstance,
    notebookId: string,
    selectedFile: File,
) => {
    try {
        const accessToken = getAccessToken();
        const pdfData = new FormData();
        pdfData.append('file', selectedFile);
        pdfData.append('parent_notebook', notebookId);
        const response = await fetch('http://localhost:8000/notebook/document/upload', {
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

        console.log(response.status);
        // TODO: handle errors
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};