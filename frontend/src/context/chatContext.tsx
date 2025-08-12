'use client';
import React, { createContext, useContext } from 'react';

export const ChatContext = createContext<{
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
