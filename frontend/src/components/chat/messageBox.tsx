import React, { useEffect, useState } from 'react';
import { sendMessage, loadMessageHistory, messageItem } from '@/api/chat';
import { useChatContext } from '@/app/notebooks/[notebookId]/[chatId]/page';
import { useRouter } from 'next/navigation';
import { useSidebarContext } from '../notebook/notebookSideBar';
import { useNotebookContext } from '@/app/notebooks/[notebookId]/layout';

export const WriteMessage = () => {
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
    const {
        activeDocuments,
        setActiveDocIds,
    } = useNotebookContext();
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!inputValue.trim()) return; 
        
        const new_msg: messageItem = {
            'notebook_id': notebookId,
            'chat_id': chatId,
            'user_prompt': inputValue 
        };
        
        setUserPrompt(inputValue);
        setMessageHistory([...messageHistory, new_msg]);
        sendMessage(router, new_msg, messageHistory, activeDocuments, setMessageHistory, setIsLoading, setMessage);
        setInputValue('');
    };

    return (
        <form
            className="
                flex
                min-w-[360px]
                w-4/5
                lg:w-3/5
                mb-[40px]
                rounded-3xl
            "
            onSubmit={handleSubmit}
        >
            <textarea
                className="
                    flex-1
                    h-full
                    p-[20px]
                    rounded-l-3xl
                    bg-[#00000048]
                    outline-none
                    resize-none
                    align-top
                    overflow-y-auto
                    text-[20px]
                "
                placeholder="Type your message..."
                rows={1}
                style={{ minHeight: '100px', maxHeight: '120px' }}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
            />
            <div className="
                w-[120px]
                flex-shrink-0
                ml-auto
                rounded-r-3xl
                bg-[#00000048]
                flex
                items-center
                justify-center
            ">
                <button
                    type="submit"
                    className="
                    w-full
                    h-full
                    text-white
                    font-bold
                    rounded-r-3xl
                    hover:bg-[#b6b6b681]
                ">
                    Send
                </button>
            </div>
        </form>
    )
}