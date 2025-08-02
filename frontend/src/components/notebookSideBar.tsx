// sidebar that loads chat tiles
// args: {chat names, chat ids} pairs, notebook id, router 
// constructs tiles in sidebar
// collapsible
import React from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import ChatTile from './chat/chatTile';
// create map that creates chat tiles
// create wrapper div that has new chat button, expands on hover, and toggle expand buttons

interface chatItem {
    chatName: string;
    chatId: string
}

const NotebookSidebar = ({ chatList, notebookId, router } : {chatList: chatItem[], notebookId: string, router: AppRouterInstance}) => {
    
    
    return (
        <div className="
                overflow-y-auto
                h-full
                max-h-screen
            ">
            <div>

            </div>
            {chatList.map((cl) => (
                <button 
                    className='grid min-w-full pr-[20px] pl-[20px]'
                    key={cl.chatId}
                    onClick={() => router.push(`/notebooks/${notebookId}/${cl.chatId}`)}
                >
                    <ChatTile chatName={cl.chatName}></ChatTile>
                </button>
            ))}
        
        </div>
    )
}

export {NotebookSidebar, type chatItem}