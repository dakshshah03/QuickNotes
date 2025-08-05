// Display notebook after clicking on it. Left sidebar will be chats
// basic notebook page will have a chat bar on the left and a "new chat" at the current page. 
// Once a message is sent in the blank chat, will create new chat and redirect user to that chat and load that chat

'use client';
import React, { useState, useEffect } from 'react';
import { NotebookSidebar } from "@/components/notebookSideBar";
import EmptyChatBox from "@/components/newChatBox";
import { useRouter, useParams } from "next/navigation";

async function NotebookLayout({
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
        <div className={`
                bg-gradient-to-t from-[#015a70] to-[#53003f]
                h-[100vh]
                w-[100vw]
                flex
            `}>
            <div className='w-80 flex-shrink-0'>
                <NotebookSidebar
                    notebookId={notebookId}
                    selectedFile={selectedFile}
                    activeDocuments={activeDocuments}
                    router={router}
                    setActive={setActive}
                    setMessage={setMessage}
                    setIsLoading={setIsLoading}
                    setSelectedFile={setSelectedFile}
                />
            </div>
            <div className="flex-1">
                <EmptyChatBox></EmptyChatBox>
            </div>
        </div>
    )
};

export default NotebookLayout;