import React from 'react';
const ChatTile = ({ chatName }: { chatName: string }) => {
    return (
        <div className={`
                h-[50px]
                pl-[20px]
                pr-[20px]
                hover:rounded-full
                hover:bg-[#72727242]
                hover:translate-y-[-3px]
                hover:shadow-xl/50
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
