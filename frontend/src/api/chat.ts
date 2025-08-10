import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getAccessToken } from '@/utils/accessToken';

interface messageItem {
    message_id?: string;
    notebook_id: string;
    chat_id: string;
    user_prompt: string;
    llm_response?: string;
    updated_time?: string;
}

interface messageList {
    messageHistory: messageItem[];
}

export const sendMessage = async (
    router: AppRouterInstance,
    messageMetadata: messageItem,
    messageHistory: messageItem[],
    activeDocuments: Set<string>,
    setMessageHistory: (messages: messageItem[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setMessage: (message: string) => void
) => {
    const accessToken = getAccessToken();
    const formData = new FormData();
    
    console.log('Sending message with data:', {
        notebookId: messageMetadata.notebook_id,
        chatId: messageMetadata.chat_id,
        userPrompt: messageMetadata.user_prompt,
        activeDocuments: Array.from(activeDocuments)
    });
    
    formData.append("notebookId", messageMetadata.notebook_id);
    formData.append("chatId", messageMetadata.chat_id);
    formData.append("userPrompt", messageMetadata.user_prompt);
    formData.append("activeDocuments", JSON.stringify(Array.from(activeDocuments)));

    try {
        const response = await fetch(`http://localhost:8000/chat/messages/send`, {
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
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error: ${response.status} - ${errorText}`);
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
        const response = await fetch(`http://localhost:8000/chat/messages/history/${notebookId}/${chatId}`, {
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

        const data: messageList = await response.json();
        console.log(data.messageHistory);
        setMessageHistory(data.messageHistory);
        console.log("Loaded message history");
    } catch (error) {
        console.error('Error loading message history:', error);
        throw error;
    }
};

export const createChat = async (
    chatName: string,
    notebookId: string,
    router: AppRouterInstance
) => {
    try {
        const accessToken = getAccessToken();
        const formData = new FormData();
        
        formData.append("chat_name", chatName);
        formData.append("notebook_id", notebookId);
        
        const response = await fetch(`http://localhost:8000/chat/create`, {
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
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Chat created successfully:", data);
        return data;
    } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
    }
};

export { type messageItem };