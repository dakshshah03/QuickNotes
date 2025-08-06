import React from 'react';

const EmptyChatBox = () => {
    return (
        <div className="flex flex-col h-full">
            <div className={`
                flex-1
                flex
                items-center
                justify-center
            `}>
                <span className={`
                    text-[50px]
                `}>
                    Start Conversation
                </span>
            </div>
        </div>
    )
}

export default EmptyChatBox;