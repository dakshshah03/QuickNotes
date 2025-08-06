import React, { useEffect, useState } from 'react';
import { sendMessage, loadMessageHistory, messageItem } from '@/api/chat';
import { useChatContext } from '@/app/notebooks/[notebookId]/[chatId]/page';
import { useRouter } from 'next/navigation';
import { MessageTile } from './messageTile';

const dummyHistory = [{
            chat_id: "1",
            notebook_id: "1",
            user_prompt: "Hello!",
            response: "Hi there! How can I help you?",
            updated_time: "2024-06-01 10:00"
        },
        {
            chat_id: "2",
            notebook_id: "2",
            user_prompt: "What's the weather?",
            response: "It's sunny and 25°C.",
            updated_time: "2024-06-01 10:01"
        }];

export const ChatWindow = () => {
    const {
        userPrompt,
        setUserPrompt,
        messageHistory,
        setMessageHistory,
        notebookId,
        chatId,
        setIsLoading,
        setMessage
    } = useChatContext();
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    
        
    useEffect(() => {
        setMessageHistory(dummyHistory);
        // loadMessageHistory(router, chatId, notebookId, setMessageHistory, setIsLoading, setMessage);
    }, []);

    return (
        <div className="
            flex
            min-w-[360px]
            w-4/5
            lg:w-3/5
            mb-[40px]
        ">
            <div className="
                flex-1
                h-full
                p-[20px]
                rounded-3xl
                outline-none
                resize-none
                align-top
                overflow-y-auto
                text-[20px]
            ">
                {messageHistory.map((m) => (
                    <MessageTile
                        key={m.chat_id}
                        userPrompt={m.user_prompt}
                        response={m.response}
                        updatedTime={m.updated_time}
                    />
                ))}
            </div>
        </div>
    )
}