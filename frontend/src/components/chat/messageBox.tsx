import React, { useEffect, useState } from 'react';
import { sendMessage, loadMessageHistory, messageItem, createChat } from '@/api/chat';
import { useRouter, useParams } from 'next/navigation';
import { useSidebarContext } from '../notebook/notebookSideBar';
import { useNotebookContext } from '@/app/notebooks/[notebookId]/layout';

interface WriteMessageProps {
    inNotebook?: boolean;
}

export const WriteMessage = ({ inNotebook = true }: WriteMessageProps) => {
    const {
        userPrompt,
        setUserPrompt,
        messageHistory,
        setMessageHistory,
        notebookId,
        setIsLoading,
        setMessage,
        activeDocuments,
        setActiveDocIds,
        chats,
        setChats
    } = useNotebookContext();
    
    const router = useRouter();
    const params = useParams();
    const chatId = params.chatId as string;
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!inputValue.trim()) return; 
        
        try {
            if (inNotebook) {
                const chatData = await createChat(
                    inputValue.substring(0, 30),
                    notebookId,
                    router
                );

                if (chatData && chatData.id) {
                    const new_msg: messageItem = {
                        'notebook_id': notebookId,
                        'chat_id': chatData.id,
                        'user_prompt': inputValue,
                        'message_id': "000tmp"
                    };
                    setChats([...chats, chatData]);

                    setUserPrompt(inputValue);
                    setMessageHistory([new_msg]);
                    sendMessage(router, new_msg, messageHistory, activeDocuments, setMessageHistory, setIsLoading, setMessage);

                    router.push(`/notebooks/${notebookId}/${chatData.id}`);
                }
            } else {
                const new_msg: messageItem = {
                    'notebook_id': notebookId,
                    'chat_id': chatId,
                    'user_prompt': inputValue, 
                    'message_id': "000tmp"
                };
                
                setUserPrompt(inputValue);
                setMessageHistory([...messageHistory, new_msg]);
                sendMessage(router, new_msg, messageHistory, activeDocuments, setMessageHistory, setIsLoading, setMessage);
            }
            
            setInputValue('');
        } catch (error) {
            console.error('Error handling message submit:', error);
            setMessage('Error processing your message. Please try again.');
        }
    };

    return (
        <form
            className="
                flex-shrink-0
                flex
                min-w-[360px]
                w-4/5
                lg:w-3/5
                mb-[20px]
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