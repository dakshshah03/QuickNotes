// sidebar that loads chat tiles
// args: {chat names, chat ids} pairs, notebook id, router 
// constructs tiles in sidebar
// collapsible
import React from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import ChatTile from './chat/chatTile';
import UploadPDFButton from './pdf_buttons';
import { uploadPDF } from '@/api/document';
import { chatItem } from '@/api/notebooks';
// create map that creates chat tiles
// create wrapper div that has new chat button, expands on hover, and toggle expand buttons

const NotebookSidebar = ({ chatList, notebookId, selectedFile, setSelectedFile, router } : {
    chatList: chatItem[],
    notebookId: string,
    selectedFile: File | null,
    setSelectedFile: (selectedFile: File | null) => void,
    router: AppRouterInstance
}) => {
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
                    bg-amber-600
                    h-[150px]
                ">
                    add button to create new chat as components
                    <br/>
                    add button to upload pdf to notebook as component
                    <UploadPDFButton 
                        router={router}
                        notebookId={notebookId}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                    />
            </div>
            <div className="mt-5 mb-5 ml-10 mr-10 border-b border-[#ffffff6c]"/>
            <div className="
                    flex-shrink-0
                    bg-amber-600
                    h-[150px]
                ">
                div with component listing all uploaded pdfs. Add checkboxes to each one w/ state variable
            </div>
            <div className="m-5 ml-10 mr-10 border-b border-[#ffffff6c]"/>
            <div>
                {chatList.map((cl) => (
                    <button 
                        className='grid min-w-full pr-[20px] pl-[20px]'
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