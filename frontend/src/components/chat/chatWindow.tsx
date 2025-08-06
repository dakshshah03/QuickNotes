import React from 'react';
import { messageItem } from '@/api/chat';

// entry box to write message
export const ChatWindow = () => {
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
                bg-[#00000048]
                rounded-3xl
                outline-none
                resize-none
                align-top
                overflow-y-auto
                text-[20px]">
                
            </div>
        </div>
    )
} 