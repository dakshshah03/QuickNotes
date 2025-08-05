// Display notebook after clicking on it. Left sidebar will be chats
// basic notebook page will have a chat bar on the left and a "new chat" at the current page. 
// Once a message is sent in the blank chat, will create new chat and redirect user to that chat and load that chat

'use client';
import React from 'react';
import EmptyChatBox from '@/components/newChatBox';

function NotebookPage() {
    return (
        <EmptyChatBox/>
    )
};

export default NotebookPage;