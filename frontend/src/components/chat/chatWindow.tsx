import React, { useEffect, useState } from 'react';
import { sendMessage, loadMessageHistory, messageItem } from '@/api/chat';
import { useChatContext } from '@/app/notebooks/[notebookId]/[chatId]/page';
import { useRouter } from 'next/navigation';
import { MessageTile } from './messageTile';

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
    
    const fetchMessageHistory = async () => {
        await loadMessageHistory(router, chatId, notebookId, setMessageHistory, setIsLoading, setMessage);
    };

    useEffect(() => {
        fetchMessageHistory();
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
                max-h-[75vh]
            ">
                {messageHistory.map((m) => (
                    <MessageTile
                        key={m.message_id}
                        userPrompt={m.user_prompt}
                        response={m.llm_response}
                        updatedTime={m.updated_time}
                    />
                ))}
            </div>
        </div>
    )
}