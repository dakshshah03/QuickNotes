// Display notebook after clicking on it. Left sidebar will be chats
// basic notebook page will have a chat bar on the left and a "new chat" at the current page. 
// Once a message is sent in the blank chat, will create new chat and redirect user to that chat and load that chat

'use client';
import React, { useState, useEffect } from 'react';
import { NotebookSidebar, chatItem } from "@/components/notebookSideBar";
import EmptyChatBox from "@/components/newChatBox";
import { useRouter, useParams } from "next/navigation";

// const nb_id = "3123123123123";
const chatlist: chatItem[] = [
    {
        chatName: "Introduction to Machine Learning: Deep Learning",
        chatId: "chat_001"
    },
    {
        chatName: "Data Structures Review",
        chatId: "chat_002"
    },
    {
        chatName: "Project Planning Discussion",
        chatId: "chat_003"
    },
    {
        chatName: "API Design Notes",
        chatId: "chat_004"
    },
    {
        chatName: "Bug Fixes and Testing",
        chatId: "chat_005"
    },
    {
        chatName: "Database Design Patterns",
        chatId: "chat_006"
    },
    {
        chatName: "React Best Practices",
        chatId: "chat_007"
    },
    {
        chatName: "Algorithm Optimization",
        chatId: "chat_008"
    },
    {
        chatName: "Security Implementation",
        chatId: "chat_009"
    },
    {
        chatName: "Performance Monitoring",
        chatId: "chat_010"
    },
    {
        chatName: "Code Review Guidelines",
        chatId: "chat_011"
    },
    {
        chatName: "Frontend Architecture",
        chatId: "chat_012"
    },
    {
        chatName: "Backend Services Setup",
        chatId: "chat_013"
    },
    {
        chatName: "Authentication Flow",
        chatId: "chat_014"
    },
    {
        chatName: "Deployment Strategies",
        chatId: "chat_015"
    },
    {
        chatName: "Error Handling Patterns",
        chatId: "chat_016"
    },
    {
        chatName: "Unit Testing Framework",
        chatId: "chat_017"
    },
    {
        chatName: "Integration Testing",
        chatId: "chat_018"
    },
    {
        chatName: "CI/CD Pipeline Setup",
        chatId: "chat_019"
    },
    {
        chatName: "Microservices Architecture",
        chatId: "chat_020"
    },
    {
        chatName: "GraphQL Implementation",
        chatId: "chat_021"
    },
    {
        chatName: "REST API Documentation",
        chatId: "chat_022"
    },
    {
        chatName: "Docker Configuration",
        chatId: "chat_023"
    },
    {
        chatName: "Kubernetes Deployment",
        chatId: "chat_024"
    },
    {
        chatName: "Monitoring and Logging",
        chatId: "chat_025"
    }
];

interface NotebookPageProps {
    params: Promise<{
        notebookId: string
    }>
};

function NotebookPage({ params }: NotebookPageProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const unwrappedParams = React.use(params);
    const { notebookId } = unwrappedParams;

    const router = useRouter();
    return (
        <div className={`
                bg-gradient-to-t from-[#015a70] to-[#53003f]
                flex
            `}>
            <div className='w-80 flex-shrink-0'>
                <NotebookSidebar
                    chatList={chatlist}
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