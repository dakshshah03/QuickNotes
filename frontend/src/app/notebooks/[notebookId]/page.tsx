// Display notebook after clicking on it. Left sidebar will be chats
// basic notebook page will have a chat bar on the left and a "new chat" at the current page. 
// Once a message is sent in the blank chat, will create new chat and redirect user to that chat and load that chat

'use client';
import React, { useState, useEffect } from 'react';
import { NotebookSidebar } from "@/components/notebookSideBar";
import EmptyChatBox from "@/components/newChatBox";
import { useRouter, useParams } from "next/navigation";
import { chatItem, loadChatList } from '@/api/notebooks';

interface NotebookPageProps {
    params: Promise<{
        notebookId: string
    }>
};

function NotebookPage({ params }: NotebookPageProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [chats, setChats] = useState<chatItem[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const unwrappedParams = React.use(params);
    const { notebookId } = unwrappedParams;

    const router = useRouter();

    const fetchChatList = async () => {
        await loadChatList(
            router,
            notebookId,
            setChats,
            setIsLoading,
            setMessage
        );
    };

    useEffect(() => {
        fetchChatList();
    }, []);

    return (
        <div className={`
                bg-gradient-to-t from-[#015a70] to-[#53003f]
                h-[100vh]
                w-[100vw]
                flex
            `}>
            <div className='w-80 flex-shrink-0'>
                <NotebookSidebar
                    chatList={chats}
                    router={router}
                    notebookId={notebookId}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
            </div>
            <div className="flex-1">
                <EmptyChatBox></EmptyChatBox>
            </div>
        </div>
    )
};

export default NotebookPage;