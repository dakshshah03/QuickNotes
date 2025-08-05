// sidebar that loads chat tiles
// args: {chat names, chat ids} pairs, notebook id, router 
// constructs tiles in sidebar
// collapsible
import React, { useState, useEffect } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ChatTile, UploadPDFButton } from './sidebarButtons';
import { uploadPDF } from '@/api/document';
import { chatItem, documentItem, loadSidebar } from '@/api/notebooks';
// create map that creates chat tiles
// create wrapper div that has new chat button, expands on hover, and toggle expand buttons

const NotebookSidebar = ({ notebookId, setIsLoading, setMessage, activeDocuments, setActive, selectedFile, setSelectedFile, router } : {
    notebookId: string,
    selectedFile: File | null,
    activeDocuments: Set<string>,
    router: AppRouterInstance,
    setActive: React.Dispatch<React.SetStateAction<Set<string>>>,
    setMessage: (message: string) => void,
    setIsLoading: (loading: boolean) => void,
    setSelectedFile: (selectedFile: File | null) => void
}) => {
    const [chats, setChats] = useState<chatItem[]>([]);
    const [documents, setDocuments] = useState<documentItem[]>([]);

    const fetchSidebar = async () => {
        await loadSidebar(
            router,
            notebookId,
            setChats,
            setDocuments,
            setIsLoading,
            setMessage
        );
    };

    useEffect(() => {
        fetchSidebar();
    }, []);

    const updateDocumentStatus = async () => {
        
    };

    return (
        <div className="
                overflow-y-auto
                h-full
                max-h-screen
                flex
                flex-col
                bg-[#00000048]
            ">
            <div className="
                    flex-shrink-0
                    p-[20px]
                ">
                    <UploadPDFButton 
                        router={router}
                        notebookId={notebookId}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />
            </div>
            <div className="ml-10 mr-10 border-b border-[#ffffff6c]"/>
            <div className="
                    flex-shrink-0
                    p-[20px]
                ">
                {documents.map((dl) => (
                    <input 
                        type="checkbox"
                        key={dl.id}
                        className='grid min-w-full p-[5px] pr-[20px] pl-[20px]'
                    >
                    </input>
                ))}

            </div>
            <div className="ml-10 mr-10 border-b border-[#ffffff6c]"/>
            <div>
                {chats.map((cl) => (
                    <button 
                        className='grid min-w-full p-[5px] pr-[20px] pl-[20px]'
                        key={cl.id}
                        onClick={() => router.push(`/notebooks/${notebookId}/${cl.id}`)}
                    >
                        <ChatTile chatName={cl.name}></ChatTile>
                    </button>
                ))}
            </div>
        </div>
    )
}

export {NotebookSidebar, type chatItem}