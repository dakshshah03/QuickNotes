// Display notebook after clicking on it. Left sidebar will be chats
// basic notebook page will have a chat bar on the left and a "new chat" at the current page. 
// Once a message is sent in the blank chat, will create new chat and redirect user to that chat and load that chat

'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { NotebookSidebar } from "@/components/notebook/notebookSideBar";
import { useRouter } from "next/navigation";

const NotebookContext = createContext<{
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    activeDocuments: Set<string>;
    setActive: (docs: Set<string>) => void;
    message: string;
    setMessage: (msg: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    notebookId: string;
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
    const [activeDocuments, setActive] = useState<Set<string>>(new Set());
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const unwrappedParams = React.use(params);
    const { notebookId } = unwrappedParams;

    const router = useRouter();

    return (
        <NotebookContext.Provider value={{
            selectedFile,
            setSelectedFile,
            activeDocuments,
            setActive,
            message,
            setMessage,
            isLoading,
            setIsLoading,
            notebookId
        }}>
            <div className={`
                    bg-gradient-to-t from-[#015a70] to-[#53003f]
                    h-[100vh]
                    w-[100vw]
                    flex
                `}>
                <div className='w-80 flex-shrink-0'>
                    <NotebookSidebar/>
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </NotebookContext.Provider>
    )
};