import React from 'react';
const ChatTile = ({ chatName }: { chatName: string }) => {
    return (
        <div className={`
                h-[50px]
                pl-[20px]
                pr-[20px]
                hover:rounded-full
                hover:bg-[#3c72848e]
                text-left
                flex
                items-center
                truncate
            `}>
            <span className="truncate">
                {chatName}
            </span>
        </div>
    )
};

export default ChatTile;