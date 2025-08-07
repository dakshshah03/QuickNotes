import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getAccessToken } from '@/utils/accessToken';

interface messageItem {
    id?: string;
    notebook_id: string;
    chat_id: string;
    user_prompt: string;
    response?: string;
    updated_time?: string;
}

export const sendMessage = async (
    router: AppRouterInstance,
    messageMetadata: messageItem,
    messageHistory: messageItem[],
    setMessageHistory: (messages: messageItem[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    const accessToken = getAccessToken();
    const formData = new FormData();
    formData.append("notebookId", messageMetadata.notebook_id);
    formData.append("chatId", messageMetadata.chat_id);
    formData.append("userPrompt", messageMetadata.user_prompt);

    try {
        const response = await fetch(`http://localhost:8000/chat/send/`, {
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

            console.log("Message sent successfully");

            const data: messageItem = await response.json();
            const updatedHistory = [...messageHistory];
            updatedHistory[updatedHistory.length - 1] = data;
            setMessageHistory(updatedHistory);
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const loadMessageHistory = async (
    router: AppRouterInstance,
    chatId: string,
    notebookId: string,
    setMessageHistory: (messages: messageItem[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    try {
        const accessToken = getAccessToken();
        const response = await fetch(`http://localhost:8000/chat/history/${notebookId}/${chatId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            router.push('/auth/login');
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data: messageItem[] = await response.json();
        setMessageHistory(data);
        console.log("Loaded message history");
    } catch (error) {
        console.error('Error loading message history:', error);
        throw error;
    }
};

export { type messageItem };