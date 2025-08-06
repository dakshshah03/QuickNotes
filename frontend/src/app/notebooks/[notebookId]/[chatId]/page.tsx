'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { WriteMessage } from '@/components/chat/messageBox';
import { ChatWindow } from '@/components/chat/chatWindow';
import { messageItem } from '@/api/chat';
import { useRouter } from 'next/navigation';
import { useNotebookContext } from '../layout';

const ChatContext = createContext<{
    userPrompt: string;
    messageHistory: messageItem[];
    notebookId: string;
    chatId: string;
    setUserPrompt: (prompt: string) => void;
    setMessageHistory: (messages: messageItem[]) => void;
    setIsLoading: (isLoading: boolean) => void;
    setMessage: (message: string) => void;
} | null>(null);

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatContext.Provider');
    }
    return context;
};

export default function chatPage({
    params 
}: {
    params: Promise<{notebookId: string, chatId: string}>
}) {
    const [messageHistory, setMessageHistory] = useState<messageItem[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userPrompt, setUserPrompt] = useState<string>("");

    const unwrappedParams = React.use(params);
    const { notebookId, chatId } = unwrappedParams;
    const router = useRouter();

    return(
        <ChatContext.Provider value={{
            userPrompt,
            messageHistory,
            notebookId,
            chatId,
            setUserPrompt,
            setMessageHistory,
            setIsLoading,
            setMessage
        }}>
            <div className="flex flex-col h-screen">
                <div className="flex-4 flex justify-center pt-[50px]">
                    <ChatWindow/>
                </div>
                <div className="flex-shrink-0 flex justify-center">
                    <WriteMessage/>
                </div>
            </div>
        </ChatContext.Provider>
    )   
}