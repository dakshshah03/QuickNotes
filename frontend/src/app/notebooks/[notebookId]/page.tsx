// Display notebook after clicking on it. Left sidebar will be chats
// basic notebook page will have a chat bar on the left and a "new chat" at the current page. 
// Once a message is sent in the blank chat, will create new chat and redirect user to that chat and load that chat

'use client';
import React from 'react';
import EmptyChatBox from '@/components/chat/newChatWindow';
import { WriteMessage } from '@/components/chat/messageBox';

function NotebookPage() {
    return (
        <div className="flex flex-col h-screen">
            <EmptyChatBox/>
            <div className="flex-4">
            </div>
            <div className="flex-shrink-0 flex justify-center">
                {/* <WriteMessage/> */}
            </div>
        </div>
    )
};

export default NotebookPage;