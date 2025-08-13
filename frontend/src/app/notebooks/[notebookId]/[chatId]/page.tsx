'use client';

import React from 'react';
import { WriteMessage } from '@/components/chat/messageBox';
import { ChatWindow } from '@/components/chat/chatWindow';
import { ChatContext } from '@/context/chatContext';

export default function ChatPage({
    params 
}: {
    params: Promise<{notebookId: string, chatId: string}>
}) {
    const { notebookId, chatId } = React.use(params);

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