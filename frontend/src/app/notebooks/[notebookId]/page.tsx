// Display notebook after clicking on it. Left sidebar will be chats
// basic notebook page will have a chat bar on the left and a "new chat" at the current page. 
// Once a message is sent in the blank chat, will create new chat and redirect user to that chat and load that chat

'use client';

import { NotebookSidebar, chatItem } from "@/components/notebookSideBar";
import { useRouter } from "next/navigation";

const nb_id = "3123123123123";
const chatlist: chatItem[] = [
    {
        chatName: "Introduction to Machine Learning",
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
    }
];


function NotebookPage() {
    const router = useRouter();
    return (
        <div>
            <NotebookSidebar chatList={chatlist} router={router} notebookId={nb_id}/>
        </div>
    )
};

export default NotebookPage;