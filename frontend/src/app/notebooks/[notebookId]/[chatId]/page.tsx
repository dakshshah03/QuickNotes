import React from 'react';
import { WriteMessage } from '@/components/chat/messageBox';

export default function chatPage() {
    return(
        <div className="flex flex-col h-screen">
            <div className="flex-4">
            </div>
            <div className="flex-shrink-0 flex justify-center">
                <WriteMessage/>
            </div>
        </div>
    )   
}