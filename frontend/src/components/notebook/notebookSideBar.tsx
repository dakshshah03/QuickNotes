// sidebar that loads chat tiles
// args: {chat names, chat ids} pairs, notebook id, router 
// constructs tiles in sidebar
// collapsible
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ChatTile, UploadPDFButton, DocumentTile, CreateChatButton } from './sidebarButtons';
import { uploadPDF } from '@/api/document';
import { chatItem, documentItem, loadSidebar } from '@/api/notebooks';
import { useNotebookContext } from '@/app/notebooks/[notebookId]/layout';

const SidebarContext = createContext<{
    documents: documentItem[];
    setDocuments: (doc: documentItem[]) => void;
} | null>(null);

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext must be used within a SidebarContext.Provider');
    }
    return context;
}

const NotebookSidebar = () => {
    const {
        notebookId,
        selectedFile,
        setSelectedFile,
        setMessage,
        setIsLoading,
        activeDocuments,
        setActiveDocIds,
        chats, // moved from local state
        setChats // moved from local state
    } = useNotebookContext();
    
    const [documents, setDocuments] = useState<documentItem[]>([]);
    const router = useRouter();

    const fetchSidebar = async () => {
        await loadSidebar(
            router,
            notebookId,
            setChats, // now using context
            setDocuments,
            setIsLoading,
            setMessage
        );
    };
    useEffect(() => {
        fetchSidebar();
    }, []);

    useEffect(() => {
        setActiveDocIds(new Set(documents.map(doc => doc.id)));
    }, [documents]);

    const updateDocumentStatus = (doc_id: string) => {
        const updatedSet = new Set(activeDocuments);
        if (updatedSet.has(doc_id)) {
            updatedSet.delete(doc_id);
        } else {
            updatedSet.add(doc_id);
        }
        setActiveDocIds(updatedSet);
    };

    return (
        <SidebarContext.Provider value={{
            documents,
            setDocuments
        }}>
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
                    <CreateChatButton/>
                </div>
                <div className="ml-10 mr-10 border-b border-[#ffffff6c]"/>
                <div className="
                        flex-shrink-0
                        p-[20px]
                    ">
                        <UploadPDFButton/>
                </div>
                <div className="
                        flex-shrink-0
                        p-[20px]
                    ">
                    {documents.map((dl) => (
                        <div className="flex items-center mb-2" key={dl.id}>
                            <DocumentTile
                                doc_id={dl.id}
                                documentName={dl.name}
                                isActive={activeDocuments.has(dl.id)}
                            />
                            <input 
                                type="checkbox"
                                className='mr-2'
                                checked={activeDocuments.has(dl.id)}
                                onChange={() => updateDocumentStatus(dl.id)}
                            />
                        </div>
                    ))}

                </div>
                <div className="ml-10 mr-10 mb-5 border-b border-[#ffffff6c]"/>
                <div>
                    {chats.map((cl) => ( // now using context
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
        </SidebarContext.Provider>
    )
}

export {NotebookSidebar, type chatItem}