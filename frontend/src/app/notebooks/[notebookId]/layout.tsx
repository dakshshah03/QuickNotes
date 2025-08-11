// Display notebook after clicking on it. Left sidebar will be chats
// basic notebook page will have a chat bar on the left and a "new chat" at the current page. 
// Once a message is sent in the blank chat, will create new chat and redirect user to that chat and load that chat

'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { NotebookSidebar } from "@/components/notebook/notebookSideBar";
import { useRouter } from "next/navigation";
import { messageItem } from '@/api/chat';
import ProtectedRoute from '@/components/ProtectedRoute';
import { chatItem } from '@/components/notebook/notebookSideBar';

const NotebookContext = createContext<{
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    activeDocuments: Set<string>;
    setActiveDocIds: (docIds: Set<string>) => void;
    message: string;
    setMessage: (msg: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    notebookId: string;
    chatMessage: string;
    setChatMessage: (cmsg: string) => void;
    messageHistory: messageItem[];
    setMessageHistory: (messages: messageItem[]) => void;
    userPrompt: string;
    setUserPrompt: (prompt: string) => void;
    chats: chatItem[]; 
    setChats: (chats: chatItem[]) => void; 
} | null>(null);

export const useNotebookContext = () => {
    const context = useContext(NotebookContext);
    if (!context) {
        throw new Error('useNotebookContext must be used within a NotebookContext.Provider');
    }
    return context;
};

export default function NotebookLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{notebookId: string}>
}) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const unwrappedParams = React.use(params);
    const { notebookId } = unwrappedParams;
    const [chatMessage, setChatMessage] = useState<string>('');
    const [activeDocuments, setActiveDocIds] = useState<Set<string>>(new Set());
    const [messageHistory, setMessageHistory] = useState<messageItem[]>([]);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [chats, setChats] = useState<chatItem[]>([]); // added
    const router = useRouter();

    return (
        <ProtectedRoute>
            <NotebookContext.Provider value={{
                selectedFile,
                setSelectedFile,
                activeDocuments,
                setActiveDocIds,
                message,
                setMessage,
                isLoading,
                setIsLoading,
                notebookId,
                chatMessage,
                setChatMessage,
                messageHistory,
                setMessageHistory,
                userPrompt,
                setUserPrompt,
                chats,
                setChats
            }}>
                {/* bg-gradient-to-t from-[#015a70] to-[#53003f] */}
                {/* bg-gradient-to-t from-[#232627] to-[#242424] */}
                <div className={`
                    bg-gradient-to-t from-[#015a70] to-[#53003f]
                    h-full
                    w-full
                    flex
                `}>
                    <div className="w-80 flex-shrink-0 hidden lg:block">
                        <NotebookSidebar/>
                    </div>
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </NotebookContext.Provider>
        </ProtectedRoute>
    )
};