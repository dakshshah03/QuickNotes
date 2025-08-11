'use client';

import React, { createContext, useContext } from 'react';
import { WriteMessage } from '@/components/chat/messageBox';
import { ChatWindow } from '@/components/chat/chatWindow';
import { useRouter } from 'next/navigation';

const ChatContext = createContext<{
    notebookId: string;
    chatId: string;
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
    const unwrappedParams = React.use(params);
    const { notebookId, chatId } = unwrappedParams;
    const router = useRouter();

    return(
        <ChatContext.Provider value={{
            notebookId,
            chatId
        }}>
            <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex justify-center overflow-y-auto">
                        <ChatWindow/>
                    </div>
                </div>
                <div className="flex-shrink-0 flex justify-center">
                    <WriteMessage inNotebook={false}/>
                </div>
            </div>
        </ChatContext.Provider>
    )   
}